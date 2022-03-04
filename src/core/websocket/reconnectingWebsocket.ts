export class ReconnectingWebSocket implements WebSocket {
	private webSocket: WebSocket;
	private reconnectionAttempts = 0;

	private readonly connectionTimeout = 3000;
	private readonly reconnectDecay = 1.5;
	private readonly minReconnectInterval = 1000;
	private readonly maxReconnectInterval = 15000;

	constructor(
		private readonly uri: string,
		private readonly protocols?: string | string[] | null,
		private readonly options?: {
			headers: { [headerName: string]: string };
			[optionName: string]: unknown;
		} | null,
	) {
		this.webSocket = this.getWebSocket();
		this.addEventListener = this.webSocket.addEventListener;
		this.removeEventListener = this.webSocket.removeEventListener;
	}

	private _onOpen: (() => void) | null = null;
	private _onMessage: ((event: WebSocketMessageEvent) => void) | null = null;
	private _onError: ((event: WebSocketErrorEvent) => void) | null = null;
	private _onClose: ((event: WebSocketCloseEvent) => void) | null = null;

	readonly addEventListener: WebsocketEventListener;
	readonly removeEventListener: WebsocketEventListener;

	get readyState(): number {
		return this.webSocket.readyState;
	}

	send(data: string | ArrayBuffer | ArrayBufferView | Blob): void {
		this.webSocket.send(data);
	}

	close(code?: number | undefined, reason?: string | undefined): void {
		this.webSocket.close(code, reason);
	}

	// OnOpen
	get onopen(): (() => void) | null {
		return this._onOpen;
	}
	set onopen(callback: (() => void) | null) {
		this._onOpen = callback;
	}

	// OnMessage
	get onmessage(): ((event: WebSocketMessageEvent) => void) | null {
		return this._onMessage;
	}
	set onmessage(callback: ((event: WebSocketMessageEvent) => void) | null) {
		this._onMessage = callback;
	}

	// OnError
	get onerror(): ((event: WebSocketErrorEvent) => void) | null {
		return this._onError;
	}
	set onerror(callback: ((event: WebSocketErrorEvent) => void) | null) {
		this._onError = callback;
	}

	// OnClose
	get onclose(): ((event: WebSocketCloseEvent) => void) | null {
		return this._onClose;
	}
	set onclose(callback: ((event: WebSocketCloseEvent) => void) | null) {
		this._onClose = callback;
	}

	private getWebSocket(): WebSocket {
		const webSocket = new WebSocket(this.uri, this.protocols, this.options);
		webSocket.onopen = this.handleOnOpen.bind(this);
		webSocket.onmessage = this.handleOnMessage.bind(this);
		webSocket.onerror = this.handleOnError.bind(this);
		webSocket.onclose = this.handleOnClose.bind(this);
		setTimeout(() => {
			if (webSocket.readyState === 0) {
				console.log("Connection timed out closing socket");
				webSocket.close();
			}
		}, this.connectionTimeout);
		return webSocket;
	}

	// Handlers
	private handleOnOpen() {
		this.reconnectionAttempts = 0;
		this._onOpen?.();
	}

	private handleOnMessage(event: WebSocketMessageEvent) {
		this._onMessage?.(event);
	}

	private handleOnError(event: WebSocketErrorEvent) {
		this._onError?.(event);
	}

	private handleOnClose(event: WebSocketCloseEvent) {
		this._onClose?.(event);
		if (event.code && (event.code === 1000 || event.code === 1001)) {
			return;
		} else {
			this.reconnect();
		}
	}

	private reconnect() {
		this.reconnectionAttempts++;

		this.webSocket.onopen = null;
		this.webSocket.onmessage = null;
		this.webSocket.onerror = null;
		this.webSocket.onclose = null;

		const timeout = Math.min(this.maxReconnectInterval, this.minReconnectInterval * Math.pow(this.reconnectDecay, this.reconnectionAttempts));

		console.info(`Connection failed reconnecting (attempt : ${this.reconnectionAttempts}, interval : ${timeout / 1000}s)`);

		setTimeout(() => (this.webSocket = this.getWebSocket()), timeout);
	}
}
