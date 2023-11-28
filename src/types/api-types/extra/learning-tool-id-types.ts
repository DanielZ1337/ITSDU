/* eslint-disable no-unused-vars */

import {
    ItslearningRestApiEntitiesPersonalCourseCourseResource
} from "@/types/api-types/utils/Itslearning.RestApi.Entities.Personal.Course.CourseResource";
import {ItslearningRestApiEntitiesElementLink} from "../utils/Itslearning.RestApi.Entities.ElementLink";
import {NavigateFunction, useNavigate} from "react-router-dom";

export enum LearningToolIdTypes {
    LINK = 50010,
    FILE = 5009,
    BOOK = 5
}

// TODO: add mp4, mkv (maybe other video formats as well) + JPG, PNG, GIF, SVG, etc. (maybe other image formats as well)

export function isResourceFile(varToCompare: ItslearningRestApiEntitiesPersonalCourseCourseResource | number) {
    if (typeof varToCompare === "number") {
        return varToCompare === LearningToolIdTypes.FILE
    } else {
        return varToCompare.LearningToolId === LearningToolIdTypes.FILE
    }
}

enum IconTypesForResources {
    DOCX = 1,
    XLSX = 2,
    PPTX = 3,
    PDF = 12,
    MP4 = 13,
}

//https://platform.itslearning.com/Handlers/ExtensionIconHandler.ashx?ExtensionId=5009&IconFormat=Png&IconSize=2&IconsVersion=143&UseDoubleResolutionIconSizeIfAvailable=False&UseMonochromeIconAsDefault=False

export function useNavigateToResource(navigater?: NavigateFunction) {
    const navigate = navigater || useNavigate()

    const navigateToResource = (varToCompare: ItslearningRestApiEntitiesPersonalCourseCourseResource | ItslearningRestApiEntitiesElementLink | string | number) => {
        const elementId = typeof varToCompare === "number" || typeof varToCompare === "string" ? varToCompare : varToCompare.ElementId
        if (isResourceMicrosoftOfficeDocument(varToCompare)) {
            navigate(`/documents/office/${elementId}`)
        } else if (isResourcePDFFromUrlOrElementType(varToCompare)) {
            navigate(`/documents/pdf/${elementId}`)
        } else {
            // check file extension
            const fileName = typeof varToCompare === "number" || typeof varToCompare === "string" ? varToCompare : varToCompare.Title
            const fileExtension = getFileExtension(String(fileName))
            /* switch (fileExtension) {
                case FileExtensionTypes.TXT:
                    navigate(`/documents/text/${elementId}`)
                    break;
                case FileExtensionTypes.CSV:
                    navigate(`/documents/text/${elementId}`)
                    break;
                case FileExtensionTypes.XML:
                    navigate(`/xml-files/${elementId}`)
                    break;
                case FileExtensionTypes.JSON:
                    navigate(`/documents/text/${elementId}`)
                    break;
                case FileExtensionTypes.JAVA:
                    navigate(`/java-files/${elementId}`)
                    break;
                default:
                    navigate(`/files/${elementId}`)
                    break;
            } */
            navigate(`/documents/other/${elementId}`)
        }
    }

    return navigateToResource
}

enum FileExtensionTypes {
    TXT = "txt",
    CSV = "csv",
    XML = "xml",
    JSON = "json",
    JAVA = "java",
    SQL = "sql",
    MP4 = "mp4",
    MKV = "mkv",
    JPG = "jpg",
    PNG = "png",
    GIF = "gif",
    SVG = "svg",
    JPEG = "jpeg",
    // Add more file extensions here
}

export function isResourceWithFileExtension(varToCompare: ItslearningRestApiEntitiesPersonalCourseCourseResource | ItslearningRestApiEntitiesElementLink | string | number) {
    const fileExtensions = Object.values(FileExtensionTypes) as string[];
    if (typeof varToCompare === "number" || typeof varToCompare === "string") {
        const fileExtension = getFileExtension(String(varToCompare));
        return fileExtensions.includes(fileExtension);
    } else {
        const fileExtension = getFileExtension(varToCompare.Title);
        return fileExtensions.includes(fileExtension);
    }
}

function getFileExtension(fileName: string) {
    const lastDotIndex = fileName.lastIndexOf('.');
    return fileName.substring(lastDotIndex + 1).toLowerCase();
}

export function isSupportedResourceInApp(varToCompare: ItslearningRestApiEntitiesPersonalCourseCourseResource | ItslearningRestApiEntitiesElementLink | string | number) {
    return isResourceMicrosoftOfficeDocument(varToCompare) || isResourcePDFFromUrlOrElementType(varToCompare) || isResourceWithFileExtension(varToCompare);
}

export function isResourceMicrosoftOfficeDocument(varToCompare: ItslearningRestApiEntitiesPersonalCourseCourseResource | ItslearningRestApiEntitiesElementLink | string | number) {
    // IconTypeId 1, 2 and 3 are DOCX, XLSX and PPTX respectively (this is the only way to find out whether or not a resource is a Microsoft Office Document)
    const OfficeDocumentIconTypeIds = [IconTypesForResources.DOCX, IconTypesForResources.XLSX, IconTypesForResources.PPTX];
    if (typeof varToCompare === "number") {
        return OfficeDocumentIconTypeIds.includes(varToCompare)
    } else if (typeof varToCompare === "string") {
        return OfficeDocumentIconTypeIds.includes(getIconTypeIdFromUrl(varToCompare))
    } else {
        return OfficeDocumentIconTypeIds.includes(getIconTypeIdFromUrl(varToCompare.IconUrl));
    }
}

export function isResourcePDFFromUrlOrElementType(varToCompare: ItslearningRestApiEntitiesPersonalCourseCourseResource | ItslearningRestApiEntitiesElementLink | string | number) {
    // IconTypeId 12 is PDF (this is the only way to find out whether or not a resource is a PDF)
    const IconTypeId = IconTypesForResources.PDF;
    if (typeof varToCompare === "number") {
        return varToCompare === IconTypeId
    } else if (typeof varToCompare === "string") {
        return getIconTypeIdFromUrl(varToCompare) === IconTypeId
    } else {
        return getIconTypeIdFromUrl(varToCompare.IconUrl) === IconTypeId;
    }
}

function getIconTypeIdFromUrl(url: string) {
    const urlParams = new URLSearchParams(url);
    return parseInt(urlParams.get("IconTypeId") || "");
}