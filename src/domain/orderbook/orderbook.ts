import { action, computed, makeObservable, observable, reaction, runInAction } from "mobx";
import { Price } from "../priceLevel/priceLevel";
import { Product } from "../product/product";
import { ObservableOrderbookFeed } from "./orderbookFeed";
import { ObservableOrderbookSide, OrderbookSide } from "./orderbookSide";
import { ObservableOrderbookSideVisualizer } from "./orderbookSideVisualizer";

export interface Orderbook {
	activeProduct: Product;
	buySide: OrderbookSide;
	sellSide: OrderbookSide;
	grouping: number;
	bid: Price | undefined;
	ask: Price | undefined;
	spread: number | undefined;
	toggleGrouping(): void;
	toggleActiveProduct(): Promise<void>;
	killFeed(): Promise<void>;
}

export class ObservableOrderbook implements Orderbook {
	private feed = new ObservableOrderbookFeed();

	private observableBuySide = new ObservableOrderbookSide("buy", this.feed.buySidePriceProvider);
	private observableSellSide = new ObservableOrderbookSide("sell", this.feed.sellSidePriceProvider);

	@observable
	private observableGrouping = this.feed.activeProduct.groupings[0];

	private buySideVisualizer = new ObservableOrderbookSideVisualizer(this.observableBuySide, this.grouping);
	private sellSideVisualizer = new ObservableOrderbookSideVisualizer(this.observableSellSide, this.grouping);

	constructor() {
		makeObservable(this);
		reaction(
			() => this.feed.activeProduct,
			() => this.resetGrouping(),
		);
	}

	@computed
	get activeProduct() {
		return this.feed.activeProduct;
	}

	@computed
	get buySide() {
		return this.buySideVisualizer;
	}

	@computed
	get sellSide() {
		return this.sellSideVisualizer;
	}

	@computed
	get grouping() {
		return this.observableGrouping;
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

	@action.bound
	toggleGrouping() {
		runInAction(() => {
			let index = 1 + this.activeProduct.groupings.findIndex((group) => group === this.observableGrouping);
			index = index >= this.activeProduct.groupings.length ? 0 : index;
			const grouping = this.activeProduct.groupings[index];
			this.observableGrouping = grouping;
			this.buySideVisualizer.updateGrouping(grouping);
			this.sellSideVisualizer.updateGrouping(grouping);
		});
	}

	@action.bound
	async toggleActiveProduct() {
		await this.feed.toggleActiveProduct();
	}

	@action.bound
	async killFeed() {
		await this.feed.killFeed();
	}

	private resetGrouping() {
		runInAction(() => {
			this.observableGrouping = this.activeProduct.groupings[0];
			this.buySideVisualizer.updateGrouping(this.observableGrouping);
			this.sellSideVisualizer.updateGrouping(this.observableGrouping);
		});
	}
}
