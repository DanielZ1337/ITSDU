import { Outlet } from "react-router-dom";
import BrowserNav from "./browse-nav";
import React from "react";
// import { Spinner } from "@nextui-org/spinner";

export default function Layout() {
    return (
        <div>
            <BrowserNav />
            <React.Suspense fallback={
                <div className="w-full h-full min-h-screen min-w-screen flex flex-1 justify-center items-center">
                    Loading...
                    {/* <Spinner size="lg" color="current" label="Loading..." /> */}
                </div>}>
                <Outlet />
            </React.Suspense>
        </div>
    )
}
