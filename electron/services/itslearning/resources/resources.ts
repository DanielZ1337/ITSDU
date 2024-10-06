import axios from "axios";
import { BrowserWindow, Cookie } from "electron";
import { apiUrl } from "../../../../src/lib/utils.ts";
import { getFormattedCookies } from "../../../utils/cookies.ts";
import { createScrapeWindow } from "../../scrape/scraper.ts";
import { AuthService } from "../auth/auth-service.ts";
import { GET_ITSLEARNING_URL, ITSLEARNING_URL } from "../itslearning.ts";

const ITSLEARNING_RESOURCE_SUBDOMAIN = "resource";
export const ITSLEARNING_RESOURCE_URL = GET_ITSLEARNING_URL(
	ITSLEARNING_RESOURCE_SUBDOMAIN,
);
export const ITSLEARNING_RESOURCE_DOWNLOAD_URL = new URL(
	"/Proxy/DownloadRedirect.ashx",
	ITSLEARNING_RESOURCE_URL,
).toString();
export const GET_ITSLEARNING_ELEMENT_URL = (elementId: string) =>
	new URL(
		`/LearningToolElement/ViewLearningToolElement.aspx?LearningToolElementId=${elementId}`,
		ITSLEARNING_URL(),
	).toString();

export interface FileRepository {
	fileId: string;
	bucket: string;
	filePath: string;
	fileName: string;
	fileSize: number;
	mimeType: string;
	created: string;
	createdPersonId: number;
	createdCustomerId: number;
	modified: string;
	modifiedPersonId: number;
	modifiedCustomerId: number;
	anonymousRead: boolean;
	isTempFile: boolean;
	directUrl: string;
	status: string;
}

export async function getFileRepositoryBySSOLink(
	win: BrowserWindow,
): Promise<FileRepository> {
	const InitASPXsrc = await win.webContents.executeJavaScript(
		`document.querySelectorAll('iframe')[1].contentWindow.document.querySelectorAll('iframe')[0].contentWindow.document.querySelectorAll('iframe')[0].src`,
	);

	const fileInfoUrl = new URL(InitASPXsrc).searchParams.get("FileInfoUrl");

	if (!fileInfoUrl) throw new Error("Could not find file info url");

	return (await axios.get(fileInfoUrl)).data;
}

export async function getDirectUrlBySSOLink(win: BrowserWindow) {
	return await win.webContents.executeJavaScript(
		`document.querySelectorAll('iframe')[1].contentWindow.document.querySelectorAll('iframe')[0].contentWindow.document.querySelectorAll('form')[0].querySelector('[src]').src`,
	);
}

export async function getResourceIdsBySSOLink(win: BrowserWindow) {
	const downloadHref = await win.webContents.executeJavaScript(`
		(function() {
		  const iframe = document.querySelectorAll('iframe')[1];
		  if (iframe) {
			const iframeDoc = iframe.contentWindow.document;
			const form = iframeDoc.querySelector('form');
			if (form) {
			  return form.getAttribute('action');
			}
		  }
		  return null;
		})()
	  `);

	if (!downloadHref) throw new Error("Could not find download href");

	const downloadUrl = new URL(downloadHref, ITSLEARNING_RESOURCE_URL);

	const searchParams = Object.fromEntries(downloadUrl.searchParams.entries());

	const { LearningObjectId, LearningObjectInstanceId } = searchParams;

	if (!LearningObjectId || !LearningObjectInstanceId)
		throw new Error(
			"Could not find LearningObjectId and LearningObjectInstanceId",
		);

	return { LearningObjectId, LearningObjectInstanceId };
}

export function getResourceFileLinkByIds(
	LearningObjectId: string | number,
	LearningObjectInstanceId: string | number,
) {
	const url = new URL(ITSLEARNING_RESOURCE_DOWNLOAD_URL);

	url.searchParams.append("LearningObjectId", LearningObjectId.toString());
	url.searchParams.append(
		"LearningObjectInstanceId",
		LearningObjectInstanceId.toString(),
	);

	return url.toString();
}

export async function getResourceDownloadLink(
	url: string,
	customWin?: BrowserWindow,
) {
	const win =
		customWin ||
		createScrapeWindow({
			webPreferences: {
				webSecurity: false,
			},
		});
	await win.loadURL(url);
	const { LearningObjectId, LearningObjectInstanceId } =
		await getResourceIdsBySSOLink(win);
	return getResourceFileLinkByIds(LearningObjectId, LearningObjectInstanceId);
}

export async function getMicrosoftOfficeDocumentAccessTokenAndUrl(
	customWin?: BrowserWindow,
) {
	const win =
		customWin ||
		createScrapeWindow({
			webPreferences: {
				webSecurity: false,
			},
		});

	const result = await win.webContents.executeJavaScript(`
		(function() {
		let error = null;

		  try {
			const platformIframeDoc = document.querySelectorAll('iframe')[1].contentWindow.document;
			const viewFileIframe = platformIframeDoc.querySelectorAll('iframe')[0].contentWindow.document;
			const form = viewFileIframe.querySelectorAll('form')[1];
		  
			return {
				accessToken: form.querySelector('input[name="access_token"]').value,
				downloadUrl: form.action
			};
		  } catch (e) {
			error = e;
		  }
		  return error;
		})()
	  `);

	const { accessToken, downloadUrl } = result;

	if (!accessToken || !downloadUrl)
		throw new Error("Could not get microsoft office document");

	return { accessToken, downloadUrl };
}

export async function getResourceAsFile(url: string, cookies: Cookie[]) {
	// fetch url with cookies
	const cookiesFormatted = getFormattedCookies(cookies);
	const { data, headers } = await axios.get(url, {
		headers: {
			Cookie: cookiesFormatted,
		},
		responseType: "arraybuffer",
	});

	// get filename from headers
	const contentDisposition = headers["content-disposition"];
	const filenameMatch =
		contentDisposition && contentDisposition.match(/filename="([^"]+)"/);
	const filename = filenameMatch
		? decodeURIComponent(filenameMatch[1])
		: "unknown";
	const fileType = headers["content-type"] as string;

	// turn it into a file type
	const arrayBuffer = Buffer.from(data);
	const file = {
		arrayBuffer: arrayBuffer,
		size: arrayBuffer.length,
		name: filename,
		type: fileType,
	};

	return file;
}

export async function getResourceLinkByElementID(elementId: string | number) {
	const ssoLink = await getSSOLink(
		GET_ITSLEARNING_ELEMENT_URL(elementId.toString()),
	);

	if (!ssoLink) throw new Error("Could not get resource link");

	return ssoLink;
}

export async function getSSOLink(url: string) {
	const authService = AuthService.getInstance();
	const { data } = await axios.get(apiUrl(`restapi/personal/sso/url/v1`), {
		params: {
			access_token: authService.getToken("access_token"),
			url: url,
		},
	});

	if (!data.Url) throw new Error("Could not get resource link");

	return data.Url;
}

export async function getCourseByElementId(elementId: string | number) {
	const { data } = await axios.get(
		apiUrl(`restapi/personal/courses/resources/${elementId}/v1`),
		{
			params: {
				access_token: AuthService.getInstance().getToken("access_token"),
			},
		},
	);

	if (!data) throw new Error("Could not get course by element id");

	return data as {
		CourseCode: string;
		CourseTitle: string;
		ContextRole: number;
		Title: string;
		ElementId: number;
		ElementType: string;
		CourseId: number;
		Url: string;
		ContentUrl: string;
		IconUrl: string;
		Active: boolean;
		LearningToolId: number;
		AddElementUrl: string;
		Homework: boolean;
		Path: string;
		LearningObjectId: number;
		LearningObjectInstanceId: number;
	};
}
