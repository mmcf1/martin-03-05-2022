import { computed, IMapDidChange, makeObservable, observable, ObservableMap, observe, runInAction } from "mobx";
import { Price, PriceLevel } from "../priceLevel/priceLevel";
import { OrderbookEventHandler } from "./orderbookEventHandler";
import { ObservableOrderbookSide, OrderbookSide, orderbookSort } from "./orderbookSide";

export class ObservableOrderbookSideVisualizer implements OrderbookSide {
	private readonly eventHandler = new OrderbookEventHandler(this.setPriceLevel.bind(this), this.deletePriceLevel.bind(this), this.clearLevels.bind(this));
	private readonly observableGroupedPriceLevels: ObservableMap<Price, PriceLevel> = observable.map();

	constructor(private readonly source: ObservableOrderbookSide) {
		makeObservable(this);
		observe(this.source.rawPriceLevels, this.onPriceLevelsChanged.bind(this));
	}

	@observable
	readonly grouping = 2.5;

	@computed
	get priceLevels() {
		return Array.from(this.observableGroupedPriceLevels.values()).sort(orderbookSort[this.side]);
	}

	@computed
	get side() {
		return this.source.side;
	}

	private onPriceLevelsChanged(change: IMapDidChange<Price, PriceLevel>) {
		if (change.type === "add") {
			const price = this.getGroupedPrice(change.newValue);
			const amount = this.observableGroupedPriceLevels.get(price)?.amount ?? 0 + change.newValue.amount;
			this.eventHandler.onDeltaReceived([{ price, amount }]);
		} else if (change.type === "update") {
			const price = this.getGroupedPrice(change.newValue);
			const delta = change.newValue.amount - change.oldValue.amount;
			const amount = change.oldValue.amount + delta;
			this.eventHandler.onDeltaReceived([{ price, amount }]);
		} else if (change.type === "delete") {
			const price = this.getGroupedPrice(change.oldValue);
			const delta = -change.oldValue.amount;
			const amount = this.observableGroupedPriceLevels.get(price)?.amount ?? 0 - delta;
			this.eventHandler.onDeltaReceived([{ price, amount }]);
		}
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

	private getGroupedPrice(priceLevel: PriceLevel): Price {
		const price = priceLevel.price;
		return price - (price % this.grouping);
	}
}
