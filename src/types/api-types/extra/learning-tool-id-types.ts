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

export function isResourcePDFFromUrlOrElementType(varToCompare: ItslearningRestApiEntitiesPersonalCourseCourseResource) {
    // IconTypeId 12 is PDF (this is the only way to find out whether or not a resource is a PDF)
    const IconTypeId = 12;
    return getIconTypeIdFromUrl(varToCompare.IconUrl) === IconTypeId;
}

export function getIconTypeIdFromUrl(url: string) {
    const urlParams = new URLSearchParams(url);
    return parseInt(urlParams.get("IconTypeId") || "");
}