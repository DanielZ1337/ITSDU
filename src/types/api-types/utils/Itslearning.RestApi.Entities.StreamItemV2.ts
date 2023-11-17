import { ItslearningRestApiEntitiesElementType } from './Itslearning.RestApi.Entities.ElementType';
import { ItslearningRestApiEntitiesLightBulletinsLightBulletinV2 } from './Itslearning.RestApi.Entities.LightBulletins.LightBulletinV2';
import { ItslearningRestApiEntitiesLocationType } from './Itslearning.RestApi.Entities.LocationType';
import { ItslearningRestApiEntitiesPersonSimple } from "./Itslearning.RestApi.Entities.PersonSimple";

export type ItslearningRestApiEntitiesStreamItemV2 = {
    NotificationId: number;
    Text: string;
    LocationTitle: string;
    PublishedDate: Date;
    PublishedBy: ItslearningRestApiEntitiesPersonSimple;
    Url: string;
    ContentUrl: string;
    IconUrl: string;
    LightBulletin: ItslearningRestApiEntitiesLightBulletinsLightBulletinV2;
    ElementId: number;
    ElementType: ItslearningRestApiEntitiesElementType;
    LearningToolId: number;
    HasMoreElements: boolean;
    ElementsCount: number;
    LocationType: ItslearningRestApiEntitiesLocationType;
    LocationId: number;
}