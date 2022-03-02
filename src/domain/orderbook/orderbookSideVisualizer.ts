import { computed, IMapDidChange, makeObservable, observable, ObservableMap, observe, runInAction } from "mobx";
import { Price, PriceLevel } from "../priceLevel/priceLevel";
import { OrderbookEventHandler } from "./orderbookEventHandler";
import { ObservableOrderbookSide, OrderbookSide, orderbookSort } from "./orderbookSide";

export class ObservableOrderbookSideVisualizer implements OrderbookSide {
	private readonly eventHandler = new OrderbookEventHandler(this.setPriceLevel.bind(this), this.deletePriceLevel.bind(this), this.clearLevels.bind(this));
	private readonly observableGroupedPriceLevels: ObservableMap<Price, PriceLevel> = observable.map();

	constructor(private readonly source: ObservableOrderbookSide) {
		makeObservable(this);
		observe(this.source.rawPriceLevels, this.onPriceLevelChanged.bind(this));
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
		const price = this.getGroupedPrice(change.newValue);
		const currentAmount = this.observableGroupedPriceLevels.get(price)?.amount ?? 0;
		const delta = change.newValue.amount;
		const amount = currentAmount + delta;
		return { price, amount };
	}

	private handleUpdateChange(change: IMapDidChange<Price, PriceLevel>): PriceLevel {
		if (change.type !== "update") {
			throw new Error("Invalid handler");
		}
		const price = this.getGroupedPrice(change.newValue);
		const delta = change.newValue.amount - change.oldValue.amount;
		const currentAmount = this.observableGroupedPriceLevels.get(price)?.amount;
		const amount = currentAmount ? currentAmount + delta : delta;
		return { price, amount };
	}

	private handleDeleteChange(change: IMapDidChange<Price, PriceLevel>): PriceLevel {
		if (change.type !== "delete") {
			throw new Error("Invalid handler");
		}
		const price = this.getGroupedPrice(change.oldValue);
		const delta = -change.oldValue.amount;
		const currentAmount = this.observableGroupedPriceLevels.get(price)?.amount;
		const amount = currentAmount ? currentAmount + delta : 0;
		return { price, amount };
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
