export function fileExtension(name: string) {
	const match = name.match(/\.([a-z0-9]+)$/i);
	return match ? match[1].toLowerCase() : "";
}

export function formatSize(size: number) {
	if (!Number.isFinite(size) || size <= 0) return "0 B";
	if (size < 1024) return `${size} B`;
	if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
	return `${Math.round(size / 1024 / 1024)} MB`;
}

export function formatDateShort(date: Date | string | undefined) {
	if (!date) return "Never";
	const parsed = date instanceof Date ? date : new Date(date);
	if (Number.isNaN(parsed.getTime())) return "Unknown";
	return new Intl.DateTimeFormat(undefined, {
		month: "short",
		day: "numeric",
		year:
			parsed.getFullYear() === new Date().getFullYear() ? undefined : "numeric",
	}).format(parsed);
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

export function getResourceKind(name: string, mimeType?: string) {
	const extension = fileExtension(name);
	if (extension === "pdf" || mimeType === "application/pdf") return "PDF";
	if (officeExtensions.includes(extension)) return "Office";
	if (videoExtensions.includes(extension) || mimeType?.startsWith("video/"))
		return "Video";
	if (imageExtensions.includes(extension) || mimeType?.startsWith("image/"))
		return "Image";
	if (
		["txt", "csv", "json", "md", "xml", "html", "css", "js", "ts"].includes(
			extension,
		) ||
		mimeType?.startsWith("text/")
	)
		return "Text";
	return extension ? extension.toUpperCase() : "File";
}

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
		return { pathname: `/documents/other/${elementId}` };
	}
	if (
		videoExtensions.includes(extension) ||
		imageExtensions.includes(extension)
	) {
		return { pathname: `/documents/other/${elementId}` };
	}
	return { pathname: `/documents/other/${elementId}` };
}
