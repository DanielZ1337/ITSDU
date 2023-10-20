import {NavLink, useParams} from "react-router-dom";
import {cn} from "@/lib/utils.ts";
import SearchResourcesDialog from "@/components/resources/resources-search-dialog.tsx";
// eslint-disable-next-line no-redeclare
import {CalendarIcon, ClipboardList, File, HomeIcon, Info, Megaphone, Users2} from "lucide-react";
import React from "react";

const SideBarNavLinks = [
    {
        name: "Overview",
        icon: <HomeIcon className={"h-4 w-4"}/>,
        to: ".",
        end: true
    },
    {
        name: "Schedule",
        icon: <CalendarIcon className={"h-4 w-4"}/>,
        to: "schedule",
        end: false
    },
    {
        name: "Announcements (5)",
        icon: <Megaphone className={"h-4 w-4"}/>,
        to: "announcements",
        end: false
    },
    {
        name: "Resources (2)",
        icon: <File className={"h-4 w-4"}/>,
        to: "resources",
        end: false
    },
    {
        name: "Tasks (2)",
        icon: <ClipboardList className={"h-4 w-4"}/>,
        to: "tasks",
        end: false
    },
    {
        name: "Grades (2)",
        icon: <svg
            className=" h-4 w-4"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M21 12.79V21H3v-8.21M21 12.79l-9-7-9 7M21 12.79l-9-7-9 7"/>
            <path d="M3 21h18"/>
            <path d="M6 12h12"/>
            <path d="M9 9l3 3 3-3"/>
        </svg>,
        to: "grades",
        end: false
    },
    {
        name: "Participants",
        icon: <Users2 className={"h-4 w-4"}/>,
        to: "participants",
        end: false
    },
    {
        name: "Course Information",
        icon: <Info className={"h-4 w-4"}/>,
        to: "course-information",
        end: false
    },
]


export default function CourseLayoutSidebar() {
    const params = useParams();
    const courseId = Number(params.id)

    return (
        <nav className="grid items-start gap-6 px-4 text-sm font-medium">
            <div>
                <div className={"py-1"}>
                    <SearchResourcesDialog courseId={courseId}/>
                </div>
                <h1 className="hidden lg:block px-3 py-2 text-zinc-500 dark:text-zinc-400">
                    Overview
                </h1>
                <div className="flex flex-col gap-2">
                    {SideBarNavLinks.map((link, i) => (
                        <SideBarNavLink key={i} to={link.to} end={link.end}>
                            {link.icon}
                            <p className={"hidden lg:block"}>{link.name}</p>
                        </SideBarNavLink>
                    ))}
                </div>
            </div>
        </nav>
    )
}

function SideBarNavLink({children, to, end = false, ...props}: {
    children: React.ReactNode,
    to: string,
    end?: boolean
}) {
    return (
        <NavLink
            to={to}
            {...props}
            end={end}
            className={({
                            isActive,
                            isPending,
                        }) => cn("flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50", isActive && "lg:translate-x-1.5 text-zinc-900 dark:text-zinc-50 bg-foreground/10 shadow", isPending && "text-opacity-50")}
        >
            {children}
        </NavLink>
    )
}