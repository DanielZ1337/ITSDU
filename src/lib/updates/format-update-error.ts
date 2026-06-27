export function getUpdateErrorMessage(error: unknown) {
	if (import.meta.env.DEV) {
		return "Updates are usually unavailable in development builds.";
	}
	if (error instanceof Error && error.message) {
		return error.message;
	}
	return "The update service could not be reached.";
}
