import {Link, NavLink} from "react-router-dom"
import {cn} from "@/lib/utils.ts";

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
            name: "Profile",
            href: "/profile"
        }
    ]

    /*useEffect(() => {
        axios.get(`${baseUrl}ContentArea/ContentArea.aspx?LocationType=1&LocationID=29222&ElementID=1242155&ElementType=131072&FromNotification=True`).then(res => {
            console.log(res)
        })
    }, []);*/


    return (
        <header>
            <nav className={"flex flex-row items-center justify-between px-4 py-2 border-b-1.5"}>
                <div className={"flex flex-row items-center justify-center gap-4"}>
                    <div className={"flex flex-row items-center justify-center gap-2"}>
                        <Link to={"/"}>
                            <img src="/icon.ico" alt="Logo" className={"w-8 h-8"}/>
                        </Link>
                        <button onClick={() => {
                            window.localStorage.clear()
                            window.location.reload()
                        }} className="px-4 py-2 bg-black text-white">
                            CLEAR LOCAL STORAGE
                        </button>
                    </div>
                    <div className={"flex flex-row items-center justify-center gap-4"}>
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
            </nav>
        </header>
    )
}
