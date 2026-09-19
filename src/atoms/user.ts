import axios from "axios";
import { atom } from "jotai";
import { getAccessToken } from "@/lib/utils";
import {
	GETcurrentUser,
	GETcurrentUserApiUrl,
} from "@/types/api-types/person/GETcurrentUser.ts";

export const userAtom = atom(async (): Promise<GETcurrentUser | null> => {
	const res = await axios.get<GETcurrentUser>(GETcurrentUserApiUrl(), {
		params: {
			access_token: (await getAccessToken()) || "",
		},
	});

	if (res.status !== 200) throw new Error(res.statusText);

	return res.data;
});
