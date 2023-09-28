import {Outlet} from "react-router-dom";
import BrowserNav from "./browse-nav";
import React from "react";
import {Spinner} from "@nextui-org/spinner";
import Header from "@/components/header";

export default function Layout() {

    return (
        <div className="min-h-[100dvh] min-w-[100dvw] flex flex-1 flex-col w-full max-h-[100dvh] overflow-hidden">
            <div className={"flex flex-shrink-0 flex-grow-0 flex-col"}>
                <BrowserNav/>
                <Header/>
            </div>
            <React.Suspense
                fallback={<Spinner size="lg" color="primary" label="Loading..." className={"m-auto"}/>}>
                <div className="flex flex-1 flex-col overflow-x-auto py-4">
                    <Outlet/>
                </div>
            </React.Suspense>
        </div>
    )
}
