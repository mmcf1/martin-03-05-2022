import { OrderbookMessage } from "./orderbookMessage";

export type OrderbookUnsubscriptionSucceedMessage = OrderbookMessage<{
	event: string;
	product_ids: string[];
}>;

export function isOrderbookUnsubscriptionSucceedMessage(message: OrderbookMessage<any>): message is OrderbookUnsubscriptionSucceedMessage {
	return message.event === "unsubscribed" && message.feed === "book_ui_1" && message.product_ids !== undefined;
}
