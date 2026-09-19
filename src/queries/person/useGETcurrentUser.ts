import { getAccessToken } from "@/lib/utils";
import {
	GETcurrentUser,
	GETcurrentUserApiUrl,
} from "@/types/api-types/person/GETcurrentUser.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import axios from "axios";
import { QueryConfig, useQueryCompat } from "@/lib/query-compat";

export default async function useGETcurrentUser(
	queryConfig?: QueryConfig<
		GETcurrentUser,
		Error,
		GETcurrentUser,
		string[]
	>,
) {
	const access_token = await getAccessToken();

	return useQueryCompat({
        queryKey: [TanstackKeys.CurrentUser, access_token],

        queryFn: async () => {
			const res = await axios.get(GETcurrentUserApiUrl(), {
				params: {
					access_token: await getAccessToken(),
				},
			});

			if (res.status !== 200) throw new Error(res.statusText);

			return res.data;
		},

        ...queryConfig
    });
}
