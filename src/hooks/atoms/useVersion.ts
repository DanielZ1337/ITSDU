import { useAtom } from "jotai";
import { versionAtom } from "@/atoms/version";

export const useVersion = () => {
    const [version] = useAtom(versionAtom)

    return { version }
}