import { PriceLevel } from "../priceLevel/priceLevel";
import { Side } from "./side";

export const orderbookSort: { [Key in Side]: (a: PriceLevel, b: PriceLevel) => number } = {
	buy: (a: PriceLevel, b: PriceLevel) => b.price - a.price,
	sell: (a: PriceLevel, b: PriceLevel) => a.price - b.price,
};

export const priceLevelsTotalAmountReducer = (prev: PriceLevel[], curr: PriceLevel, index: number) => {
	const prevAmount = prev.length > 0 ? prev[index - 1].amount : 0;
	return [...prev, { price: curr.price, amount: prevAmount + curr.amount }];
};
