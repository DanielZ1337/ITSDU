//https://if.oembeditslearning.com/iframely?v=1&app=1&lazy=1&iframe=1&url=

import {apiUrl} from "@/lib/utils";

const GETLinkOGPreviewApiEndpoint = 'https://if.oembeditslearning.com/iframely';

export const GETLinkOGPreviewApiUrl = (params: GETLinkOGPreviewParams) => {
    return apiUrl(GETLinkOGPreviewApiEndpoint, {
        url: params.url,
        v: 1,
        app: 1,
        lazy: 1,
        iframe: 1
    })
}

export type GETLinkOGPreviewParams = {
    url: string;
}

export type GETLinkOGPreview = {
    meta: {
        description: string
        title: string
        site: string
        author: string
        keywords: string
        canonical: string
    }
    links: {
        thumbnail: {
            href: string
            type: string
            rel: string[]
            media: {
                width: number
                height: number
            }
        }[],
        icon: {
            href: string
            rel: string[]
            type: string
            media: {
                width: number
                height: number
            }
        }[]
    }
    rel: []
}