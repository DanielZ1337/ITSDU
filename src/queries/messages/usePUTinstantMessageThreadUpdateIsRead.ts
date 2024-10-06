import { getAccessToken } from "@/lib/utils";
import {
	PUTinstantMessageThreadUpdateIsReadApiUrl,
	PUTinstantMessageThreadUpdateIsReadParams,
} from "@/types/api-types/messages/PUTinstantMessageThreadUpdateIsRead.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function usePUTinstantMessageThreadUpdateIsRead(
	params?: PUTinstantMessageThreadUpdateIsReadParams,
	queryConfig?: UseMutationOptions<
		undefined,
		Error,
		PUTinstantMessageThreadUpdateIsReadParams,
		string[]
	>,
) {
	return useMutation(
		[TanstackKeys.PUTinstantMessageThreadUpdateIsRead],
		async (body: PUTinstantMessageThreadUpdateIsReadParams) => {
			const res = await axios.put(
				PUTinstantMessageThreadUpdateIsReadApiUrl(body || params),
				{},
				{
					params: {
						access_token: await getAccessToken(),
					},
				},
			);

			if (res.status !== 200) throw new Error(res.statusText);

			return res.data;
		},
		{
			...queryConfig,
		},
	);
}
