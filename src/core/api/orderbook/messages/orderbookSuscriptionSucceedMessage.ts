import { OrderbookMessage } from "./orderbookMessage";

export type OrderbookSusbscriptionSucceedMessage = OrderbookMessage<{
	event: string;
	product_ids: string[];
}>;

export function isOrderbookSubscriptionSucceedMessage(message: OrderbookMessage<any>): message is OrderbookSusbscriptionSucceedMessage {
	return message.event === "subscribed" && message.feed === "book_ui_1" && message.product_ids !== undefined;
}
