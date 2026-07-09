import { deviceIdAtom } from "@/atoms/device.ts";
import { useAtom } from "jotai";

export const useDeviceId = () => {
	const [deviceId] = useAtom(deviceIdAtom);

	return deviceId;
};
