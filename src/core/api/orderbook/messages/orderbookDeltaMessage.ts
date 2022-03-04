import { OrderbookMessage } from "./orderbookMessage";

export type OrderbookDeltaMessage = OrderbookMessage<{
	bids: [number, number][];
	asks: [number, number][];
}>;

export function isOrderbookDeltaMessage(message: OrderbookMessage<any>): message is OrderbookDeltaMessage {
	return message.feed === "book_ui_1" && message.bids !== undefined && message.asks !== undefined;
}
