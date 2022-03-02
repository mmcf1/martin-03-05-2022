import { Signal } from "micro-signals";
import { PriceLevel } from "./priceLevel";

export interface PriceLevelProvider {
	onSnapshot: Signal<PriceLevel[]>;
	onDelta: Signal<PriceLevel[]>;
}
