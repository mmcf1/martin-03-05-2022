import { PriceLevel } from "../../../domain/priceLevel/priceLevel";
import { Side } from "../../../domain/side/side";
import { OrderbookDeltaMessage } from "./messages/orderbookDeltaMessage";
import { isOrderbookMessage, OrderbookMessage } from "./messages/orderbookMessage";
import { OrderbookSnapshotMessage } from "./messages/orderbookSnapshotMessage";
import { OrderbookSusbscriptionMessage } from "./messages/orderbookSubscriptionMessage";

export type Snapshot = { [Key in Side]: PriceLevel[] };
export type Delta = { [Key in Side]: PriceLevel[] };

type BidAskDto = [number, number];

export class OrderbookWebsocketMessageSerializer {
	serializeSubscriptionMessage(productId: string) {
		const message = this.toSubscriptionMessage(productId);
		return JSON.stringify(message);
	}

	deserializeMessage(messageData: string): OrderbookMessage<unknown> {
		const message = JSON.parse(messageData) as OrderbookMessage<unknown>;
		if (!isOrderbookMessage(message)) {
			throw new Error("Invalid message");
		} else {
			return message;
		}
	}

	fromSnapshotMessage(message: OrderbookSnapshotMessage): Snapshot {
		return { buy: message.asks.map(this.fromBidAskDto), sell: message.bids.map(this.fromBidAskDto) };
	}

	fromDeltaMessage(message: OrderbookDeltaMessage): Delta {
		return { buy: message.asks.map(this.fromBidAskDto), sell: message.bids.map(this.fromBidAskDto) };
	}

	private toSubscriptionMessage(productId: string): OrderbookSusbscriptionMessage {
		return { event: "subscribe", feed: "book_ui_1", product_ids: [productId] };
	}

	private fromBidAskDto(dto: BidAskDto): PriceLevel {
		return { price: dto[0], size: dto[1] };
	}
}
