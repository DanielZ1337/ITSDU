import { ItslearningRestApiEntitiesLightBulletinsLightBulletinV2 } from "@/types/api-types/utils/Itslearning.RestApi.Entities.LightBulletins.LightBulletinV2.ts";
import { apiUrl } from "@/lib/utils";

const GETbulletinApiEndpoint = "restapi/personal/bulletins/{bulletinId}/v2";

export const GETbulletinApiUrl = (params: GETbulletinParams) => {
	return apiUrl(GETbulletinApiEndpoint, {
		bulletinId: params.bulletinId,
	});
};

export type GETbulletin =
	ItslearningRestApiEntitiesLightBulletinsLightBulletinV2;

export type GETbulletinParams = {
	bulletinId: number;
};
