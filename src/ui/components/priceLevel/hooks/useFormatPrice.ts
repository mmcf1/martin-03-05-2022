import numeral from "numeral";
import { useMemo } from "react";
import { Price } from "../../../../domain/priceLevel/priceLevel";

export function useFormatPrice(price: Price) {
	return useMemo(() => numeral(price).format("0,0.00"), [price]);
}
