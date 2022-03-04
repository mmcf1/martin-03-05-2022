import { computed, makeObservable, observable, runInAction } from "mobx";
import { OrderbookWebsocketService } from "../../core/api/orderbook/orderbookWebsocketService";
import { RemotePriceLevelProvider } from "../priceLevel/remotePriceLevelProvider";
import { Product } from "../product/product";

export class OrderbookFeed {
	private products: Product[] = [
		{ id: "PI_XBTUSD", displayName: "XBTUSD" },
		{ id: "PI_ETHUSD", displayName: "ETHUSD" },
	];

	@observable
	private observableActiveProduct = this.products[1];

	@observable
	private subscribed = false;

	private websocketService = new OrderbookWebsocketService();
	private bidProvider = new RemotePriceLevelProvider(this.websocketService, "buy");
	private askProvider = new RemotePriceLevelProvider(this.websocketService, "sell");

	constructor() {
		makeObservable(this);
		this.websocketService.onSocketOpened.add(() => this.websocketService.subscribe(this.activeProduct));
		this.websocketService.onSubscribed.add(() => (this.subscribed = true));
		this.websocketService.onUnsubscribed.add(() => (this.subscribed = false));
	}

	async toggleActiveProduct() {
		const product = this.activeProduct.id === this.products[0].id ? this.products[1] : this.products[0];
		await this.unsubscribe();
		runInAction(() => (this.observableActiveProduct = product));
		await this.subscribe();
	}

	async killFeed() {
		await this.unsubscribe();
	}

	private async subscribe() {
		if (!this.subscribed) {
			return new Promise<void>((resolve, reject) => {
				this.websocketService.onSubscribed.addOnce(() => resolve());
				this.websocketService.subscribe(this.activeProduct);
				setTimeout(() => !this.subscribed && reject(), 2000);
			});
		}
	}

	private async unsubscribe() {
		if (this.subscribed) {
			return new Promise<void>((resolve, reject) => {
				this.websocketService.onUnsubscribed.addOnce(() => resolve());
				this.websocketService.unsubscribe(this.activeProduct);
				setTimeout(() => this.subscribed && reject(), 2000);
			});
		}
	}

	@computed
	get activeProduct() {
		return this.observableActiveProduct;
	}

	@computed
	get buySidePriceProvider() {
		return this.bidProvider;
	}

	@computed
	get sellSidePriceProvider() {
		return this.askProvider;
	}
}
