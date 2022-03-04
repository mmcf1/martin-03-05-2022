import { Signal } from "micro-signals";
import { action } from "mobx";
import { Product } from "../../../domain/product/product";
import { Config } from "../../config/config";
import { AppStateObserver } from "../../lifecycle/appStateObserver";
import { ReconnectingWebSocket } from "../../websocket/reconnectingWebsocket";
import { isOrderbookDeltaMessage } from "./messages/orderbookDeltaMessage";
import { isOrderbookMessage } from "./messages/orderbookMessage";
import { isOrderbookSnapshotMessage } from "./messages/orderbookSnapshotMessage";
import { isOrderbookSubscriptionSucceedMessage } from "./messages/orderbookSuscriptionSucceedMessage";
import { isOrderbookUnsubscriptionSucceedMessage } from "./messages/orderbookUnscriptionSucceedMessage";
import { Delta, OrderbookWebsocketMessageSerializer, Snapshot } from "./orderbookWebsocketMessageSerializer";

export class OrderbookWebsocketService {
	private readonly messageSerializer = new OrderbookWebsocketMessageSerializer();

	private appStateObserver = new AppStateObserver();
	private webSocket: WebSocket | undefined | null;

	readonly onSocketOpened = new Signal();

	readonly onSubscribed = new Signal<{ productId: string }>();
	readonly onUnsubscribed = new Signal<{ productId: string }>();

	readonly onSnapshotReceived = new Signal<Snapshot>();
	readonly onDeltaReceived = new Signal<Delta>();

	constructor() {
		this.open();
		this.appStateObserver.onBecameActive(this.handleAppActive.bind(this), 0);
		this.appStateObserver.onBecameInactive(this.handleAppInactive.bind(this));
	}

	subscribe(product: Product) {
		console.log("Sending subscribe message");
		this.webSocket?.send(this.messageSerializer.serializeSubscribeMessage(product.id));
	}

	unsubscribe(product: Product) {
		console.log("Sending unsubscribe message");
		this.webSocket?.send(this.messageSerializer.serializeUnsubscribeMessage(product.id));
	}

	private open() {
		if (this.webSocket === undefined) {
			console.info("Opening new socket");
			this.webSocket = new ReconnectingWebSocket(Config.WEB_SOCKET_URL);
			this.addListeners(this.webSocket);
		} else {
			console.info("Socket not opening : ", "socket already defined");
		}
	}

	private close() {
		this.webSocket?.close(1001);
		this.webSocket = undefined;
	}

	private addListeners(webSocket: WebSocket) {
		webSocket.onopen = this.onOpened.bind(this);
		webSocket.onclose = this.onClosed.bind(this);
		webSocket.onerror = this.onError.bind(this);
		webSocket.onmessage = this.onMessage.bind(this);
	}

	private async onOpened() {
		console.info("Socket opened");
		this.onSocketOpened.dispatch(null);
	}

	private onClosed(event: WebSocketCloseEvent) {
		console.info("Socket closed with code : ", event.code);
	}

	private onError(event: WebSocketErrorEvent) {
		console.warn("Socket error : ", event.message);
		this.webSocket?.close();
	}

	private onMessage(event: WebSocketMessageEvent) {
		try {
			const data = event.data as string;
			if (data && data.length > 0) {
				const message = this.messageSerializer.deserializeMessage(data);
				if (isOrderbookMessage(message)) {
					if (isOrderbookSubscriptionSucceedMessage(message)) {
						console.log("Message received : ", data);
						this.onSubscribed.dispatch({ productId: message.product_ids[0] });
					} else if (isOrderbookUnsubscriptionSucceedMessage(message)) {
						console.log("Message received : ", data);
						this.onUnsubscribed.dispatch({ productId: message.product_ids[0] });
					} else if (isOrderbookSnapshotMessage(message)) {
						console.log("Snapshot received");
						const snapshot = this.messageSerializer.fromSnapshotMessage(message);
						this.onSnapshotReceived.dispatch(snapshot);
					} else if (isOrderbookDeltaMessage(message)) {
						const delta = this.messageSerializer.fromDeltaMessage(message);
						this.onDeltaReceived.dispatch(delta);
					}
				} else {
					console.warn("Unknown message type");
				}
			}
		} catch (e) {
			console.warn("Failed to deserialize message : ", e);
		}
	}

	@action.bound
	private handleAppActive() {
		this.webSocket?.readyState !== 1 && this.open();
	}

	@action.bound
	private handleAppInactive() {
		console.info("App on background state : closing socket");
		this.close();
	}
}
