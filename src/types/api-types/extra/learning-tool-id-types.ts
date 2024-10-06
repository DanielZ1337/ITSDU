/* eslint-disable no-unused-vars */

import { ItslearningRestApiEntitiesPersonalCourseCourseResource } from "@/types/api-types/utils/Itslearning.RestApi.Entities.Personal.Course.CourseResource";
import { NavigateFunction, useNavigate } from "react-router-dom";
import type { ItslearningRestApiEntitiesElementLink } from "../utils/Itslearning.RestApi.Entities.ElementLink";

export enum LearningToolIdTypes {
  LINK = 50010,
  FILE = 5009,
  BOOK = 5,
}

// TODO: add mp4, mkv (maybe other video formats as well) + JPG, PNG, GIF, SVG, etc. (maybe other image formats as well)

export function isResourceFile(
  resource:
    | (
        | ItslearningRestApiEntitiesPersonalCourseCourseResource
        | ItslearningRestApiEntitiesElementLink
      )
    | number,
) {
  if (typeof resource === "number") {
    return resource === LearningToolIdTypes.FILE;
  } else {
    return resource.LearningToolId === LearningToolIdTypes.FILE;
  }
}

enum IconTypesForResources {
  DOCX = 1,
  XLSX = 2,
  PPTX = 3,
  PDF = 12,
  MP4 = 13,
  JPEG = 11,
}

type ResourceObject = {
  ElementId?: string | number;
  Url?: string;
  Title?: string;
  IconUrl?: string;
};

//https://platform.itslearning.com/Handlers/ExtensionIconHandler.ashx?ExtensionId=5009&IconFormat=Png&IconSize=2&IconsVersion=143&UseDoubleResolutionIconSizeIfAvailable=False&UseMonochromeIconAsDefault=False

export function useNavigateToResource(navigater?: NavigateFunction) {
  const navigate = navigater || useNavigate();

  const navigateToResource = (resource: ResourceObject | string | number) => {
    const elementId =
      typeof resource === "number" || typeof resource === "string"
        ? resource
        : resource.ElementId;
    if (isResourceMicrosoftOfficeDocument(resource)) {
      navigate(`/documents/office/${elementId}`);
    } else if (isResourcePDFFromUrlOrElementType(resource)) {
      navigate(`/documents/pdf/${elementId}`);
    } else if (isResourceWithFileExtension(resource)) {
      // check file extension
      const fileName =
        typeof resource === "number" || typeof resource === "string"
          ? resource
          : resource.Title;
      const fileExtension = getFileExtension(String(fileName));
      // switch statement for if the file extension is an image or a video
      switch (fileExtension) {
        case FileExtensionTypes.MP4:
          // (itslearning doesn't support previewing mkv files, so we can't get the resource url from the scraped DOM)
          // case FileExtensionTypes.MKV:
          navigate(`/documents/media/${elementId}`, {
            state: {
              type: "video",
            },
          });
          break;
        case FileExtensionTypes.JPG:
        case FileExtensionTypes.PNG:
        case FileExtensionTypes.GIF:
        case FileExtensionTypes.SVG:
        case FileExtensionTypes.JPEG:
          navigate(`/documents/media/${elementId}`, {
            state: {
              type: "image",
            },
          });
          break;
        default:
          navigate(`/documents/other/${elementId}`);
          break;
      }
    } else {
      if (typeof resource === "number") return;
      const url = typeof resource === "string" ? resource : resource.Url;
      if (url) window.app.openExternal(url, true);
    }
  };

  return navigateToResource;
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

export function isResourceWithFileExtension(resource: ResourceObject | string | number) {
  const fileExtensions = Object.values(FileExtensionTypes) as string[];
  if (typeof resource === "number" || typeof resource === "string") {
    const fileExtension = getFileExtension(String(resource));
    return fileExtensions.includes(fileExtension);
  } else {
    if (!resource.Title) return false;
    const fileExtension = getFileExtension(resource.Title);
    return fileExtensions.includes(fileExtension);
  }
}

function getFileExtension(fileName: string) {
  const lastDotIndex = fileName.lastIndexOf(".");
  return fileName.substring(lastDotIndex + 1).toLowerCase();
}

export function isSupportedResourceInApp(resource: ResourceObject | string | number) {
  return (
    isResourceMicrosoftOfficeDocument(resource) ||
    isResourcePDFFromUrlOrElementType(resource) ||
    isResourceWithFileExtension(resource)
  );
}

export function isResourceMicrosoftOfficeDocument(
  resource: ResourceObject | string | number,
) {
  // IconTypeId 1, 2 and 3 are DOCX, XLSX and PPTX respectively (this is the only way to find out whether or not a resource is a Microsoft Office Document)
  const OfficeDocumentIconTypeIds = [
    IconTypesForResources.DOCX,
    IconTypesForResources.XLSX,
    IconTypesForResources.PPTX,
  ];
  if (typeof resource === "number") {
    return OfficeDocumentIconTypeIds.includes(resource);
  } else if (typeof resource === "string") {
    return OfficeDocumentIconTypeIds.includes(getIconTypeIdFromUrl(resource));
  } else {
    if (!resource.IconUrl) return false;
    return OfficeDocumentIconTypeIds.includes(getIconTypeIdFromUrl(resource.IconUrl));
  }
}

export function isResourcePDFFromUrlOrElementType(
  resource: ResourceObject | string | number,
) {
  // IconTypeId 12 is PDF (this is the only way to find out whether or not a resource is a PDF)
  const IconTypeId = IconTypesForResources.PDF;
  if (typeof resource === "number") {
    return resource === IconTypeId;
  } else if (typeof resource === "string") {
    return getIconTypeIdFromUrl(resource) === IconTypeId;
  } else {
    if (!resource.IconUrl) return false;
    return getIconTypeIdFromUrl(resource.IconUrl) === IconTypeId;
  }
}

function getIconTypeIdFromUrl(url: string) {
  const urlParams = new URLSearchParams(url);
  return parseInt(urlParams.get("IconTypeId") ?? "");
}
