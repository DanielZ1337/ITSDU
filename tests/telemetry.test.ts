import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
	enabled: false,
	packaged: true,
	post: vi.fn(),
}));
vi.mock("electron", () => ({
	app: {
		get isPackaged() {
			return state.packaged;
		},
		getVersion: () => "0.2.2",
	},
}));
vi.mock("../electron/services/device/device-service", () => ({
	DeviceService: { getInstance: () => ({ getDeviceId: () => "install-id" }) },
}));
vi.mock("../electron/services/settings/settings-service", () => ({
	SettingsService: { getInstance: () => ({ get: () => state.enabled }) },
}));
vi.mock("axios", () => ({ default: { post: state.post } }));

import { reportTelemetry } from "../electron/services/telemetry/telemetry";

describe("app health reporting", () => {
	beforeEach(() => {
		state.enabled = false;
		state.packaged = true;
		state.post.mockReset();
		state.post.mockResolvedValue({});
	});
	it("sends nothing without opt-in or from a development build", async () => {
		await reportTelemetry("download_failed");
		state.enabled = true;
		state.packaged = false;
		await reportTelemetry("download_failed");
		expect(state.post).not.toHaveBeenCalled();
	});
	it("sends only the fixed event and coarse app metadata after opt-in", async () => {
		state.enabled = true;
		await reportTelemetry("download_failed");
		expect(state.post).toHaveBeenCalledOnce();
		const [, payload] = state.post.mock.calls[0];
		expect(Object.keys(payload).sort()).toEqual([
			"deviceId",
			"event",
			"eventId",
			"platform",
			"version",
		]);
		expect(payload.event).toBe("download_failed");
	});
});
