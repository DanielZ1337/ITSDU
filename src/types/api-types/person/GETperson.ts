import { apiUrl } from "@/lib/utils.ts";
import { ItslearningRestApiEntitiesPersonSimple } from "@/types/api-types/utils/Itslearning.RestApi.Entities.PersonSimple.ts";

const GETpersonApiEndpoint = "restapi/personal/person/{personId}/v1";

export const GETpersonApiUrl = (params: GETpersonParams) =>
  apiUrl(GETpersonApiEndpoint, params);

export type GETperson = ItslearningRestApiEntitiesPersonSimple;

export type GETpersonParams = {
  personId: number;
};
