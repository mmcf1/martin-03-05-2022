import { computed, makeObservable } from "mobx";
import { FakePriceLevelProvider } from "../priceLevel/fakePriceLevelProvider";
import { Price } from "../priceLevel/priceLevel";
import { ObservableOrderbookSide, OrderbookSide } from "./orderbookSide";

export interface Orderbook {
	buySide: OrderbookSide;
	sellSide: OrderbookSide;
	bid: Price | undefined;
	ask: Price | undefined;
	spread: number | undefined;
}

export class ObservableOrderbook implements Orderbook {
	private bidProvider = new FakePriceLevelProvider("buy");
	private askProvider = new FakePriceLevelProvider("sell");

	private observableBuySide = new ObservableOrderbookSide("buy", this.bidProvider);
	private observableSellSide = new ObservableOrderbookSide("sell", this.askProvider);

	constructor() {
		makeObservable(this);
	}

	@computed
	get buySide() {
		return this.observableBuySide;
	}

	@computed
	get sellSide() {
		return this.observableSellSide;
	}

	@computed
	get bid() {
		return this.observableBuySide.topPrice;
	}

	@computed
	get ask(): Price | undefined {
		return this.observableSellSide.topPrice;
	}

	@computed
	get spread(): number | undefined {
		if (this.bid !== undefined && this.ask !== undefined) {
			return this.bid - this.ask;
		}
	}
}
