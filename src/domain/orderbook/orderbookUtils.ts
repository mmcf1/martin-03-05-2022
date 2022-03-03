import { PriceLevel } from "../priceLevel/priceLevel";
import { Side } from "../side/side";

export const orderbookSort: { [Key in Side]: (a: PriceLevel, b: PriceLevel) => number } = {
	buy: (a: PriceLevel, b: PriceLevel) => b.price - a.price,
	sell: (a: PriceLevel, b: PriceLevel) => b.price - a.price,
};

export const priceLevelsTotalSizeReducer = (prev: PriceLevel[], curr: PriceLevel, index: number) => {
	const prevSize = prev.length > 0 ? prev[index - 1].size : 0;
	return [...prev, { price: curr.price, size: prevSize + curr.size }];
};
