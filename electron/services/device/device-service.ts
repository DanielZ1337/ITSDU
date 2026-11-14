import { randomUUID } from "node:crypto";
import Store from "electron-store";

type DeviceStore = {
	deviceId: string;
	pendingUpdateFrom?: string;
};

export class DeviceService {
	private static instance: DeviceService;
	private readonly store: Store<DeviceStore>;

	private constructor() {
		this.store = new Store<DeviceStore>({ name: "itsdu-device" });
		if (!this.store.has("deviceId")) {
			this.store.set("deviceId", randomUUID());
		}
	}

	static getInstance(): DeviceService {
		if (!DeviceService.instance) {
			DeviceService.instance = new DeviceService();
		}
		return DeviceService.instance;
	}

	getDeviceId(): string {
		return this.store.get("deviceId");
	}

	markUpdatePending(version: string): void {
		this.store.set("pendingUpdateFrom", version);
	}

	consumeUpdatePending(version: string): boolean {
		const previous = this.store.get("pendingUpdateFrom");
		if (!previous || previous === version) return false;
		this.store.delete("pendingUpdateFrom");
		return true;
	}
}

export default DeviceService;
