import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ThemeProvider} from "next-themes";

export default function Providers({children}: {
    children: React.ReactNode
}) {
    const queryClient = new QueryClient()

    return (
        <ThemeProvider attribute={"class"} enableSystem>
            <QueryClientProvider client={queryClient}>
                {/*<div className={"overflow-x-auto"}>*/}
                {children}
                {/*</div>*/}
            </QueryClientProvider>
        </ThemeProvider>
    )
}