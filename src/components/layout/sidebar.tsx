import { cn } from "@/lib/utils"
import SidebarGroupTitle from "./sidebar-group-title"
import { useCourse } from "@/hooks/atoms/useCourse"
import { useSidebar } from "@/hooks/atoms/useSidebar"
import SidebarItem from "./sidebar-item"
import { courseNavLinks, navlinks } from "@/lib/routes"
import { AnimatePresence, motion } from 'framer-motion';
import { NavLink } from "react-router-dom"
import { ErrorBoundary } from "react-error-boundary"
import SidebarUser from "./sidebar-user"
import SidebarUserFallback from "./sidebar-user-fallback"

export default function Sidebar() {
    const { sidebarActive, setSidebarActive } = useSidebar()
    const { courseId } = useCourse()
    const courseActive = courseId !== undefined
    return (
        <div
            onMouseEnter={() => setSidebarActive(true)}
            onMouseLeave={() => setSidebarActive(false)}
            className={cn('overflow-hidden no-drag top-0 absolute transition-all h-full min-w-24 py-6 pb-4 px-4 z-20 bg-background flex flex-col justify-between', sidebarActive ? 'w-64' : 'w-24')}>
            <div className="overflow-x-hidden scrollbar-hide flex flex-col gap-1 h-full">
                <SidebarGroupTitle title="General" />
                {navlinks.map((link) => (
                    <SidebarItem
                        key={link.name}
                        title={link.name}
                        icon={link.icon}
                        end={link.end}
                        href={link.to}
                    />
                ))}
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
                            {courseNavLinks.map((link) => (
                                <SidebarItem
                                    href={`/courses/${courseId}${link.end ? '' : '/' + link.to}`}
                                    key={link.name}
                                    title={link.name}
                                    icon={link.icon}
                                    end={link.end}
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <hr className="mb-3" />
            <NavLink to={'/profile'}
                className={({ isActive }) => cn("rounded-md flex py-2 px-3 text-left hover:bg-foreground/10 transition-all", isActive && "bg-foreground/10")}>
                <ErrorBoundary fallback={<SidebarUserFallback />}>
                    <SidebarUser />
                </ErrorBoundary>
            </NavLink>
        </div>
    )
}