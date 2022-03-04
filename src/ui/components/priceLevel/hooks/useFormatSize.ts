import numeral from "numeral";
import { useMemo } from "react";
import { Size } from "../../../../domain/priceLevel/priceLevel";

export function useFormatSize(size: Size) {
	return useMemo(() => numeral(size).format("0,0"), [size]);
}
