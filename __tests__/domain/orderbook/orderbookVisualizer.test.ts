import { observable } from "mobx";
import { instance, mock, resetCalls, when } from "ts-mockito";
import { ObservableOrderbookSide } from "../../../src/domain/orderbook/orderbookSide";
import { ObservableOrderbookSideVisualizer } from "../../../src/domain/orderbook/orderbookSideVisualizer";
import { Price, PriceLevel } from "../../../src/domain/priceLevel/priceLevel";

const orderbookSideMock = mock<ObservableOrderbookSide>();
const noDelayScheduler = (run: () => void) => {
	run();
};

beforeEach(() => {
	resetCalls(orderbookSideMock);
});

describe("OrderbookVisualizer tests suite", () => {
	test("Side, topPrice, size should be correctly delegated", () => {
		// Given
		when(orderbookSideMock.rawPriceLevels).thenReturn(observable.map());
		when(orderbookSideMock.side).thenReturn("buy");
		when(orderbookSideMock.topPrice).thenReturn(100);
		when(orderbookSideMock.size).thenReturn(1000);

		const orderbookSideInstance = instance(orderbookSideMock);
		const visualizer = new ObservableOrderbookSideVisualizer(orderbookSideInstance, 10, noDelayScheduler);

		// Then
		expect(visualizer.side).toBe("buy");
		expect(visualizer.topPrice).toBe(100);
		expect(visualizer.size).toBe(1000);
	});

	test("Grouping should be correctly computed", () => {
		// Given
		const levels = observable.map<Price, PriceLevel>();
		levels.set(996, { price: 996, size: 10 });
		levels.set(998.5, { price: 998.5, size: 10 });
		levels.set(999.5, { price: 999.5, size: 10 });
		levels.set(1000, { price: 1000, size: 10 });

		when(orderbookSideMock.rawPriceLevels).thenReturn(levels);
		when(orderbookSideMock.side).thenReturn("buy");
		when(orderbookSideMock.rawPriceLevels).thenReturn();

		const orderbookSideInstance = instance(orderbookSideMock);
		const visualizer = new ObservableOrderbookSideVisualizer(orderbookSideInstance, 2.5, noDelayScheduler);

		// Then
		const expectedGroupedLevels_2_5 = [
			{ price: 995, size: 10 },
			{ price: 997.5, size: 30 },
			{ price: 1000, size: 40 },
		];

		const expectedGroupedLevels_10 = [
			{ price: 990, size: 30 },
			{ price: 1000, size: 40 },
		];

		const expectedGroupedLevels_AfterUpdates = [
			{ price: 990, size: 20 },
			{ price: 1000, size: 45 },
		];

		// Initial grouping test:
		expect(visualizer.priceLevelsWithTotalSize).toEqual(expectedGroupedLevels_2_5);

		// Grouping update test:
		visualizer.updateGrouping(10);
		expect(visualizer.priceLevelsWithTotalSize).toEqual(expectedGroupedLevels_10);

		// Levels update test:
		levels.delete(998.5);
		levels.set(1001, { price: 1001, size: 5 });
		levels.set(1000, { price: 1000, size: 20 });
		expect(visualizer.priceLevelsWithTotalSize).toEqual(expectedGroupedLevels_AfterUpdates);
	});
});
