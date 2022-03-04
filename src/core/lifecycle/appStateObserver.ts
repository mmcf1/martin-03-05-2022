import { AppState, AppStateStatus, NativeEventSubscription } from "react-native";

export class AppStateObserver {
	private readonly appStateChangedListener: (state: AppStateStatus) => void = this.onAppStateChanged.bind(this);
	private previousAppStateStatus: AppStateStatus = "unknown";
	private eventSubscription: NativeEventSubscription | null = null;

	private duration = 10;
	private activeCallback: (() => void) | undefined = undefined;
	private inactiveCallback: (() => void) | undefined = undefined;

	constructor() {
		this.eventSubscription = AppState.addEventListener("change", this.appStateChangedListener);
	}

	dispose() {
		this.eventSubscription?.remove();
	}

	onBecameActive(callback: () => void, secondsInBackground: number = this.duration) {
		this.activeCallback = callback;
		if (secondsInBackground !== undefined) {
			this.duration = secondsInBackground;
		}
		this.previousAppStateStatus = AppState.currentState;
	}

	onBecameInactive(callback: () => void) {
		this.inactiveCallback = callback;
	}

	private onAppStateChanged(status: AppStateStatus) {
		if (status === "active" && (this.previousAppStateStatus === "background" || this.previousAppStateStatus === "inactive")) {
			this.activeCallback?.();
		} else if (status !== "active" && this.previousAppStateStatus === "active") {
			this.inactiveCallback?.();
		}

		this.previousAppStateStatus = status;
	}
}
