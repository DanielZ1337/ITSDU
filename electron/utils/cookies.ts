import { Cookie } from "electron";

export function getFormattedCookies(cookies: Cookie[]) {
	return cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");
}
