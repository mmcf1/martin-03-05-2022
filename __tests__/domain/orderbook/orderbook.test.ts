import { Signal } from "micro-signals";
import { observable, runInAction } from "mobx";
import { instance, mock, resetCalls, when, verify } from "ts-mockito";
import { ObservableOrderbook } from "../../../src/domain/orderbook/orderbook";
import { OrderbookFeed } from "../../../src/domain/orderbook/orderbookFeed";
import { PriceLevel } from "../../../src/domain/priceLevel/priceLevel";
import { PriceLevelProvider } from "../../../src/domain/priceLevel/priceLevelProvider";

const orderbookFeedMock = mock<OrderbookFeed>();
const priceLevelProviderMock = { buy: mock<PriceLevelProvider>(), sell: mock<PriceLevelProvider>() };

const onSnapshot = { buy: new Signal<PriceLevel[]>(), sell: new Signal<PriceLevel[]>() };
const onDelta = { buy: new Signal<PriceLevel[]>(), sell: new Signal<PriceLevel[]>() };

when(priceLevelProviderMock.buy.onSnapshot).thenReturn(onSnapshot.buy);
when(priceLevelProviderMock.buy.onDelta).thenReturn(onDelta.buy);

when(priceLevelProviderMock.sell.onSnapshot).thenReturn(onSnapshot.sell);
when(priceLevelProviderMock.sell.onDelta).thenReturn(onDelta.sell);

const priceLevelProvider = { buy: instance(priceLevelProviderMock.buy), sell: instance(priceLevelProviderMock.sell) };

when(orderbookFeedMock.buySidePriceProvider).thenReturn(priceLevelProvider.buy);
when(orderbookFeedMock.sellSidePriceProvider).thenReturn(priceLevelProvider.sell);
when(orderbookFeedMock.activeProduct).thenReturn({ id: "XBTUSD", displayName: "XBTUSD", groupings: [0.5, 1, 2.5] });

beforeEach(() => {
	resetCalls(priceLevelProviderMock.buy);
	resetCalls(priceLevelProviderMock.sell);
	resetCalls(orderbookFeedMock);
});

describe("Orderbook tests suite", () => {
	test("Orderbook bid, ask & spread should be correct", () => {
		// Given
		const feed = instance(orderbookFeedMock);
		const orderbook = new ObservableOrderbook(feed);

		// When

		const bidsSnapshot = [toPriceLevel(999, 10), toPriceLevel(1000, 10), toPriceLevel(1001, 10)];
		const bidDeltas = [toPriceLevel(999, 0), toPriceLevel(999.5, 10)];

		const asksSnapshot = [toPriceLevel(997, 10), toPriceLevel(996, 10), toPriceLevel(995, 10)];
		const askDeltas = [toPriceLevel(996, 5), toPriceLevel(994, 10)];

		onSnapshot.buy.dispatch(bidsSnapshot);
		onDelta.buy.dispatch(bidDeltas);

		onSnapshot.sell.dispatch(asksSnapshot);
		onDelta.sell.dispatch(askDeltas);

		// Then
		expect(orderbook.bid).toBe(999.5);
		expect(orderbook.ask).toBe(997);
		expect(orderbook.spread).toBe(2.5);
	});

	test("Orderbook spread should be undefined when one side is empty", () => {
		// Given
		const feed = instance(orderbookFeedMock);
		const orderbook = new ObservableOrderbook(feed);
		const bidsSnapshot = [toPriceLevel(999, 10), toPriceLevel(1000, 10), toPriceLevel(1001, 10)];
		onSnapshot.buy.dispatch(bidsSnapshot);

		// Then
		expect(orderbook.spread).toBe(undefined);
	});

	test("Orderbook active product should be feed's active product", () => {
		// Given
		const activeProduct = { id: "XBTUSD", displayName: "XBTUSD", groupings: [0.5, 1, 2.5] };
		when(orderbookFeedMock.activeProduct).thenReturn(activeProduct);
		const feed = instance(orderbookFeedMock);

		// When
		const orderbook = new ObservableOrderbook(feed);

		// Then
		expect(orderbook.activeProduct).toBe(activeProduct);
	});

	test("Orderbook initial grouping should be product's first grouping", () => {
		// Given
		const feed = instance(orderbookFeedMock);

		// When
		const orderbook = new ObservableOrderbook(feed);

		// Then
		expect(orderbook.grouping).toBe(0.5);
	});

	test("Orderbook grouping should be reset when active product changes", () => {
		// Given
		const updatedActiveProduct = { id: "ETHUSD", displayName: "ETHUSD", groupings: [0.05, 0.1, 0.25] };
		const activeProduct = observable.box({ id: "XBTUSD", displayName: "XBTUSD", groupings: [0.5, 1, 2.5] });

		// Mocking getter behaviour to return observable :
		when(orderbookFeedMock.activeProduct).thenCall(() => {
			return activeProduct.get();
		});
		const feed = instance(orderbookFeedMock);

		// When
		const orderbook = new ObservableOrderbook(feed);
		expect(orderbook.grouping).toBe(0.5);
		runInAction(() => activeProduct.set(updatedActiveProduct));
		expect(orderbook.grouping).toBe(0.05);
	});

	test("Toggle grouping should iterate only over product's groupings", () => {
		// Given
		when(orderbookFeedMock.activeProduct).thenReturn({ id: "XBTUSD", displayName: "XBTUSD", groupings: [0.5, 1, 2.5] });
		const feed = instance(orderbookFeedMock);
		const orderbook = new ObservableOrderbook(feed);

		const bidsSnapshot = [toPriceLevel(999, 10), toPriceLevel(1000, 10), toPriceLevel(1001, 10)];
		const bidDeltas = [toPriceLevel(998.5, 5), toPriceLevel(999.5, 10)];

		onSnapshot.buy.dispatch(bidsSnapshot);
		onDelta.buy.dispatch(bidDeltas);

		const asksSnapshot = [toPriceLevel(997.5, 10), toPriceLevel(996, 10), toPriceLevel(995, 10)];
		const askDeltas = [toPriceLevel(996, 5), toPriceLevel(994, 10)];

		onSnapshot.sell.dispatch(asksSnapshot);
		onDelta.sell.dispatch(askDeltas);

		// When
		orderbook.toggleGrouping();
		expect(orderbook.grouping).toBe(1);
		expect(orderbook.buySide.priceLevels[0]).toEqual(toPriceLevel(998, 5));
		expect(orderbook.sellSide.priceLevels[0]).toEqual(toPriceLevel(997, 10));
		orderbook.toggleGrouping();
		expect(orderbook.grouping).toBe(2.5);
		expect(orderbook.buySide.priceLevels[0]).toEqual(toPriceLevel(997.5, 25));
		expect(orderbook.sellSide.priceLevels[0]).toEqual(toPriceLevel(997.5, 10));
		orderbook.toggleGrouping();
		expect(orderbook.grouping).toBe(0.5);
		expect(orderbook.buySide.priceLevels[0]).toEqual(toPriceLevel(998.5, 5));
		expect(orderbook.sellSide.priceLevels[0]).toEqual(toPriceLevel(997.5, 10));
	});

	test("Toggle active product and Kill feed should be delegated", () => {
		// Given
		const feed = instance(orderbookFeedMock);
		const orderbook = new ObservableOrderbook(feed);

		// When
		orderbook.toggleActiveProduct();
		orderbook.killFeed();

		// Then
		verify(orderbookFeedMock.toggleActiveProduct()).once();
		verify(orderbookFeedMock.killFeed()).once();
	});
});

function toPriceLevel(price: number, size: number): PriceLevel {
	return { price, size };
}
