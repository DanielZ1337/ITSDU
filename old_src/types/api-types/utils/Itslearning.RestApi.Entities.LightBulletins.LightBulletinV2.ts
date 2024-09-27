import {
    ItslearningRestApiEntitiesLightBulletinsLightBulletinImage
} from "@/types/api-types/utils/Itslearning.RestApi.Entities.LightBulletins.LightBulletinImage.ts";
import {
    ItslearningRestApiEntitiesPersonSimple
} from "@/types/api-types/utils/Itslearning.RestApi.Entities.PersonSimple.ts";

export type ItslearningRestApiEntitiesLightBulletinsLightBulletinV2 = {
    LightBulletinId: number;
    Text: string;
    EmbedUrl: string;
    AllowComments: boolean;
    HasResources: boolean;
    AttachedImages: ItslearningRestApiEntitiesLightBulletinsLightBulletinImage[]
    ResourcesCount: number;
    CommentsCount: number;
    ActiveFromDate: Date;
    ActiveToDate: Date;
    IsSubscribed: boolean;
    PublishedDate: Date;
    PublishedBy: ItslearningRestApiEntitiesPersonSimple
}