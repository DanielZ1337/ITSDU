import {apiUrl} from "@/lib/utils.ts";

const GETssoUrlApiEndpoint = 'restapi/personal/sso/url/v1?url={url}';

export const GETssoUrlApiUrl = (params: GETssoUrlParams) => {
    return apiUrl(GETssoUrlApiEndpoint, {
        url: params.url
    });
}

export type GETssoUrl = {
    Url: string
}

export type GETssoUrlParams = {
    url: string
}