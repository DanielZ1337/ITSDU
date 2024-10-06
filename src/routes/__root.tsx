import Layout from "@/components/layout";
import Providers from "@/components/providers";
import SuspenseWrapper from "@/components/suspense-wrapper";
import { GlobalErrorBoundaryProvider } from "@/contexts/global-error-boundary-context";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ErrorBoundary } from "react-error-boundary";

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  return (
    <GlobalErrorBoundaryProvider>
      <ErrorBoundary fallback={<></>}>
        <SuspenseWrapper max>
          <Providers>
            <Layout>
              <Outlet />
            </Layout>
          </Providers>
        </SuspenseWrapper>
      </ErrorBoundary>
    </GlobalErrorBoundaryProvider>
  );
}
