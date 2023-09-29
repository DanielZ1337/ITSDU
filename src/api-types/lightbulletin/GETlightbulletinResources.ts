import {ItslearningRestApiEntitiesElementLink} from "@/api-types/utils/Itslearning.RestApi.Entities.ElementLink.ts";
import {apiUrl} from "@/lib/utils.ts";

const GETlightbulletinResourcesApiEndpoint = "restapi/personal/courses/bulletins/{bulletinId}/elements/v1?PageIndex={PageIndex}&PageSize={PageSize}"

export const GETlightbulletinResourcesApiUrl = (params: GETlightbulletinResourcesParams) => {
    return apiUrl(GETlightbulletinResourcesApiEndpoint, {
        bulletinId: params.bulletinId,
        PageIndex: params.PageIndex,
        PageSize: params.PageSize
    })
}

export type GETlightbulletinResources = {
    EntityArray: ItslearningRestApiEntitiesElementLink[]
    Total: number
    CurrentPageIndex: number
    PageSize: number
}

export type GETlightbulletinResourcesParams = {
    bulletinId: number
    PageIndex?: number
    PageSize?: number
}