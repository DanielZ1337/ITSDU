import {Link} from "react-router-dom";
import {Input} from "@/components/ui/input.tsx";
import {Star} from "lucide-react";
import {AiOutlineSearch} from "react-icons/ai";
import SearchProductsDialog from "@/components/search-dialog.tsx";

export default function Sidebar() {
    const courseId = 29219

    return (
        <div className="grid flex-1 w-full overflow-hidden grid-cols-[200px_1fr] xl:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-zinc-100/40 lg:block dark:bg-zinc-800/40">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-[60px] items-center border-b px-6">
                        <Link className="flex items-center gap-6 font-semibold w-full" to="#">
                            <Star className="w-6 h-6 text-zinc-500 dark:text-zinc-400 shrink-0"/>
                            <span className="">Web Technologies</span>
                        </Link>
                    </div>
                    <div className="flex-1 overflow-auto py-2">
                        <nav className="grid items-start gap-6 px-4 text-sm font-medium">
                            <div>
                                <div className="px-3 py-2 text-zinc-500 dark:text-zinc-400">Overview</div>
                                <Link
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                                    to="#"
                                >
                                    <svg
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
                                        <rect height="18" rx="2" ry="2" width="18" x="3" y="4"/>
                                        <line x1="16" x2="16" y1="2" y2="6"/>
                                        <line x1="8" x2="8" y1="2" y2="6"/>
                                        <line x1="3" x2="21" y1="10" y2="10"/>
                                    </svg>
                                    Schedule
                                </Link>
                                <Link
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                                    to="#"
                                >
                                    <svg
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
                                        <path d="M17 6.1H3"/>
                                        <path d="M21 12.1H3"/>
                                        <path d="M15.1 18H3"/>
                                    </svg>
                                    Announcements (5)
                                </Link>
                                <Link
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                                    to="#"
                                >
                                    <svg
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
                                            d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                                        <polyline points="14 2 14 8 20 8"/>
                                    </svg>
                                    Resources (2)
                                </Link>
                                <Link
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                                    to="#"
                                >
                                    <svg
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
                                    </svg>
                                    Tasks (2)
                                </Link>
                                <Link
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                                    to="#"
                                >
                                    <svg
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
                                    </svg>
                                    Grades (2)
                                </Link>
                                <Link to={"#"}
                                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
                                    <svg
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
                                    </svg>
                                    People (2)
                                </Link>
                                <Link to={"#"}
                                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
                                    <svg
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
                                    </svg>
                                    Course Information
                                </Link>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="flex flex-col overflow-auto">
                <header
                    className="sticky top-0 flex h-[60px] items-center gap-4 border-b bg-zinc-100/40 px-6 dark:bg-zinc-800/40">
                    <div className="w-full flex-1">
                        {/*<form className="relative">
                            <Input
                                placeholder="Search resources..."
                                className="pl-10 w-full appearance-none md:w-2/3 lg:w-1/3"
                            />
                            <div className="absolute top-1/2 transform -translate-y-1/2 left-3">
                                <AiOutlineSearch className="w-5 h-5 text-gray-500"/>
                            </div>
                        </form>*/}
                        <SearchProductsDialog/>
                    </div>
                </header>
                <div className="flex-1 overflow-auto py-2">
                    <div className="grid items-start gap-6 px-4 text-sm font-medium">
                        <div>
                            <div className="px-3 py-2 text-zinc-500 dark:text-zinc-400">Resources</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}