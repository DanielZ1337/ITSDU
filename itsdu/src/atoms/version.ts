import { atom } from "jotai";

// @ts-ignore
export const versionAtom = atom<string>(() => {
	return (async () => {
		return await window.app.getVersion();
	})();
});
