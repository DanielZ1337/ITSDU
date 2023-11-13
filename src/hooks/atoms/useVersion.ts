import { useAtom } from "jotai/index";
import { versionAtom } from "@/atoms/version";

export const useVersion = () => {
    const [version] = useAtom(versionAtom)

    return { version }
}