import { atom } from "jotai";

//@ts-ignore
export const deviceIdAtom = atom<string | null>(async () => {
	return await window.device.getId();
});
