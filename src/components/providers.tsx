import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {useEffect, useState} from "react";
import {ThemeProvider} from "next-themes";

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
                {mounted && children}
                {/*</div>*/}
            </QueryClientProvider>
        </ThemeProvider>
    )
}