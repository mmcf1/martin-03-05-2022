import { Signal } from "micro-signals";
import { instance, mock, resetCalls, when } from "ts-mockito";
import { ObservableOrderbookSide, OrderbookSide } from "../../../src/domain/orderbook/orderbookSide";
import { PriceLevel } from "../../../src/domain/priceLevel/priceLevel";
import { PriceLevelProvider } from "../../../src/domain/priceLevel/priceLevelProvider";

const priceLevelProviderMock = mock<PriceLevelProvider>();
const priceLevelProviderInstance = instance(priceLevelProviderMock);

const onSnapshot = new Signal<PriceLevel[]>();
const onDelta = new Signal<PriceLevel[]>();

when(priceLevelProviderMock.onSnapshot).thenReturn(onSnapshot);
when(priceLevelProviderMock.onDelta).thenReturn(onDelta);

beforeEach(() => {
	resetCalls(priceLevelProviderMock);
});

describe("Orderbook should be consistent after snapshot and deltas", () => {
	test("Orderbook size should be correct", () => {
		// Given
		const orderbookSide: OrderbookSide = new ObservableOrderbookSide("buy", priceLevelProviderInstance);

		// When
		priceLevelProviderInstance.onSnapshot.dispatch([toPriceLevel(1000, 10), toPriceLevel(1001, 10)]);
		expect(orderbookSide.size).toBe(20);

		priceLevelProviderInstance.onDelta.dispatch([toPriceLevel(1000, 15), toPriceLevel(1001, 10)]);
		expect(orderbookSide.size).toBe(25);

		priceLevelProviderInstance.onDelta.dispatch([toPriceLevel(1000, 0), toPriceLevel(1001, 10)]);
		expect(orderbookSide.size).toBe(10);
	});

	test("Orderbook levels sort and total size should be corrects", () => {
		// Given
		const orderbookBuySide = new ObservableOrderbookSide("buy", priceLevelProviderInstance);
		const orderbookSellSide = new ObservableOrderbookSide("sell", priceLevelProviderInstance);

		// When
		priceLevelProviderInstance.onSnapshot.dispatch([toPriceLevel(997, 10), toPriceLevel(998, 10)]);
		priceLevelProviderInstance.onDelta.dispatch([toPriceLevel(1000, 10), toPriceLevel(1001, 10)]);
		priceLevelProviderInstance.onDelta.dispatch([toPriceLevel(999, 15), toPriceLevel(1000, 5), toPriceLevel(998, 0)]);

		// Then
		expect(orderbookBuySide.priceLevels).toEqual([toPriceLevel(997, 10), toPriceLevel(999, 15), toPriceLevel(1000, 5), toPriceLevel(1001, 10)]);
		expect(orderbookSellSide.priceLevels).toEqual([toPriceLevel(1001, 10), toPriceLevel(1000, 5), toPriceLevel(999, 15), toPriceLevel(997, 10)]);

		expect(orderbookBuySide.priceLevelsWithTotalSize).toEqual([toPriceLevel(997, 10), toPriceLevel(999, 25), toPriceLevel(1000, 30), toPriceLevel(1001, 40)]);
		expect(orderbookSellSide.priceLevelsWithTotalSize).toEqual([toPriceLevel(1001, 10), toPriceLevel(1000, 15), toPriceLevel(999, 30), toPriceLevel(997, 40)]);
	});

	test("Orderbook top price should be correct", () => {
		// Given
		const orderbookBuySide = new ObservableOrderbookSide("buy", priceLevelProviderInstance);
		const orderbookSellSide = new ObservableOrderbookSide("sell", priceLevelProviderInstance);

		// When
		priceLevelProviderInstance.onSnapshot.dispatch([toPriceLevel(999, 5), toPriceLevel(1000, 10), toPriceLevel(1001, 10)]);
		priceLevelProviderInstance.onDelta.dispatch([toPriceLevel(1000, 5), toPriceLevel(1001, 5)]);

		// Then
		expect(orderbookBuySide.topPrice).toBe(999);
		expect(orderbookSellSide.topPrice).toBe(1001);
	});
});

function toPriceLevel(price: number, size: number): PriceLevel {
	return { price, size };
}
