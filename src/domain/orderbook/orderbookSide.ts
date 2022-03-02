import { action, computed, makeObservable, observable, ObservableMap, runInAction } from "mobx";
import { Price, PriceLevel } from "../priceLevel/priceLevel";
import { PriceLevelProvider } from "../priceLevel/priceLevelProvider";
import { OrderbookEventHandler } from "./orderbookEventHandler";
import { Side } from "./side";

export interface OrderbookSide {
	readonly side: Side;
	readonly priceLevels: PriceLevel[];
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
		return Array.from(this.observablePriceLevels.values()).sort(this.sorts[this.side]);
	}

	private sorts: { [Key in Side]: (a: PriceLevel, b: PriceLevel) => number } = {
		buy: (a: PriceLevel, b: PriceLevel) => b.price - a.price,
		sell: (a: PriceLevel, b: PriceLevel) => a.price - b.price,
	};

	private setPriceLevel(priceLevel: PriceLevel) {
		runInAction(() => this.observablePriceLevels.set(priceLevel.price, priceLevel));
	}

	private deletePriceLevel(priceLevel: PriceLevel) {
		runInAction(() => this.observablePriceLevels.delete(priceLevel.price));
	}

	@action.bound
	private clearLevels() {
		runInAction(() => this.observablePriceLevels.clear());
	}
}
