import {atom} from "jotai";


export const versionAtom = atom<string>(() => {
    return (async () => {
        return await window.app.getVersion();
    })();
});
