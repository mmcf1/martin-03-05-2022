import { Signal } from "micro-signals";
import { Delta, Snapshot } from "../../core/api/orderbook/orderbookWebsocketMessageSerializer";
import { OrderbookWebsocketService } from "../../core/api/orderbook/orderbookWebsocketService";
import { Side } from "../side/side";
import { PriceLevel } from "./priceLevel";
import { PriceLevelProvider } from "./priceLevelProvider";

export class RemotePriceLevelProvider implements PriceLevelProvider {
	constructor(private readonly websocketService: OrderbookWebsocketService, private readonly side: Side) {
		this.websocketService.onSnapshotReceived.add(this.handleOnSnapshotReceived.bind(this));
		this.websocketService.onDeltaReceived.add(this.handleOnDeltaReceived.bind(this));
	}

	readonly onSnapshot = new Signal<PriceLevel[]>();
	readonly onDelta = new Signal<PriceLevel[]>();

	private handleOnSnapshotReceived(snapshot: Snapshot) {
		this.onSnapshot.dispatch(snapshot[this.side]);
	}

	private handleOnDeltaReceived(delta: Delta) {
		this.onDelta.dispatch(delta[this.side]);
	}
}
