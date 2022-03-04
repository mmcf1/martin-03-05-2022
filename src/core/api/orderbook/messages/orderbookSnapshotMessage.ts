import { OrderbookMessage } from "./orderbookMessage";

export type OrderbookSnapshotMessage = OrderbookMessage<{
	numLevels: number;
	bids: [number, number][];
	asks: [number, number][];
}>;

export function isOrderbookSnapshotMessage(message: OrderbookMessage<any>): message is OrderbookSnapshotMessage {
	return message.numLevels !== undefined && message.feed === "book_ui_1_snapshot";
}
