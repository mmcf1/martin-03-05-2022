import { isOrderbookInfoMessage } from "./orderbookInfoMessage";

export type OrderbookMessage<T> = {
	feed: string;
} & T;

export function isOrderbookMessage(message: any): message is OrderbookMessage<unknown> {
	return message.feed !== undefined || isOrderbookInfoMessage(message);
}
