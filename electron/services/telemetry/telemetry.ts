import { randomUUID } from "node:crypto";
import { app } from "electron";
import { DeviceService } from "../device/device-service";

export type TelemetryEvent =
	| "startup_fast"
	| "startup_normal"
	| "startup_slow"
	| "download_started"
	| "download_completed"
	| "download_failed"
	| "update_checked"
	| "update_available"
	| "update_check_failed"
	| "update_download_started"
	| "update_download_completed"
	| "update_download_failed"
	| "update_install_started"
	| "update_new_version_started"
	| "auth_refresh_succeeded"
	| "auth_refresh_terminal_failed"
	| "auth_refresh_network_failed";

/** Only fixed event names and app metadata are sent. Never send errors, URLs, or course data. */
export async function reportTelemetry(event: TelemetryEvent): Promise<void> {
	if (!app.isPackaged) return;
	try {
		const { SettingsService } = await import("../settings/settings-service");
		if (!SettingsService.getInstance().get("privacy.shareAppHealth")) return;
		const axios = (await import("axios")).default;
		await axios.post(
			"https://itsdu.danielz.dev/api/telemetry",
			{
				eventId: randomUUID(),
				deviceId: DeviceService.getInstance().getDeviceId(),
				event,
				platform: process.platform,
				version: app.getVersion(),
			},
			{ timeout: 5000 },
		);
	} catch {
		// Health reporting must never affect the operation being measured.
	}
}

export function reportStartup(milliseconds: number): void {
	const device = DeviceService.getInstance();
	const current = app.getVersion();
	void reportTelemetry(
		milliseconds < 3000
			? "startup_fast"
			: milliseconds < 8000
				? "startup_normal"
				: "startup_slow",
	);
	if (device.consumeUpdatePending(current))
		void reportTelemetry("update_new_version_started");
}
