
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { findMetaData } from "@/lib/utils.ts";
import { TanstackKeys } from "../../types/tanstack-keys";

type OgPreview = {
    title: string
    description: string
    siteName: string
    url: string
    image: {
        url: string
        alt: string
        width: string | number
        height: string | number
    }
}

export default function useGETLinkOGPreview(href: string, queryConfig?: UseQueryOptions<OgPreview, Error, OgPreview, string[]>) {
    return useQuery([TanstackKeys.LinkOGPreview, href], async () => {
        if (!href || href.trim() === "" || href.trim() === "http://" || href.trim() === "https://") {
            throw new Error("No link provided");
        }

        const formattedHref = new URL(href)

        console.log(formattedHref)

        if (formattedHref.protocol !== "http:" && formattedHref.protocol !== "https:") {
            throw new Error("Invalid link protocol");
        }

        const res = await window.scrape.get(formattedHref.toString())
        const { data } = res || {};

        if (!data) {
            throw new Error("No data found");
        }

        const title = findMetaData("og:title", data);
        const description = findMetaData("og:description", data);
        const imageUrl = findMetaData("og:image", data);
        const imageAlt = findMetaData("og:image:alt", data);
        const imageWidth = findMetaData("og:image:width", data);
        const imageHeight = findMetaData("og:image:height", data);
        const siteName = findMetaData("og:site_name", data);
        const url = findMetaData("og:url", data);

        const ogPreviewData = {
            title,
            description,
            siteName,
            url,
            image: {
                url: imageUrl,
                alt: imageAlt,
                width: imageWidth || 1200,
                height: imageHeight || 630,
            },
        };

        return ogPreviewData;
    }, {
        ...queryConfig
    });
}
