import {
  GETLinkOGPreview,
  GETLinkOGPreviewApiUrl,
} from "@/types/api-types/extra/GETLinkOGPreview";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { TanstackKeys } from "../../types/tanstack-keys";

export default function useGETLinkOGPreview(
  href: string,
  queryConfig?: UseQueryOptions<GETLinkOGPreview, Error, GETLinkOGPreview, string[]>,
) {
  return useQuery(
    [TanstackKeys.LinkOGPreview, href],
    async () => {
      const res = await axios.get(
        GETLinkOGPreviewApiUrl({
          url: href,
        }),
      );

      const data = res.data as GETLinkOGPreview;

      // sort the icon array by the object's type property
      data.links.icon.sort((a, b) => {
        if (a.type === "image/png" && b.type !== "image/png") {
          return -1;
        } else if (a.type !== "image/png" && b.type === "image/png") {
          return 1;
        } else if (a.type === "image/svg" || a.type === "image/svg+xml") {
          return -1;
        } else if (b.type === "image/svg" || b.type === "image/svg+xml") {
          return 1;
        } else {
          return 0;
        }
      });

      const img = new Image();
      img.src =
        data.links.icon[0].href ||
        "https://www.google.com/s2/favicons?sz=64&domain_url=" + href;
      img.onerror = () => {
        data.links.icon[0].href =
          "https://www.google.com/s2/favicons?sz=64&domain_url=" + href;
      };
      img.remove();

      if (res.status !== 200) throw new Error(res.statusText);

      return data;
    },
    {
      ...queryConfig,
    },
  );
}
