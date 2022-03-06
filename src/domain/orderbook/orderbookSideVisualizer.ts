import { autorun, computed, makeObservable, observable, runInAction } from "mobx";
import { Price, PriceLevel } from "../priceLevel/priceLevel";
import { ObservableOrderbookSide, OrderbookSide } from "./orderbookSide";
import { orderbookSort, priceLevelsTotalSizeReducer } from "./orderbookUtils";

export interface OrderbookSideVisualizer extends OrderbookSide {
	readonly grouping: number;
	updateGrouping(value: number): void;
}

// Schedule UI update every 50 ms :

const defaultScheduler = (run: () => void) => {
	setTimeout(run, 50);
};

export class ObservableOrderbookSideVisualizer implements OrderbookSideVisualizer {
	@observable
	private observableGrouping: number;

	@observable
	private observableTopPrice: Price | undefined = undefined;

	@observable
	private observableSize: number = 0;

	@observable
	private observableGroupedPriceLevels: PriceLevel[] = [];

	constructor(private readonly source: ObservableOrderbookSide, initialGrouping: number, scheduler?: (run: () => void) => void) {
		makeObservable(this);
		this.observableGrouping = initialGrouping;
		autorun(() => this.refresh(), { scheduler: scheduler ?? defaultScheduler });
	}

	@computed
	get side() {
		return this.source.side;
	}

	@computed
	get topPrice(): Price | undefined {
		return this.observableTopPrice;
	}

	@computed
	get priceLevels() {
		return this.observableGroupedPriceLevels;
	}

	@computed
	get priceLevelsWithTotalSize() {
		return priceLevelsTotalSizeReducer(this.priceLevels);
	}

	@computed
	get size() {
		return this.observableSize;
	}

	@computed
	get grouping() {
		return this.observableGrouping;
	}

	updateGrouping(value: number) {
		runInAction(() => {
			this.observableGrouping = value;
			this.refresh();
		});
	}

	private refresh() {
		const size = this.source.size;
		const topPrice = this.source.topPrice;
		const groupedPriceLevels = this.getGroupedPriceLevels(this.source.rawPriceLevels, this.grouping);
		runInAction(() => {
			this.observableSize = size;
			this.observableTopPrice = topPrice;
			this.observableGroupedPriceLevels = groupedPriceLevels;
		});
	}

	private getGroupedPriceLevels(source: Map<number, PriceLevel>, grouping: number) {
		const priceLevelsMap = new Map();
		source.forEach((priceLevel) => {
			const price = this.getGroupedPrice(priceLevel, grouping);
			const sizeDelta = priceLevel.size;
			const currentsize = priceLevelsMap.get(price)?.size ?? 0;
			const size = currentsize + sizeDelta;
			priceLevelsMap.set(price, { price, size });
		});
		return Array.from(priceLevelsMap.values()).sort(orderbookSort[this.side]).slice(0, 10);
	}

	private getGroupedPrice(priceLevel: PriceLevel, grouping: number): Price {
		const price = priceLevel.price;
		return price - (price % grouping);
	}
}
