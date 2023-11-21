import {Suspense, useRef} from "react";
import {cn} from '../lib/utils';
import BrowserNav from "@/components/browse-nav";
import {ErrorBoundary} from "react-error-boundary";
import MessagesDropdown from "@/components/messages/dropdown/messages-dropdown";
import NotificationsDropdown from "@/components/notifications/notifications-dropdown";
import {Toaster} from "@/components/ui/toaster";
import ScrollToTopButton from "@/components/scroll-to-top-button";
import {Link, Outlet, useLocation} from "react-router-dom";
import {Spinner} from "@nextui-org/spinner";
import Titlebar from "@/components/titlebar";
import TitlebarSearch from "@/components/titlebar-search";
import SettingsModal from "@/components/settings/settings-modal";
import MessagesDropDownSkeleton from "@/components/messages/dropdown/fallbacks/messages-dropdown-titlebar-fallback";
import NotificationsDropDownSkeleton from "@/components/notifications/fallback/notifications-dropdown-fallback";
import {useSidebar} from "@/hooks/atoms/useSidebar";
import AboutModal from "@/components/about-modal";
import IsOnlineIndicator from "@/components/is-online-indicator";
import Sidebar from "./layout/sidebar";

export default function Layout() {
    const {sidebarActive} = useSidebar()
    const ref = useRef<HTMLDivElement>(null);

    const {pathname} = useLocation()

    return (
        <div className="flex flex-col h-screen max-h-screen min-h-screen overflow-hidden">
            <IsOnlineIndicator/>
            <div className="drag flex items-center justify-between px-4 py-2 border-b border-background/40">
                <Link className="no-drag shrink-0" to={'/'}>
                    <img src="itsl-itslearning-file://i_logo_colored.png" alt="itslearning"
                         className="ml-4 mt-2 w-8 h-8 my-auto"/>
                </Link>
                <div className="px-4 w-full max-w-xl">
                    <ErrorBoundary fallback={<div>ERROR</div>}>
                        <TitlebarSearch/>
                    </ErrorBoundary>
                </div>
                <div className={"no-drag flex flex-row items-center justify-center gap-4"}>
                    <ErrorBoundary fallback={<MessagesDropDownSkeleton/>}>
                        <Suspense fallback={<MessagesDropDownSkeleton/>}>
                            <MessagesDropdown/>
                        </Suspense>
                    </ErrorBoundary>
                    <ErrorBoundary fallback={<NotificationsDropDownSkeleton/>}>
                        <Suspense fallback={<NotificationsDropDownSkeleton/>}>
                            <NotificationsDropdown/>
                        </Suspense>
                    </ErrorBoundary>
                    <Titlebar/>
                </div>
            </div>
            <BrowserNav/>
            <div className="drag flex-col overflow-hidden flex flex-1 max-h-screen bg-background relative">
                <Sidebar/>
                <div
                    className={"no-drag ml-24 h-full flex flex-1 overflow-hidden dark:bg-foreground/[2%] transition-all rounded-tl-md"}>
                    <ErrorBoundary fallback={<div>ERROR</div>}>
                        <Suspense
                            fallback={<Spinner size="lg" color="primary" label="Loading..." className={"m-auto"}/>}>
                            <div className="flex flex-1 flex-col overflow-x-auto overflow-y-auto"
                                /*style={{
                                    scrollbarGutter: "stable both-edges"
                                }}*/
                                 ref={ref}
                                 key={pathname}
                            >
                                <Outlet/>
                            </div>
                        </Suspense>
                    </ErrorBoundary>
                </div>
                <div
                    className={cn('pointer-events-none absolute top-0 left-0 h-full w-full bg-black/50 transition-all backdrop-blur-lg z-10 shadow-sm', sidebarActive ? 'opacity-100' : 'opacity-0')}/>
                <ScrollToTopButton viewportRef={ref}/>
                <Toaster/>
                <SettingsModal/>
                <AboutModal/>
            </div>
        </div>
    )
}









