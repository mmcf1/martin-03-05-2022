import { computed, IMapDidChange, makeObservable, observable, ObservableMap, observe, runInAction } from "mobx";
import { Price, PriceLevel } from "../priceLevel/priceLevel";
import { OrderbookEventHandler } from "./orderbookEventHandler";
import { ObservableOrderbookSide, OrderbookSide } from "./orderbookSide";
import { orderbookSort, priceLevelsTotalSizeReducer } from "./orderbookUtils";

export interface OrderbookSideVisualizer extends OrderbookSide {
	readonly grouping: number;
	updateGrouping(value: number): void;
}

export class ObservableOrderbookSideVisualizer implements OrderbookSideVisualizer {
	@observable
	private observableGrouping: number;
	private readonly eventHandler = new OrderbookEventHandler(this.setPriceLevel.bind(this), this.deletePriceLevel.bind(this), this.clearLevels.bind(this));
	private observableGroupedPriceLevels: ObservableMap<Price, PriceLevel> = observable.map();

	constructor(private readonly source: ObservableOrderbookSide, initialGrouping: number) {
		makeObservable(this);
		this.observableGrouping = initialGrouping;
		this.initializeGroupedPriceLevels(this.observableGrouping);
		observe(this.source.rawPriceLevels, this.onPriceLevelChanged.bind(this));
	}

	@computed
	get side() {
		return this.source.side;
	}

	@computed
	get topPrice(): Price | undefined {
		return this.source.topPrice;
	}

	@computed
	get priceLevels() {
		return Array.from(this.observableGroupedPriceLevels.values()).sort(orderbookSort[this.side]).slice(0, 10);
	}

	@computed
	get priceLevelsWithTotalSize() {
		return priceLevelsTotalSizeReducer(this.priceLevels).slice(0, 10);
	}

	@computed
	get size() {
		return this.source.size;
	}

	@computed
	get grouping() {
		return this.observableGrouping;
	}

	updateGrouping(value: number) {
		runInAction(() => {
			this.initializeGroupedPriceLevels(value);
			this.observableGrouping = value;
		});
	}

	private initializeGroupedPriceLevels(grouping: number) {
		const groupedPriceLevels = observable.map();
		this.source.rawPriceLevels.forEach((priceLevel) => {
			const price = this.getGroupedPrice(priceLevel, grouping);
			const sizeDelta = priceLevel.size;
			const currentsize = groupedPriceLevels.get(price)?.size ?? 0;
			const size = currentsize + sizeDelta;
			groupedPriceLevels.set(price, { price, size });
		});
		runInAction(() => this.observableGroupedPriceLevels.replace(groupedPriceLevels));
	}

	private onPriceLevelChanged(change: IMapDidChange<Price, PriceLevel>) {
		let groupedPriceLevel: PriceLevel;

		switch (change.type) {
			case "add":
				groupedPriceLevel = this.handleAddChange(change);
				break;
			case "update":
				groupedPriceLevel = this.handleUpdateChange(change);
				break;
			case "delete":
				groupedPriceLevel = this.handleDeleteChange(change);
				break;
		}

		this.eventHandler.onDeltaReceived([groupedPriceLevel]);
	}

	private handleAddChange(change: IMapDidChange<Price, PriceLevel>): PriceLevel {
		if (change.type !== "add") {
			throw new Error("Invalid handler");
		}
		const price = this.getGroupedPrice(change.newValue, this.observableGrouping);
		const sizeDelta = change.newValue.size;
		const currentsize = this.observableGroupedPriceLevels.get(price)?.size ?? 0;
		const size = currentsize + sizeDelta;
		return { price, size };
	}

	private handleUpdateChange(change: IMapDidChange<Price, PriceLevel>): PriceLevel {
		if (change.type !== "update") {
			throw new Error("Invalid handler");
		}
		const price = this.getGroupedPrice(change.newValue, this.observableGrouping);
		const sizeDelta = change.newValue.size - change.oldValue.size;
		const currentsize = this.observableGroupedPriceLevels.get(price)?.size;
		const size = currentsize ? currentsize + sizeDelta : sizeDelta;
		return { price, size };
	}

	private handleDeleteChange(change: IMapDidChange<Price, PriceLevel>): PriceLevel {
		if (change.type !== "delete") {
			throw new Error("Invalid handler");
		}
		const price = this.getGroupedPrice(change.oldValue, this.observableGrouping);
		const sizeDelta = -change.oldValue.size;
		const currentsize = this.observableGroupedPriceLevels.get(price)?.size;
		const size = currentsize ? currentsize + sizeDelta : 0;
		return { price, size };
	}

	private setPriceLevel(priceLevel: PriceLevel) {
		runInAction(() => this.observableGroupedPriceLevels.set(priceLevel.price, priceLevel));
	}

	private deletePriceLevel(priceLevel: PriceLevel) {
		runInAction(() => this.observableGroupedPriceLevels.delete(priceLevel.price));
	}

	private clearLevels() {
		runInAction(() => this.observableGroupedPriceLevels.clear());
	}

	private getGroupedPrice(priceLevel: PriceLevel, grouping: number): Price {
		const price = priceLevel.price;
		return price - (price % grouping);
	}
}
