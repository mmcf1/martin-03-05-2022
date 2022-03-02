import { Signal } from "micro-signals";
import { PriceLevel } from "./priceLevel";
import { PriceLevelProvider } from "./priceLevelProvider";

export class FakePriceLevelProvider implements PriceLevelProvider {
	readonly onSnapshot = new Signal<PriceLevel[]>();
	readonly onDelta = new Signal<PriceLevel[]>();

	constructor() {
		setTimeout(() => this.onSnapshot.dispatch(initialData), 300);
		setInterval(() => this.onDelta.dispatch(getRandomPriceLevels(getRandomInt(1, 3))), 200);
	}
}

function getRandomPriceLevels(count: number): PriceLevel[] {
	return Array.from({ length: count }, () => ({ price: getRandomInt(998, 1003), amount: getRandomInt(0, 10) }));
}

function getRandomInt(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

const initialData: PriceLevel[] = [
	{ price: 999.5, amount: 10 },
	{ price: 1000.5, amount: 5 },
	{ price: 1000, amount: 8 },
	{ price: 1002.5, amount: 30 },
	{ price: 1003, amount: 40 },
	{ price: 999, amount: 50 },
];
