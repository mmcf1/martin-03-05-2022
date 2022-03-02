import { computed, makeObservable } from "mobx";
import { FakePriceLevelProvider } from "../priceLevel/fakePriceLevelProvider";
import { ObservableOrderbookSide, OrderbookSide } from "./orderbookSide";

export interface Orderbook {
	buySide: OrderbookSide;
	sellSide: OrderbookSide;
}

export class ObservableOrderbook {
	private bidProvider = new FakePriceLevelProvider();
	private askProvider = new FakePriceLevelProvider();

	private observableBuySide = new ObservableOrderbookSide("buy", this.bidProvider);
	private observableSellSide = new ObservableOrderbookSide("sell", this.askProvider);

	constructor() {
		makeObservable(this);
	}

	@computed
	get buySide(): OrderbookSide {
		return this.observableBuySide;
	}

	@computed
	get sellSide(): OrderbookSide {
		return this.observableSellSide;
	}
}