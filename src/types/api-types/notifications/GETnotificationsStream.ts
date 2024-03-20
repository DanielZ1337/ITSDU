import {apiUrl, ITSLEARNING_API_MAX_PAGESIZE} from "@/lib/utils";
import {ItslearningRestApiEntitiesStreamItemV2} from "../utils/Itslearning.RestApi.Entities.StreamItemV2";

const GETnotificationsStreamApiEndpoint = 'restapi/personal/notifications/stream/v2?showLightBulletins={showLightBulletins}&UseNewerThan={UseNewerThan}&FromId={FromId}&PageIndex={PageIndex}&PageSize={PageSize}';

export const GETnotificationsStreamApiUrl = (params: GETnotificationsStreamParams) => apiUrl(GETnotificationsStreamApiEndpoint, params);

export type GETnotificationsStreamParams = {
    showLightBulletins?: boolean;
    FromId?: number;
    PageIndex?: number;
    PageSize?: ITSLEARNING_API_MAX_PAGESIZE;
    UseNewerThan?: boolean;
};

export type GETnotificationsStream = {
    EntityArray: ItslearningRestApiEntitiesStreamItemV2[]
    Total: number,
    CurrentPageIndex: number,
    PageSize: number,
}