export function fileExtension(name: string) {
	const match = name.match(/\.([a-z0-9]+)$/i);
	return match ? match[1].toLowerCase() : "";
}

export function formatSize(size: number) {
	if (size < 1024) return `${size} B`;
	if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
	return `${Math.round(size / 1024 / 1024)} MB`;
}

const officeExtensions = [
	"doc",
	"docx",
	"ppt",
	"pptx",
	"xls",
	"xlsx",
	"odt",
	"odp",
];
const videoExtensions = ["mp4", "mkv"];
const imageExtensions = ["jpg", "jpeg", "png", "gif", "svg"];

// Cached resources only carry a filename - route by extension instead of assuming every cached file is a PDF.
export function getResourceOpenRoute(
	name: string,
	elementId: string,
): { pathname: string; state?: { type: "video" | "image" } } {
	const extension = fileExtension(name);

	if (extension === "pdf") {
		return { pathname: `/documents/pdf/${elementId}` };
	}
	if (officeExtensions.includes(extension)) {
		return { pathname: `/documents/office/${elementId}` };
	}
	if (videoExtensions.includes(extension)) {
		return {
			pathname: `/documents/media/${elementId}`,
			state: { type: "video" },
		};
	}
	if (imageExtensions.includes(extension)) {
		return {
			pathname: `/documents/media/${elementId}`,
			state: { type: "image" },
		};
	}
	return { pathname: `/documents/other/${elementId}` };
}
