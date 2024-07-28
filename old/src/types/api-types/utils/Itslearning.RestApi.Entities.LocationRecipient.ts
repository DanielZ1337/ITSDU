import {
    ItslearningRestApiEntitiesLocationRecipientType
} from "@/types/api-types/utils/Itslearning.RestApi.Entities.LocationRecipientType.ts";

export type ItslearningRestApiEntitiesLocationRecipient = {
    LocationRecipientId: number
    Type: ItslearningRestApiEntitiesLocationRecipientType
    Title: string
    ColorScheme: string
}