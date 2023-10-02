import {Link, NavLink} from "react-router-dom"
import {cn} from "@/lib/utils.ts";
import {Button} from "@/components/ui/button.tsx";
import useGETcurrentUser from "@/queries/person/useGETcurrentUser.ts";

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
            name: "Profile",
            href: "/profile"
        }
    ]


    return (
        <header>
            <nav className={"flex flex-row items-center justify-between px-4 py-2 border-b-1.5"}>
                <div className={"flex flex-row items-center justify-center gap-4"}>
                    <div className={"flex flex-row items-center justify-center gap-2"}>
                        <Link to={"/"}>
                            <img src="itsl-itslearning-file://icon.ico" alt="Logo" className={"w-8 h-8 rounded-md"}/>
                        </Link>
                        <Button onClick={() => {
                            window.localStorage.clear()
                            window.location.reload()
                        }} className="px-4 py-2 bg-black text-white line-clamp-1 truncate">
                            CLEAR LOCAL STORAGE
                        </Button>
                    </div>
                    <div className={"flex flex-row items-center justify-center gap-4 px-4"}>
                        {links.map((link) => {
                                return (
                                    <NavLink key={link.name} to={link.href} className={({isActive, isPending}) =>
                                        cn("", isActive && "text-blue-500", isPending && "text-blue-500 border-b-2 border-blue-500 border-opacity-50 animate-pulse text-opacity-50")
                                    }>
                                        {link.name}
                                    </NavLink>
                                )
                            }
                        )}
                    </div>
                </div>
                <p className={"text-lg font-semibold line-clamp-1"}>{data?.FullName}</p>
            </nav>
        </header>
    )
}
