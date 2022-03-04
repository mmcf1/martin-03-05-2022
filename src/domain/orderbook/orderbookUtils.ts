import { PriceLevel } from "../priceLevel/priceLevel";
import { Side } from "../side/side";

export const orderbookSort: { [Key in Side]: (a: PriceLevel, b: PriceLevel) => number } = {
	buy: (a: PriceLevel, b: PriceLevel) => a.price - b.price,
	sell: (a: PriceLevel, b: PriceLevel) => b.price - a.price,
};

export const priceLevelsTotalSizeReducer = (priceLevels: PriceLevel[]) => {
	return priceLevels.reduce((prev: PriceLevel[], curr: PriceLevel, index: number) => {
		const prevSize = prev.length > 0 && index >= 1 ? prev[index - 1].size : 0;
		return [...prev, { price: curr.price, size: prevSize + curr.size }];
	}, []);
};

export const orderbookSizeReducer = (priceLevels: PriceLevel[]) => {
	return priceLevels.map((level) => level.size).reduce((prev, curr) => prev + curr, 0);
};
