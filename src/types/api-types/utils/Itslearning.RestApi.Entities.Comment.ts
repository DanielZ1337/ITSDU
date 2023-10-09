import {
    ItslearningRestApiEntitiesPersonSimple
} from "@/types/api-types/utils/Itslearning.RestApi.Entities.PersonSimple.ts";

export type ItslearningRestApiEntitiesComment = {
    Id: number
    Author: ItslearningRestApiEntitiesPersonSimple
    CommentText: string
    AllowEditComment: boolean
    AllowDeleteComment: boolean
    CreatedDateTime: Date
    IsRead: boolean
}