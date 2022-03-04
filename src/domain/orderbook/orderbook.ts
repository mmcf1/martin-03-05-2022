import { action, computed, makeObservable } from "mobx";
import { Price } from "../priceLevel/priceLevel";
import { Product } from "../product/product";
import { OrderbookFeed } from "./orderbookFeed";
import { ObservableOrderbookSide, OrderbookSide } from "./orderbookSide";

export interface Orderbook {
	buySide: OrderbookSide;
	sellSide: OrderbookSide;
	bid: Price | undefined;
	ask: Price | undefined;
	spread: number | undefined;
	activeProduct: Product;
	toggleActiveProduct(): Promise<void>;
	killFeed(): Promise<void>;
}

export class ObservableOrderbook implements Orderbook {
	private feed = new OrderbookFeed();
	private observableBuySide = new ObservableOrderbookSide("buy", this.feed.buySidePriceProvider);
	private observableSellSide = new ObservableOrderbookSide("sell", this.feed.sellSidePriceProvider);

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

	@computed
	get activeProduct() {
		return this.feed.activeProduct;
	}

	@action.bound
	async toggleActiveProduct() {
		await this.feed.toggleActiveProduct();
	}

	@action.bound
	async killFeed() {
		await this.feed.killFeed();
	}
}
