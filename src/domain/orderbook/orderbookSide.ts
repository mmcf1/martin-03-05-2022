import { computed, makeObservable, observable, ObservableMap, runInAction } from "mobx";
import { Price, PriceLevel } from "../priceLevel/priceLevel";
import { PriceLevelProvider } from "../priceLevel/priceLevelProvider";
import { Side } from "../side/side";
import { OrderbookEventHandler } from "./orderbookEventHandler";
import { orderbookSizeReducer, orderbookSort, priceLevelsTotalSizeReducer } from "./orderbookUtils";

export interface OrderbookSide {
	readonly side: Side;
	readonly topPrice: Price | undefined;
	readonly priceLevels: PriceLevel[];
	readonly priceLevelsWithTotalSize: PriceLevel[];
	readonly size: number;
}
export class ObservableOrderbookSide implements OrderbookSide {
	private readonly eventHandler = new OrderbookEventHandler(this.setPriceLevel.bind(this), this.deletePriceLevel.bind(this), this.clearLevels.bind(this));
	private readonly observablePriceLevels: ObservableMap<Price, PriceLevel> = observable.map();

	constructor(readonly side: Side, private readonly provider: PriceLevelProvider) {
		makeObservable(this);
		this.provider.onSnapshot.add(this.eventHandler.onSnapshotReceived.bind(this.eventHandler));
		this.provider.onDelta.add(this.eventHandler.onDeltaReceived.bind(this.eventHandler));
	}

	@computed
	get topPrice(): Price | undefined {
		return this.priceLevels?.[0]?.price;
	}

	@computed
	get priceLevels() {
		return Array.from(this.observablePriceLevels.values()).sort(orderbookSort[this.side]);
	}

	@computed
	get priceLevelsWithTotalSize() {
		return priceLevelsTotalSizeReducer(this.priceLevels);
	}

	@computed
	get size() {
		return orderbookSizeReducer(this.priceLevels);
	}

	@computed
	get rawPriceLevels() {
		return this.observablePriceLevels;
	}

	private setPriceLevel(priceLevel: PriceLevel) {
		runInAction(() => this.observablePriceLevels.set(priceLevel.price, priceLevel));
	}

	private deletePriceLevel(priceLevel: PriceLevel) {
		runInAction(() => this.observablePriceLevels.delete(priceLevel.price));
	}

	private clearLevels() {
		runInAction(() => this.observablePriceLevels.clear());
	}
}
