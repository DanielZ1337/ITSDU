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

export function isResourcePDFFromUrlOrElementType(varToCompare: number | ItslearningRestApiEntitiesPersonalCourseCourseResource) {
    const elementTypeId = 131072;
    if (typeof varToCompare === "number") {
        return varToCompare === elementTypeId;
    } else {
        // @ts-ignore
        return getElementTypeIdFromUrl(varToCompare.Url) === elementTypeId;
    }
}

export function getElementTypeIdFromUrl(url: string) {
    const urlParams = new URLSearchParams(url);
    return parseInt(urlParams.get("ElementType") || "");
}