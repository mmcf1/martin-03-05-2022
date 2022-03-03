import { PriceLevel } from "../priceLevel/priceLevel";

export class OrderbookEventHandler {
	constructor(
		private readonly setLevelCallback: (priceLevel: PriceLevel) => void,
		private readonly deleteLevelCallback: (priceLevel: PriceLevel) => void,
		private readonly clearLevelsCallback: () => void,
	) {}

	onSnapshotReceived(priceLevels: PriceLevel[]) {
		this.clearLevelsCallback();
		priceLevels.forEach((l) => l.size !== 0 && this.setLevelCallback(l));
	}

	onDeltaReceived(priceLevels: PriceLevel[]) {
		priceLevels.forEach((l) => (l.size === 0 ? this.deleteLevelCallback(l) : this.setLevelCallback(l)));
	}
}
