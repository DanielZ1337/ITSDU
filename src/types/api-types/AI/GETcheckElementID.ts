import { apiUrl } from "@/lib/utils.ts";

const GETcheckElementIDApiEndpoint = 'https://itsdu.danielz.dev/api/checkFile/{elementId}'

export const GETcheckElementIDApiUrl = (params: GETcheckElementIDParams) => {
    return apiUrl(GETcheckElementIDApiEndpoint, {
        elementId: params.elementId
    })
}

export type GETcheckElementIDParams = {
    elementId: number
}