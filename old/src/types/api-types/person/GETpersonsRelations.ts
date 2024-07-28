import {apiUrl} from "@/lib/utils.ts";
import {ItslearningRestApiEntitiesRelation} from "@/types/api-types/utils/Itslearning.RestApi.Entities.Relation.ts";

const GETpersonsRelationsApiEndpoint = 'restapi/personal/person/relations/{personId}/v1';

export const GETpersonsRelationsApiUrl = (params: GETpersonsRelationsParams) => apiUrl(GETpersonsRelationsApiEndpoint, params);

export type GETpersonsRelations = ItslearningRestApiEntitiesRelation[];

export type GETpersonsRelationsParams = {
    personId: number
}