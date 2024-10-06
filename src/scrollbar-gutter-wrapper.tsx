export default function ScrollbarGutterWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div
			style={{
				scrollbarGutter: "stable both-edges",
			}}
		>
			{children}
		</div>
	);
}
