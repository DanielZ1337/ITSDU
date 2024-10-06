import { versionAtom } from "@/atoms/version";
import { useAtom } from "jotai";

export const useVersion = () => {
  const [version] = useAtom(versionAtom);

  return { version };
};
