import {userAtom} from "@/atoms/user.ts";
import {useAtom} from "jotai";

export const useUser = () => {
    const [user] = useAtom(userAtom);

    return user
}
