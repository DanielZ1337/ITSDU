import { BookCheck, BookCopy, ClipboardList, GanttChart, Users2 } from "lucide-react"
import {
    AiOutlineCalendar,
    AiOutlineFile,
    AiOutlineHome,
    AiOutlineInfoCircle,
    AiOutlineMessage,
    AiOutlineNotification
} from "react-icons/ai"
import { cn } from "./utils"
import { NavigationType } from "@/types/navigation-link"

const defaultNavLinkClassName = "h-4 w-4 3xl:w-5 3xl:h-5"

export const navlinks = [
    {
        title: 'Home',
        icon: <AiOutlineHome className={cn("", defaultNavLinkClassName)} />,
        href: '/',
        end: true,
        disabled: false
    },
    {
        title: 'Overview',
        icon: <GanttChart className={cn("", defaultNavLinkClassName)} />,
        href: '/overview',
        end: true,
        disabled: true
    },
    {
        title: 'Updates',
        icon: <BookCheck className={cn("", defaultNavLinkClassName)} />,
        href: '/updates',
        end: true,
        disabled: false
    },
    {
        title: 'Calendar',
        icon: <AiOutlineCalendar className={cn("", defaultNavLinkClassName)} />,
        href: '/calendar',
        end: true,
        disabled: false
    },
    {
        title: 'Messages',
        icon: <AiOutlineMessage className={cn("", defaultNavLinkClassName)} />,
        href: '/messages',
        end: true,
        disabled: false
    },
    {
        title: 'Courses',
        icon: <BookCopy className={cn("", defaultNavLinkClassName)} />,
        href: '/courses',
        end: true,
        disabled: false
    },
] as NavigationType[]

export const courseNavLinks = [
    {
        title: 'Overview',
        icon: <AiOutlineHome className={cn("", defaultNavLinkClassName)} />,
        href: '.',
        end: true,
        disabled: false
    },
    {
        title: 'Schedule',
        icon: <AiOutlineCalendar className={cn("", defaultNavLinkClassName)} />,
        href: 'schedule',
        end: false,
        disabled: false
    },
    {
        title: 'Announcements',
        icon: <AiOutlineNotification className={cn("", defaultNavLinkClassName)} />,
        href: 'announcements',
        end: false,
        disabled: false
    },
    {
        title: 'Resources',
        icon: <AiOutlineFile className={cn("", defaultNavLinkClassName)} />,
        href: 'resources',
        end: false,
        disabled: false
    },
    {
        title: 'Tasks',
        icon: <ClipboardList className={cn("", defaultNavLinkClassName)} />,
        href: 'tasks',
        end: false,
        disabled: false
    },
    {
        title: 'Participants',
        icon: <Users2 className={cn("", defaultNavLinkClassName)} />,
        href: 'participants',
        end: false,
        disabled: false
    },
    {
        title: 'Course Information',
        icon: <AiOutlineInfoCircle className={cn("", defaultNavLinkClassName)} />,
        href: 'course-information',
        end: false,
        disabled: false
    }
] as NavigationType[]

export const combinedNavLinks = [
    ...navlinks,
    ...courseNavLinks
] as NavigationType[]

