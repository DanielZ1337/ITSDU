import { ipcMain } from "electron";
import { DeviceService } from "../services/device/device-service.ts";

function getDeviceIdHandler() {
	ipcMain.handle("device:getId", () => {
		return DeviceService.getInstance().getDeviceId();
	});
}

export default function initDeviceIpcHandlers() {
	getDeviceIdHandler();
}
