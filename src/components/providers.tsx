import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {useEffect, useState} from "react";
import {ThemeProvider} from "next-themes";
import {Helmet} from "react-helmet";

export default function Providers({children}: { children: React.ReactNode }) {
    const queryClient = new QueryClient()
    const [mounted, setMounted] = useState<boolean>(false)

    useEffect(() => {
        setMounted(true)
    }, []);

    return (
        <ThemeProvider attribute={"class"} enableSystem>
            <QueryClientProvider client={queryClient}>
                {/*<div className={"overflow-x-auto"}>*/}
                <Helmet>
                    <title>My Title</title>
                    <meta name="description" content="Helmet application" />
                </Helmet>
                {mounted && children}
                {/*</div>*/}
            </QueryClientProvider>
        </ThemeProvider>
    )
}