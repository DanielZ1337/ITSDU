// Pure URL helpers shared by the renderer and the Electron main process. Keep this file free of React/app imports:
// the main process bundle imports it, and pulling renderer code in here would ship it in the main bundle too.

/** The itslearning (or mock) API origin the current process should talk to. */
const runtimeBase =
	typeof window !== "undefined"
		? window.runtime?.apiBaseUrl
		: typeof process !== "undefined" && process.env.ITSLEARNING_MOCK_URL
			? `${process.env.ITSLEARNING_MOCK_URL.replace(/\/+$/, "")}/`
			: undefined;

export const baseUrl =
	runtimeBase ??
	(import.meta.env.DEV
		? "http://localhost:8080/"
		: "https://sdu.itslearning.com/");

export const apiUrl = (
	route: string,
	options?: {
		[key: string]: string | number | Date | undefined | boolean | number[];
	},
) => {
	// replace all path parameters with the values from the options object
	route.match(/{(.*?)}/g)?.forEach((match) => {
		const key = match.replace("{", "").replace("}", "");
		if (options?.[key] !== undefined) {
			route = route.replace(match, options[key]!.toString());
			// delete options[key]
		}
	});

	// remove everything after the first ? in the route
	route = route.split("?")[0];

	const url = new URL(route, baseUrl);

	// add all remaining options as query parameters
	for (const [key, value] of Object.entries(options ?? {})) {
		if (value !== undefined) {
			if (value instanceof Date) {
				url.searchParams.append(key, value.toISOString());
			} else if (typeof value === "boolean") {
				url.searchParams.append(key, value ? "true" : "false");
			} else if (Array.isArray(value)) {
				url.searchParams.append(key, value.join(","));
			} else {
				url.searchParams.append(key, value.toString());
			}
		}
	}

	return url.toString();
};
