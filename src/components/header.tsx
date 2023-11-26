import {Link, NavLink} from "react-router-dom"
import {cn} from "@/lib/utils.ts";
import {Button} from "@/components/ui/button.tsx";
import MessagesDropdown from "@/components/messages/dropdown/messages-dropdown.tsx";
import {Suspense} from "react";
import {MessageCircle} from "lucide-react";
import {AiOutlineNotification} from "react-icons/ai";
import NotificationsDropdown from "./notifications/notifications-dropdown";
import HeaderUserFullnameAvatar from "@/header-user-avatar-fullname";
import {ErrorBoundary} from "react-error-boundary";

export default function Header() {


    const links = [
        {
            name: "Home",
            href: "/"
        },
        {
            name: "Courses",
            href: "/courses"
        },
        {
            name: "Messages",
            href: "/messages"
        },
        {
            name: "Calendar",
            href: "/calendar"
        },
        {
            name: "Profile",
            href: "/profile"
        }
    ]


    return (
        <header>
            <nav className={"flex flex-row items-center justify-between px-4 py-2 border-b-1.5"}>
                <div className={"flex flex-row items-center justify-center gap-4"}>
                    <div className={"flex flex-row items-center justify-center gap-2"}>
                        <Link to={"/"} className={"shrink-0"}>
                            <img src="https://cdn.itslearning.com/v3.142.3.446/images/logo-badge.svg" alt="Logo"
                                 className={"w-8 h-8"}/>
                        </Link>
                        {/* <Button onClick={() => {
                            window.localStorage.clear()
                            window.location.reload()
                        }} className="truncate bg-black px-4 py-2 text-white line-clamp-1">
                            CLEAR LOCAL STORAGE
                        </Button>*/}
                    </div>
                    <div className={"flex flex-row items-center justify-center gap-4 px-4"}>
                        {links.map((link) => ((
                            <NavLink key={link.name} to={link.href} className={({isActive, isPending}) =>
                                cn("relative text-muted-foreground hover:font-bold transition-all duration-200 hover:drop-shadow-[0_0px_5px_rgba(100,100,100,0.5)] hover:text-foreground-700 ", isActive && "text-foreground underline underline-offset-2 font-bold drop-shadow-[0_0px_5px_rgba(100,100,100,0.2)]", isPending && " border-b-2 border-blue-500 border-opacity-50 animate-pulse text-opacity-50")
                            }>
                                <span>{link.name}</span>
                            </NavLink>
                        )))}
                    </div>
                </div>
                <div className={"flex flex-row items-center justify-center gap-4"}>
                    <ErrorBoundary fallback={<MessagesDropDownSkeleton/>}>
                        <Suspense fallback={<MessagesDropDownSkeleton/>}>
                            <MessagesDropdown/>
                        </Suspense>
                    </ErrorBoundary>
                    <ErrorBoundary fallback={<NotificationsDropDownSkeleton/>}>
                        <Suspense
                            fallback={<NotificationsDropDownSkeleton/>}>
                            <NotificationsDropdown/>
                        </Suspense>
                    </ErrorBoundary>
                    <ErrorBoundary fallback={<div className={"animate-pulse"}>Loading...</div>}>
                        <Suspense fallback={<div className={"animate-pulse"}>Loading...</div>}>
                            <HeaderUserFullnameAvatar/>
                        </Suspense>
                    </ErrorBoundary>
                </div>
            </nav>
        </header>
    )
}

function MessagesDropDownSkeleton() {
    return (
        <div className={"animate-pulse"}>
            <Button className={"shrink-0"} variant={"ghost"} size={"icon"}><MessageCircle
                className={"animate-pulse"}/></Button>
        </div>
    )
}

function NotificationsDropDownSkeleton() {
    return (
        <div className={"animate-pulse"}>
            <Button variant={"ghost"} size={"icon"} className={"shrink-0"}><AiOutlineNotification
                className={"w-7 h-7 animate-pulse"}/></Button>
        </div>
    )
}
