import { Signal } from "micro-signals";
import { Side } from "../side/side";
import { PriceLevel } from "./priceLevel";
import { PriceLevelProvider } from "./priceLevelProvider";

const UPDATE_INTERVAL_MS = 1000;

export class FakePriceLevelProvider implements PriceLevelProvider {
	readonly onSnapshot = new Signal<PriceLevel[]>();
	readonly onDelta = new Signal<PriceLevel[]>();

	constructor(side: Side) {
		setTimeout(() => this.onSnapshot.dispatch(initialData(sideOffset[side])), 1500);
		setInterval(() => this.onDelta.dispatch(getRandomPriceLevels(side, getRandomInt(1, 3))), UPDATE_INTERVAL_MS);
	}
}

const sideOffset = { buy: 8, sell: 0 };

function getRandomPriceLevels(side: Side, count: number): PriceLevel[] {
	return Array.from({ length: count }, () => ({ price: getRandomInt(998 + sideOffset[side], 1003 + sideOffset[side]), size: getRandomInt(0, 1) }));
}

function getRandomInt(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

const initialData = (offset: number) => {
	return [
		{ price: 999.5 + offset, size: 10 },
		{ price: 1000.5 + offset, size: 5 },
		{ price: 1000 + offset, size: 8 },
		{ price: 1002.5 + offset, size: 30 },
		{ price: 1003 + offset, size: 40 },
		{ price: 999 + offset, size: 50 },
	];
};
