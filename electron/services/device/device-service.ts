import { randomUUID } from "node:crypto";
import Store from "electron-store";

type DeviceStore = {
	deviceId: string;
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
}

export default DeviceService;
