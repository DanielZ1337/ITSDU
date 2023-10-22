import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ThemeProvider} from "next-themes";
import {HelmetProvider} from "react-helmet-async";

export default function Providers({children}: {
    children: React.ReactNode
}) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                refetchOnMount: false,
                refetchOnReconnect: false,
                retry: false,
            }
        }
    })

    return (
        <HelmetProvider>
            <ThemeProvider attribute={"class"} enableSystem>
                <QueryClientProvider client={queryClient}>
                    {/*<div className={"overflow-x-auto"}>*/}
                    {children}
                    {/*</div>*/}
                </QueryClientProvider>
            </ThemeProvider>
        </HelmetProvider>
    )
}