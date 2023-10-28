import {userAtom} from "@/atoms/user";
import {useAtom} from "jotai";

export const useUser = () => {
    const [user] = useAtom(userAtom);

    return user;
}
