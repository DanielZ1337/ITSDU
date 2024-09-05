/* eslint-disable no-unused-vars */

import { ItslearningRestApiEntitiesPersonalCourseCourseResource } from "@/types/api-types/utils/Itslearning.RestApi.Entities.Personal.Course.CourseResource";
import { NavigateFunction, useNavigate } from "react-router-dom";
import type { ItslearningRestApiEntitiesElementLink } from "../utils/Itslearning.RestApi.Entities.ElementLink";
import { ItsolutionsItslUtilsConstantsElementType } from "../utils/Itsolutions.ItslUtils.Constants.ElementType";
import { ItslearningRestApiEntitiesElementType } from "../utils/Itslearning.RestApi.Entities.ElementType";

export enum LearningToolIdTypes {
  LINK = 5010,
  FILE = 5009,
  BOOK = 5,
  REGISTRATION = 4,
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
  // ODP is basically powerpoint
  ODP = 34,
  // ODT is basically word
  ODT = 32,
  PDF = 12,
  MP4 = 13,
  JPEG = 11,
}

type ResourceObject = {
  ElementId?: string | number;
  Url?: string;
  Title?: string;
  IconUrl?: string;
  ContentUrl?: string;
  LearningToolId?: LearningToolIdTypes;
  ElementType?:
    | ItsolutionsItslUtilsConstantsElementType
    | ItslearningRestApiEntitiesElementType;
  CourseId?: number;
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
    } else if (isResourceFolder(resource) && typeof resource === "object") {
      navigate(`/courses/${resource.CourseId}/resources/${elementId}`);
    } else if (isResourceCustom(resource)) {
      if (typeof resource === "number") return;
      const url =
        typeof resource === "string"
          ? resource
          : resource.ContentUrl ?? resource.Url;

      navigate({
        pathname: `/sso`,
        search: `?url=${url}`,
      });
      // if (url) window.app.openExternal(url, true)
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

export function isResourceWithFileExtension(
  resource: ResourceObject | string | number,
) {
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

export function isResourceFromUrlOnItslearning(
  resource: ResourceObject | string,
) {
  // @ts-expect-error can't be bothered to fix the types. the resourceobject will not be undefined, but the contenturl or url might be
  const url = new URL(
    typeof resource === "string"
      ? resource
      : resource.ContentUrl ?? resource.Url,
  );

  return url.origin.includes("itslearning.com");
}

function getFileExtension(fileName: string) {
  const lastDotIndex = fileName.lastIndexOf(".");
  return fileName.substring(lastDotIndex + 1).toLowerCase();
}

export function isResourceItslearningResourceWithLink(
  resource: ResourceObject | string,
) {
  let urlToParse: string | undefined;

  if (typeof resource === "string") {
    urlToParse = resource;
  } else {
    urlToParse = resource.IconUrl;
  }

  if (!urlToParse) return false;

  return (
    Number(new URL(urlToParse).searchParams.get("ExtensionId")) ===
    LearningToolIdTypes.LINK
  );
}

export function isResourceFolder(resource: ResourceObject | string | number) {
  if (
    typeof resource === "number" ||
    typeof resource === "string" ||
    !resource.CourseId
  ) {
    return false;
  }

  if (
    isNaN(Number(resource.ElementType)) &&
    typeof resource.ElementType === "string"
  ) {
    return resource.ElementType === "Folder";
  }

  return (
    resource.ElementType === ItsolutionsItslUtilsConstantsElementType.Folder
  );
}

export function isSupportedResourceInApp(
  resource: ResourceObject | string | number,
) {
  return (
    isResourceMicrosoftOfficeDocument(resource) ||
    isResourcePDFFromUrlOrElementType(resource) ||
    isResourceWithFileExtension(resource) ||
    isResourceFolder(resource) ||
    isResourceCustom(resource)
    // (typeof resource !== 'number' && isResourceFromUrlOnItslearning(resource)) don't do this atm, because links are not gonna open if it has links inside, so just do this and maybe manually add things like quizzes and such
  );
}

export function isResourceCustom(resource: ResourceObject | string | number) {
  if (typeof resource === "number" || typeof resource === "string") {
    return false;
  }

  return (
    resource.LearningToolId === LearningToolIdTypes.REGISTRATION ||
    (resource.IconUrl &&
      Number(getExtensionIdFromUrl(resource.IconUrl)) ===
        LearningToolIdTypes.REGISTRATION)
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
    IconTypesForResources.ODP,
    IconTypesForResources.ODT,
  ];
  if (typeof resource === "number") {
    return OfficeDocumentIconTypeIds.includes(resource);
  } else if (typeof resource === "string") {
    return OfficeDocumentIconTypeIds.includes(getIconTypeIdFromUrl(resource));
  } else {
    if (!resource.IconUrl) return false;
    return OfficeDocumentIconTypeIds.includes(
      getIconTypeIdFromUrl(resource.IconUrl),
    );
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

function getExtensionIdFromUrl(url: string) {
  return Number(new URL(url).searchParams.get("ExtensionId"));
}
