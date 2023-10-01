import {apiUrl} from "@/lib/utils.ts";
import {SystemNetHttpHttpResponseMessage} from "@/api-types/utils/System.Net.Http.HttpResponseMessage.ts";

const PUTcourseFavoriteApiEndpoint = 'RestApi/personal/courses/{courseId}/toggleFavorite/v1'

export const PUTcourseFavoriteApiUrl = (params: PUTcourseFavoriteParams) => {
    return apiUrl(PUTcourseFavoriteApiEndpoint, {
        courseId: params.courseId
    })
}

export type PUTcourseFavoriteParams = {
    courseId: number
}

export type PUTcourseFavorite = SystemNetHttpHttpResponseMessage