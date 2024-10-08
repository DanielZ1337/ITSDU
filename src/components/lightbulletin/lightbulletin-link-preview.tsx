import useGETLinkOGPreview from "@/queries/extra/useGETLinkOGPreview";
import LightbulletinLink from "./lightbulletin-link";

export default function LightbulletinLinkPreview({
	href,
	title,
	type,
}: {
	href: string;
	title: string;
	type: "url" | "email";
}) {
	const { data } = useGETLinkOGPreview(href, {
		suspense: true,
		useErrorBoundary: false,
	});

	return (
		<LightbulletinLink
			onClick={() =>
				window.app.openShell(type === "url" ? href : `mailto:${href}`)
			}
		>
			<img
				loading="lazy"
				src={
					data?.links.icon[0].href ||
					"https://www.google.com/s2/favicons?sz=256&domain_url=" + href
				}
				alt={href}
				className={"w-6 h-6"}
			/>
			&nbsp;
			<span className="truncate">{data?.meta.title || title}</span>
		</LightbulletinLink>
	);
}
