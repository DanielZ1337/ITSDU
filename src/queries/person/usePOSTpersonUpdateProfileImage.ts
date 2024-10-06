import {
	POSTpersonUpdateProfileImageApiResponse,
	POSTpersonUpdateProfileImageApiUrl,
} from "@/types/api-types/person/POSTpersonUpdateProfileImage";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import axios from "axios";

export const usePOSTpersonUpdateProfileImage = (
	queryConfig?: UseMutationOptions<
		POSTpersonUpdateProfileImageApiResponse,
		Error,
		FormData,
		unknown
	>,
) => {
	return useMutation(
		async (image) => {
			const res = await axios.post(
				POSTpersonUpdateProfileImageApiUrl(),
				image,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				},
			);
			return res.data;
		},
		{
			...queryConfig,
		},
	);
};
