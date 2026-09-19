/**
 * cheerio's ESM entry imports undici only for cheerio.fromURL(), which ITSDU never calls (pages are fetched with axios).
 * Aliasing it to this stub keeps ~1.4 MB of HTTP client out of the main process bundle.
 */
const unsupported = () => {
	throw new Error(
		"cheerio.fromURL is not available in ITSDU; fetch the page with axios and use cheerio.load",
	);
};

export class Client {
	constructor() {
		unsupported();
	}
	compose() {
		return unsupported();
	}
}
export const interceptors = { redirect: unsupported };
export const errors = { ResponseError: class ResponseError extends Error {} };
