import { atom, useAtom } from "jotai"
import { ChevronFirst, ChevronLast, MoreVertical } from "lucide-react"
import { createContext, useContext, useState } from "react"

const SidebarContext = createContext({ expanded: false })
const overlayAtom = atom(false)

const navlinks = [
    {
        icon: <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
        >
            <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v1h4a1 1 0 110 2h-1v6a1 1 0 11-2 0V7H8v6a1 1 0 11-2 0V7H5a1 1 0 110-2h4V4a1 1 0 011-1z"
                clipRule="evenodd"
            />
        </svg>,
        text: "Dashboard",
        active: true,
        alert: false,
    },
    {
        icon: <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5  shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
        >
            <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v1h4a1 1 0 110 2h-1v6a1 1 0 11-2 0V7H8v6a1 1 0 11-2 0V7H5a1 1 0 110-2h4V4a1 1 0 011-1z"
                clipRule="evenodd"
            />
        </svg>,
        text: "Dashboard",
        active: false,
        alert: false,
    },
    {
        icon: <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
        >
            <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v1h4a1 1 0 110 2h-1v6a1 1 0 11-2 0V7H8v6a1 1 0 11-2 0V7H5a1 1 0 110-2h4V4a1 1 0 011-1z"
                clipRule="evenodd"
            />
        </svg>,
        text: "Dashboard",
        active: false,
        alert: false,
    },
]

export default function SidebarComponent() {
    const [expanded, setExpanded] = useAtom(overlayAtom)
    return (
        <div className="bg-red-100 flex">
            <div className="relative w-16 h-screen bg-yellow-50">
                <Sidebar>
                    {navlinks.map((link) => (
                        <SidebarItem
                            key={link.text}
                            icon={link.icon}
                            text={link.text}
                            active={link.active}
                            alert={link.alert}
                        />
                    ))}
                </Sidebar>
            </div>
            <div>
                <h1 className="bg-black">test</h1>
            </div>
            <div
                className={`pointer-events-none absolute top-0 left-0 h-screen w-screen bg-black shadow-sm transition-all ${expanded ? "opacity-100" : "opacity-0"} z-10`} />
        </div>
    )
}

function Sidebar({ children }: { children?: React.ReactNode }) {
    const [expanded, setExpanded] = useState(false)
    const [expandedAtom, setExpandedAtom] = useAtom(overlayAtom)

    const toggleExpanded = () => {
        setExpanded((curr) => !curr)
        setExpandedAtom((curr) => !curr)
    }

    return (
        <aside className={`absolute h-screen overflow-hidden transition-all z-50 ${expanded ? "w-32" : "w-16"}`}
            onMouseEnter={toggleExpanded}
            onMouseLeave={toggleExpanded}
        >
            <nav className="h-full flex flex-col bg-white border-r shadow-sm">
                <div className="p-4 pb-2 flex justify-between items-center grow-0">
                    <button
                        onClick={() => setExpanded((curr) => !curr)}
                        className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
                    >
                        {expanded ? <ChevronFirst className="invert" /> : <ChevronLast className="invert" />}
                    </button>
                </div>

                <SidebarContext.Provider value={{ expanded }}>
                    <ul className="flex-1 px-3">{children}</ul>
                </SidebarContext.Provider>

                <div className="border-t flex p-3">
                    <img
                        src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
                        alt=""
                        className="w-10 h-10 rounded-md"
                    />
                    <div
                        className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "ml-3 w-0"}
          `}
                    >
                        <div className="leading-4">
                            <h4 className="font-semibold">John Doe</h4>
                            <span className="text-xs text-gray-600">johndoe@gmail.com</span>
                        </div>
                        <MoreVertical size={20} />
                    </div>
                </div>
            </nav>
        </aside>
    )
}

function SidebarItem({ icon, text, active, alert }: {
    icon: React.ReactNode,
    text: string,
    active: boolean,
    alert: boolean
}) {
    const { expanded } = useContext(SidebarContext)

    return (
        <li
            className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${active
                    ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
                    : "hover:bg-indigo-50 text-gray-600"
                }
    `}
        >
            {icon}
            <span
                className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "ml-3 w-0"
                    }`}
            >
                {text}
            </span>
            {alert && (
                <div
                    className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? "" : "top-2"
                        }`}
                />
            )}

            {!expanded && (
                <div
                    className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-indigo-100 text-indigo-800 text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
                >
                    {text}
                </div>
            )}
        </li>
    )
}