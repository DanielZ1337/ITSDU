import { queryClient } from "@/lib/tanstack-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { LazyMotion, domAnimation } from "motion/react";
import { ThemeProvider } from "next-themes";
import SettingsEffects from "./settings/settings-effects";

export default function Providers({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
			<ThemeProvider attribute={"class"} enableSystem>
				<QueryClientProvider client={queryClient}>
					{/*<div className={"overflow-x-auto"}>*/}
					<SettingsEffects />
					<LazyMotion features={domAnimation}>{children}</LazyMotion>
					{/*</div>*/}
				</QueryClientProvider>
			</ThemeProvider>
	);
}
