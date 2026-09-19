import ReactDOM from "react-dom/client";
import "@/index.css";
import { lazy } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { TabsProvider } from "@/components/tabs/tab-manager";
import { setupAuthRefreshInterceptor } from "@/lib/auth/session-client";
import { GlobalShortcuts } from "./components/global-shortcuts";
import { GlobalErrorBoundaryProvider } from "./contexts/global-error-boundary-context";

const Providers = lazy(() => import("@/components/providers.tsx"));
const ReactQueryDevtools = lazy(() =>
	import("@tanstack/react-query-devtools").then((module) => ({
		default: module.ReactQueryDevtools,
	})),
);
const Layout = lazy(() => import("./components/layout"));
const SuspenseWrapper = lazy(() => import("@/components/suspense-wrapper.tsx"));

setupAuthRefreshInterceptor();

ReactDOM.createRoot(document.getElementById("root")!).render(
	<GlobalErrorBoundaryProvider>
		<ErrorBoundary fallback={<></>}>
			<SuspenseWrapper max>
				<Providers>
					{/* <React.StrictMode> */}
					<TabsProvider>
						<Layout />
						<GlobalShortcuts />
					</TabsProvider>
					{import.meta.env.DEV && (
						<ReactQueryDevtools position="top" buttonPosition="top-left" />
					)}
					{/* </React.StrictMode> */}
				</Providers>
			</SuspenseWrapper>
		</ErrorBoundary>
	</GlobalErrorBoundaryProvider>,
);

// Remove Preload scripts loading
postMessage({ payload: "removeLoading" }, "*");

// Use contextBridge
window.events.on("main-process-message", (message) => {
	console.log(message);
});
