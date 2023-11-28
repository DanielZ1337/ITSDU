/* eslint-disable no-unused-vars */

import {
    ItslearningRestApiEntitiesPersonalCourseCourseResource
} from "@/types/api-types/utils/Itslearning.RestApi.Entities.Personal.Course.CourseResource";
import { ItslearningRestApiEntitiesElementLink } from "../utils/Itslearning.RestApi.Entities.ElementLink";
import { NavigateFunction, useNavigate } from "react-router-dom";

export enum LearningToolIdTypes {
    LINK = 50010,
    FILE = 5009,
    BOOK = 5
}

// TODO: add mp4, mkv (maybe other video formats as well) + JPG, PNG, GIF, SVG, etc. (maybe other image formats as well)

export function isResourceFile(resource: ItslearningRestApiEntitiesPersonalCourseCourseResource | number) {
    if (typeof resource === "number") {
        return resource === LearningToolIdTypes.FILE
    } else {
        return resource.LearningToolId === LearningToolIdTypes.FILE
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

    const navigateToResource = (resource: ItslearningRestApiEntitiesPersonalCourseCourseResource | ItslearningRestApiEntitiesElementLink | string | number) => {
        const elementId = typeof resource === "number" || typeof resource === "string" ? resource : resource.ElementId
        if (isResourceMicrosoftOfficeDocument(resource)) {
            navigate(`/documents/office/${elementId}`)
        } else if (isResourcePDFFromUrlOrElementType(resource)) {
            navigate(`/documents/pdf/${elementId}`)
        } else if (isResourceWithFileExtension(resource)) {
            // check file extension
            const fileName = typeof resource === "number" || typeof resource === "string" ? resource : resource.Title
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
        } else {
            if (typeof resource === "number") return
            const url = typeof resource === "string" ? resource : resource.Url
            window.app.openExternal(url, true)
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

export function isResourceWithFileExtension(resource: ItslearningRestApiEntitiesPersonalCourseCourseResource | ItslearningRestApiEntitiesElementLink | string | number) {
    const fileExtensions = Object.values(FileExtensionTypes) as string[];
    if (typeof resource === "number" || typeof resource === "string") {
        const fileExtension = getFileExtension(String(resource));
        return fileExtensions.includes(fileExtension);
    } else {
        const fileExtension = getFileExtension(resource.Title);
        return fileExtensions.includes(fileExtension);
    }
}

function getFileExtension(fileName: string) {
    const lastDotIndex = fileName.lastIndexOf('.');
    return fileName.substring(lastDotIndex + 1).toLowerCase();
}

export function isSupportedResourceInApp(resource: ItslearningRestApiEntitiesPersonalCourseCourseResource | ItslearningRestApiEntitiesElementLink | string | number) {
    return isResourceMicrosoftOfficeDocument(resource) || isResourcePDFFromUrlOrElementType(resource) || isResourceWithFileExtension(resource);
}

export function isResourceMicrosoftOfficeDocument(resource: ItslearningRestApiEntitiesPersonalCourseCourseResource | ItslearningRestApiEntitiesElementLink | string | number) {
    // IconTypeId 1, 2 and 3 are DOCX, XLSX and PPTX respectively (this is the only way to find out whether or not a resource is a Microsoft Office Document)
    const OfficeDocumentIconTypeIds = [IconTypesForResources.DOCX, IconTypesForResources.XLSX, IconTypesForResources.PPTX];
    if (typeof resource === "number") {
        return OfficeDocumentIconTypeIds.includes(resource)
    } else if (typeof resource === "string") {
        return OfficeDocumentIconTypeIds.includes(getIconTypeIdFromUrl(resource))
    } else {
        return OfficeDocumentIconTypeIds.includes(getIconTypeIdFromUrl(resource.IconUrl));
    }
}

export function isResourcePDFFromUrlOrElementType(resource: ItslearningRestApiEntitiesPersonalCourseCourseResource | ItslearningRestApiEntitiesElementLink | string | number) {
    // IconTypeId 12 is PDF (this is the only way to find out whether or not a resource is a PDF)
    const IconTypeId = IconTypesForResources.PDF;
    if (typeof resource === "number") {
        return resource === IconTypeId
    } else if (typeof resource === "string") {
        return getIconTypeIdFromUrl(resource) === IconTypeId
    } else {
        return getIconTypeIdFromUrl(resource.IconUrl) === IconTypeId;
    }
}

function getIconTypeIdFromUrl(url: string) {
    const urlParams = new URLSearchParams(url);
    return parseInt(urlParams.get("IconTypeId") || "");
}