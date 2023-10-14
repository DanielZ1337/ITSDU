import {Link, NavLink} from "react-router-dom"
import {cn} from "@/lib/utils.ts";
import {Button} from "@/components/ui/button.tsx";
import useGETcurrentUser from "@/queries/person/useGETcurrentUser.ts";
import MessagesDropdown from "@/components/messages/messages-dropdown.tsx";
import {Suspense} from "react";
import {MessageCircle} from "lucide-react";
import {AiOutlineNotification} from "react-icons/ai";
import NotificationsDropdown from "./notifications/notifications-dropdown";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";

export default function Header() {

    const {data} = useGETcurrentUser({
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchInterval: false,
        refetchIntervalInBackground: false,
    })


    const links = [
        {
            name: "Home",
            href: "/"
        },
        {
            name: "Courses",
            href: "/course-cards"
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
                            <img src="itsl-itslearning-file://icon.ico" alt="Logo" className={"w-8 h-8 rounded-md"}/>
                        </Link>
                        {/* <Button onClick={() => {
                            window.localStorage.clear()
                            window.location.reload()
                        }} className="px-4 py-2 bg-black text-white line-clamp-1 truncate">
                            CLEAR LOCAL STORAGE
                        </Button>*/}
                    </div>
                    <div className={"flex flex-row items-center justify-center gap-4 px-4"}>
                        {links.map((link) => ((
                            <NavLink key={link.name} to={link.href} className={({isActive, isPending}) =>
                                cn("text-muted-foreground hover:font-bold transition-all duration-200 hover:drop-shadow-[0_0px_5px_rgba(100,100,100,0.5)] hover:text-foreground-700 ", isActive && "text-foreground underline underline-offset-2 font-bold drop-shadow-[0_0px_5px_rgba(100,100,100,0.2)]", isPending && " border-b-2 border-blue-500 border-opacity-50 animate-pulse text-opacity-50")
                            }>
                                {link.name}
                            </NavLink>
                        )))}
                    </div>
                </div>
                <div className={"flex flex-row items-center justify-center gap-4"}>
                    <Suspense fallback={<Button className={"shrink-0"} variant={"ghost"} size={"icon"}><MessageCircle
                        className={"animate-pulse"}/></Button>}>
                        <MessagesDropdown/>
                    </Suspense>
                    <Suspense
                        fallback={<Button variant={"ghost"} size={"icon"} className={"shrink-0"}><AiOutlineNotification
                            className={"w-6 h-6"}/></Button>}>
                        <NotificationsDropdown/>
                    </Suspense>

                    <div className={"flex flex-row items-center justify-center gap-2"}>
                        <Avatar className={"flex-shrink-0 w-8 h-8"}>
                            <AvatarImage src={data?.ProfileImageUrl}
                                         alt={data?.FullName}
                                         className={"object-cover"}
                            />
                            <AvatarFallback className={"bg-foreground/20 text-sm"}>
                                {data?.FullName.split(" ").map((name) => name[0]).join("")}
                            </AvatarFallback>
                        </Avatar>
                        <p className={"text-lg font-semibold line-clamp-1 break-all"}>{data?.FullName}</p>
                    </div>
                </div>
            </nav>
        </header>
    )
}
