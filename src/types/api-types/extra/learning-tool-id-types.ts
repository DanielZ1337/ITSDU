/* eslint-disable no-unused-vars */

import {
    ItslearningRestApiEntitiesPersonalCourseCourseResource
} from "@/types/api-types/utils/Itslearning.RestApi.Entities.Personal.Course.CourseResource";

export enum LearningToolIdTypes {
    LINK = 50010,
    FILE = 5009,
    BOOK = 5
}

export function isResourceFile(varToCompare: ItslearningRestApiEntitiesPersonalCourseCourseResource | number) {
    if (typeof varToCompare === "number") {
        return varToCompare === LearningToolIdTypes.FILE
    } else {
        return varToCompare.LearningToolId === LearningToolIdTypes.FILE
    }
}