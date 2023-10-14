import {Outlet} from "react-router-dom";
import BrowserNav from "./browse-nav";
import {Suspense, useRef} from "react";
import {Spinner} from "@nextui-org/spinner";
import Header from "@/components/header";
import {Toaster} from "@/components/ui/toaster.tsx";
import ScrollToTopButton from "@/components/scroll-to-top-button.tsx";

export default function Layout() {
    const ref = useRef<HTMLDivElement>(null);

    return (
        <div className="min-h-[100dvh] min-w-[100dvw] flex flex-1 flex-col w-full max-h-[100dvh] overflow-hidden">
            <div className={"flex flex-shrink-0 flex-grow-0 flex-col"}>
                <BrowserNav/>
                <Header/>
            </div>
            <Suspense
                fallback={<Spinner size="lg" color="primary" label="Loading..." className={"m-auto"}/>}>
                <div className="flex flex-1 flex-col overflow-x-auto overflow-y-auto"
                     /*style={{
                         scrollbarGutter: "stable both-edges"
                     }}*/
                     ref={ref}>
                    <Outlet/>
                </div>
            </Suspense>
            <ScrollToTopButton viewportRef={ref}/>
            <Toaster/>
        </div>
    )
}
