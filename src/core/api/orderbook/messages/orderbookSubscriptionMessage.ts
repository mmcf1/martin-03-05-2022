import { OrderbookMessage } from "./orderbookMessage";

export type OrderbookSusbscriptionMessage = OrderbookMessage<{
	event: string;
	product_ids: string[];
}>;
