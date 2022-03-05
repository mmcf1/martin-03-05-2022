import { computed, makeObservable, observable, runInAction } from "mobx";
import { OrderbookWebsocketService } from "../../core/api/orderbook/orderbookWebsocketService";
import { PriceLevelProvider } from "../priceLevel/priceLevelProvider";
import { RemotePriceLevelProvider } from "../priceLevel/remotePriceLevelProvider";
import { Product } from "../product/product";

export interface OrderbookFeed {
	activeProduct: Product;
	buySidePriceProvider: PriceLevelProvider;
	sellSidePriceProvider: PriceLevelProvider;
	toggleActiveProduct(): Promise<void>;
	killFeed(): Promise<void>;
}

type ProductPair = readonly [Product, Product];

export class ObservableOrderbookFeed implements OrderbookFeed {
	private websocketService = new OrderbookWebsocketService();
	private bidProvider = new RemotePriceLevelProvider(this.websocketService, "buy");
	private askProvider = new RemotePriceLevelProvider(this.websocketService, "sell");

	constructor(private products: ProductPair) {
		makeObservable(this);
		this.products = products;
		this.observableActiveProduct = products[0];
		this.websocketService.onSocketOpened.add(() => this.subscribe().catch(() => this.websocketService.close()));
		this.websocketService.onSockedClosed.add(() => (this.subscribed = false));
		this.websocketService.onSubscribed.add(() => (this.subscribed = true));
		this.websocketService.onUnsubscribed.add(() => (this.subscribed = false));
	}

	@observable
	private observableActiveProduct: Product;

	@observable
	private subscribed = false;

	async toggleActiveProduct() {
		try {
			const product = this.activeProduct.id === this.products[0].id ? this.products[1] : this.products[0];
			await this.unsubscribe();
			runInAction(() => (this.observableActiveProduct = product));
			await this.subscribe();
		} catch (e) {
			if (e instanceof AckNotReceivedError) {
				this.websocketService.close();
			}
		}
	}

	async killFeed() {
		if (this.subscribed) {
			await this.unsubscribe();
		} else {
			await this.subscribe();
		}
	}

	private async subscribe() {
		if (!this.subscribed) {
			return new Promise<void>((resolve, reject) => {
				this.websocketService.onSubscribed.addOnce(() => resolve());
				this.websocketService.subscribe(this.activeProduct);
				setTimeout(() => !this.subscribed && reject(new AckNotReceivedError()), 2000);
			});
		}
	}

	private async unsubscribe() {
		if (this.subscribed) {
			return new Promise<void>((resolve, reject) => {
				this.websocketService.onUnsubscribed.addOnce(() => resolve());
				this.websocketService.unsubscribe(this.activeProduct);
				setTimeout(() => this.subscribed && reject(AckNotReceivedError), 2000);
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

class AckNotReceivedError extends Error {
	message: string = "AckNotReceived";
}
