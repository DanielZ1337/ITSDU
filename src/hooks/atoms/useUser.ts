import { useAtom } from "jotai";
import { userAtom } from "@/atoms/user.ts";

export const useUser = () => {
	const [user] = useAtom(userAtom);

	return user;
};
