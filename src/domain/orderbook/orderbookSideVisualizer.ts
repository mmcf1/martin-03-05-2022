import { computed, IMapDidChange, makeObservable, observable, ObservableMap, observe, runInAction } from "mobx";
import { Price, PriceLevel } from "../priceLevel/priceLevel";
import { OrderbookEventHandler } from "./orderbookEventHandler";
import { ObservableOrderbookSide, OrderbookSide } from "./orderbookSide";
import { orderbookSort, priceLevelsTotalAmountReducer } from "./orderbookUtils";

export interface OrderbookSideVisualizer extends OrderbookSide {
	readonly grouping: number;
	updateGrouping(value: number): void;
}

export class ObservableOrderbookSideVisualizer implements OrderbookSideVisualizer {
	private readonly eventHandler = new OrderbookEventHandler(this.setPriceLevel.bind(this), this.deletePriceLevel.bind(this), this.clearLevels.bind(this));
	private observableGroupedPriceLevels: ObservableMap<Price, PriceLevel> = observable.map();

	constructor(private readonly source: ObservableOrderbookSide) {
		makeObservable(this);
		this.initializeGroupedPriceLevels(this.grouping);
		observe(this.source.rawPriceLevels, this.onPriceLevelChanged.bind(this));
	}

	@observable
	grouping = 2.5;

	@computed
	get side() {
		return this.source.side;
	}

	@computed
	get priceLevels() {
		return Array.from(this.observableGroupedPriceLevels.values()).sort(orderbookSort[this.side]);
	}

	@computed
	get priceLevelsWithTotalAmount() {
		return this.priceLevels.reduce(priceLevelsTotalAmountReducer, []);
	}

	@computed
	get totalAmount() {
		return this.priceLevels.map((v) => v.amount).reduce((prev, curr) => prev + curr, 0);
	}

	updateGrouping(value: number) {
		runInAction(() => {
			this.initializeGroupedPriceLevels(value);
			this.grouping = value;
		});
	}

	private initializeGroupedPriceLevels(grouping: number) {
		const groupedPriceLevels = observable.map();
		this.source.rawPriceLevels.forEach((priceLevel) => {
			const price = this.getGroupedPrice(priceLevel, grouping);
			const amountDelta = priceLevel.amount;
			const currentAmount = groupedPriceLevels.get(price)?.amount ?? 0;
			const amount = currentAmount + amountDelta;
			groupedPriceLevels.set(price, { price, amount });
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
		const price = this.getGroupedPrice(change.newValue, this.grouping);
		const amountDelta = change.newValue.amount;
		const currentAmount = this.observableGroupedPriceLevels.get(price)?.amount ?? 0;
		const amount = currentAmount + amountDelta;
		return { price, amount };
	}

	private handleUpdateChange(change: IMapDidChange<Price, PriceLevel>): PriceLevel {
		if (change.type !== "update") {
			throw new Error("Invalid handler");
		}
		const price = this.getGroupedPrice(change.newValue, this.grouping);
		const amountDelta = change.newValue.amount - change.oldValue.amount;
		const currentAmount = this.observableGroupedPriceLevels.get(price)?.amount;
		const amount = currentAmount ? currentAmount + amountDelta : amountDelta;
		return { price, amount };
	}

	private handleDeleteChange(change: IMapDidChange<Price, PriceLevel>): PriceLevel {
		if (change.type !== "delete") {
			throw new Error("Invalid handler");
		}
		const price = this.getGroupedPrice(change.oldValue, this.grouping);
		const amountDelta = -change.oldValue.amount;
		const currentAmount = this.observableGroupedPriceLevels.get(price)?.amount;
		const amount = currentAmount ? currentAmount + amountDelta : 0;
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

	private getGroupedPrice(priceLevel: PriceLevel, grouping: number): Price {
		const price = priceLevel.price;
		return price - (price % grouping);
	}
}
