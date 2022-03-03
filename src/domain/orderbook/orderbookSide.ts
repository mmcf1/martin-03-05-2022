import { computed, makeObservable, observable, ObservableMap, runInAction } from "mobx";
import { Price, PriceLevel } from "../priceLevel/priceLevel";
import { PriceLevelProvider } from "../priceLevel/priceLevelProvider";
import { Side } from "../side/side";
import { OrderbookEventHandler } from "./orderbookEventHandler";
import { orderbookSort, priceLevelsTotalSizeReducer } from "./orderbookUtils";

export interface OrderbookSide {
	readonly side: Side;
	readonly priceLevels: PriceLevel[];
	readonly priceLevelsWithTotalSize: PriceLevel[];
	readonly bookSize: number;
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
	get priceLevels() {
		return Array.from(this.observablePriceLevels.values()).sort(orderbookSort[this.side]);
	}

	@computed
	get priceLevelsWithTotalSize() {
		return this.priceLevels.reduce(priceLevelsTotalSizeReducer, []);
	}

	@computed
	get bookSize() {
		return this.priceLevels.map((v) => v.size).reduce((prev, curr) => prev + curr, 0);
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
