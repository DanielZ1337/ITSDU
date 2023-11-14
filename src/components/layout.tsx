import React, { Suspense, useRef } from "react";
import { cn } from '../lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useUser } from "@/hooks/atoms/useUser.ts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SettingsDropdown from "@/components/settings/settings-dropdown";
import BrowserNav from "@/components/browse-nav";
import { ErrorBoundary } from "react-error-boundary";
import MessagesDropdown from "@/components/messages/dropdown/messages-dropdown";
import NotificationsDropdown from "@/components/notifications/notifications-dropdown";
import { Toaster } from "@/components/ui/toaster";
import ScrollToTopButton from "@/components/scroll-to-top-button";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Spinner } from "@nextui-org/spinner";
import Titlebar from "@/components/titlebar";
import SearchResourcesDialog from "@/components/resources/resources-search-dialog";
import TitlebarSearch from "@/components/titlebar-search";
import SettingsModal from "@/components/settings/settings-modal";
import MessagesDropDownSkeleton from "@/components/messages/dropdown/fallbacks/messages-dropdown-titlebar-fallback";
import NotificationsDropDownSkeleton from "@/components/notifications/fallback/notifications-dropdown-fallback";
import { courseNavLinks, navlinks } from "@/lib/routes";
import { useSidebar } from "@/hooks/atoms/useSidebar";
import AboutModal from "@/components/about-modal";
import IsOnlineIndicator from "@/components/is-online-indicator";
import { useCourse } from "@/hooks/atoms/useCourse";

export default function Layout() {
    const { sidebarActive } = useSidebar()
    const ref = useRef<HTMLDivElement>(null);

    return (
        <div className="flex flex-col h-screen max-h-screen min-h-screen overflow-hidden">
            <IsOnlineIndicator />
            <div className="drag flex items-center justify-between px-4 py-2 border-b border-background/40">
                <Link className="no-drag" to={'/'}>
                    <img src="itsl-itslearning-file://i_logo_colored.png" alt="itslearning"
                        className="ml-4 mt-2 w-8 h-8 my-auto" />
                </Link>
                <div className="px-4 w-full max-w-xl">
                    <TitlebarSearch />
                </div>
                <div className={"no-drag flex flex-row items-center justify-center gap-4"}>
                    <ErrorBoundary fallback={<MessagesDropDownSkeleton />}>
                        <Suspense fallback={<MessagesDropDownSkeleton />}>
                            <MessagesDropdown />
                        </Suspense>
                    </ErrorBoundary>
                    <ErrorBoundary fallback={<NotificationsDropDownSkeleton />}>
                        <Suspense
                            fallback={<NotificationsDropDownSkeleton />}>
                            <NotificationsDropdown />
                        </Suspense>
                    </ErrorBoundary>
                    <Titlebar />
                </div>
            </div>
            <BrowserNav />
            <div className="drag flex-col overflow-hidden flex flex-1 max-h-screen bg-background relative">
                <Sidebar />
                <div
                    className={"no-drag ml-24 h-full flex flex-1 overflow-hidden dark:bg-foreground/[2%] transition-all rounded-tl-md"}>
                    <ErrorBoundary fallback={<div>ERROR</div>}>
                        <Suspense
                            fallback={<Spinner size="lg" color="primary" label="Loading..." className={"m-auto"} />}>
                            <div className="flex flex-1 flex-col overflow-x-auto overflow-y-auto"
                                /*style={{
                                    scrollbarGutter: "stable both-edges"
                                }}*/
                                ref={ref}>
                                <Outlet />
                            </div>
                        </Suspense>
                    </ErrorBoundary>
                </div>
                <div
                    className={cn('pointer-events-none absolute top-0 left-0 h-full w-full bg-black/50 transition-all backdrop-blur-lg z-10 shadow-sm', sidebarActive ? 'opacity-100' : 'opacity-0')} />
                <ScrollToTopButton viewportRef={ref} />
                <Toaster />
                <SettingsModal />
                <AboutModal />
            </div>
        </div>
    )
}

function SidebarGroupTitle({ title }: { title: string }) {
    const { sidebarActive } = useSidebar()

    return (
        <h3 className={cn("text-xs font-semibold text-foreground/60 uppercase tracking-wider transition-all", sidebarActive ? 'opacity-100' : 'opacity-0')}>{title}</h3>
    )
}

function Sidebar() {
    const { sidebarActive, setSidebarActive } = useSidebar()
    const { courseId } = useCourse()
    const courseActive = courseId !== undefined
    const user = useUser()
    return (
        <div
            onMouseEnter={() => setSidebarActive(true)}
            onMouseLeave={() => setSidebarActive(false)}
            className={cn('overflow-hidden no-drag top-0 absolute transition-all h-full min-w-24 py-6 pb-4 px-4 z-20 bg-background flex flex-col justify-between', sidebarActive ? 'w-64' : 'w-24')}>
            <div className="overflow-x-hidden scrollbar-hide flex flex-col gap-1 h-full">
                <SidebarGroupTitle title="General" />
                {navlinks.map((link, i) => {
                    return <SidebarItem
                        key={link.name}
                        title={link.name}
                        icon={link.icon}
                        end={link.end}
                        href={link.to}
                    />
                })}
                <AnimatePresence>
                    {courseActive && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex flex-col gap-1 mb-3"
                        >
                            <hr className="my-3" />
                            <SidebarGroupTitle title="Course" />
                            <div className={"py-1"}>
                                <SearchResourcesDialog courseId={courseId} />
                            </div>
                            {courseNavLinks.map((link, i) => {
                                return <SidebarItem
                                    href={`/courses/${courseId}${link.end ? '' : '/' + link.to}`}
                                    key={link.name}
                                    title={link.name}
                                    icon={link.icon}
                                    end={link.end}
                                />
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <hr className="mb-3" />
            <NavLink to={'/profile'}
                className={({ isActive }) => cn("rounded-md flex py-2 px-3 text-left hover:bg-foreground/10", isActive && "bg-foreground/10")}>
                <Avatar className={"flex-shrink-0 w-10 h-10"}>
                    <AvatarImage src={user?.ProfileImageUrl}
                        alt={user?.FullName}
                        className={"object-cover"}
                    />
                    <AvatarFallback className={"bg-foreground/20 text-sm"}>
                        {user?.FullName.split(" ").map((name) => name[0]).join("").slice(0, 3)}
                    </AvatarFallback>
                </Avatar>
                <div
                    className={`pl-4 flex justify-between items-center overflow-hidden transition-all`}
                >
                    <div className="leading-4 pr-4">
                        <h4 className="font-semibold whitespace-pre-wrap break-all line-clamp-1">{user?.FullName}</h4>
                    </div>
                    <SettingsDropdown />
                </div>
            </NavLink>
        </div>
    )
}

function SidebarItem({ title, icon, href, end = true }: {
    title?: string,
    icon: React.ReactNode,
    href: string,
    end?: boolean
}) {
    const { sidebarActive } = useSidebar()

    return (
        <NavLink
            className={({ isActive }) => cn('animate-in slide-in-from-left-6 relative flex items-center p-2 rounded-md cursor-pointer', isActive ? 'text-foreground' : 'text-foreground/60', 'hover:text-foreground')}
            to={href}
            end={end}
        >
            {({ isActive }) => (
                <>
                    {isActive && (
                        <motion.div
                            layoutId="active-pill"
                            transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.8 }}
                            className={cn("inset-0 absolute bg-accent rounded-lg bg-gradient-to-tr from-accent to-background/60 transition-shadow", sidebarActive && 'shadow-md shadow-primary/5')}
                        />
                    )}
                    <span className="relative z-10 p-1 ml-2.5">{icon}</span>
                    <span
                        className={cn('whitespace-nowrap text-left font-semibold z-10 relative overflow-hidden transition-all pl-4', sidebarActive ? 'w-full' : 'w-0')}>
                        {title}
                    </span>
                </>
            )}
        </NavLink>
    );
}