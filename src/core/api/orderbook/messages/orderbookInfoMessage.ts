export type OrderbookInfoMessage = {
	event: string;
	version: string;
};

export function isOrderbookInfoMessage(message: any): message is OrderbookInfoMessage {
	return message.event !== undefined;
}
