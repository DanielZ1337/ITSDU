import { Suspense } from "react";
import { Spinner } from "@nextui-org/spinner";

export default function SuspenseWrapper({
	children,
	max = false,
}: {
	children: React.ReactNode;
	max?: boolean;
}) {
	return (
		<Suspense
			fallback={
				<Spinner
					size="lg"
					color="primary"
					label="Loading..."
					className={"pointer-events-none select-none m-auto"}
					style={{
						width: max ? "100vw" : "100%",
						height: max ? "100vh" : "100%",
					}}
				/>
			}
		>
			{children}
		</Suspense>
	);
}
