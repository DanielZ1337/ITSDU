import {
  POSTpersonUpdateProfileImageApiResponse,
  POSTpersonUpdateProfileImageApiUrl,
} from "@/types/api-types/person/POSTpersonUpdateProfileImage";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import axios from "axios";

export const usePOSTpersonUpdateProfileImage = (
  queryConfig?: UseMutationOptions<
    POSTpersonUpdateProfileImageApiResponse,
    Error,
    FormData,
    unknown
  >
) => {
  return useMutation({
    // mutationKey: [TanstackKeys.PersonUpdateProfileImage],
    mutationKey: ["personUpdateProfileImage"],
    mutationFn: async (image) => {
      const res = await axios.post(
        POSTpersonUpdateProfileImageApiUrl(),
        image,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data;
    },
    ...queryConfig,
  });
};
