import { BookCheck, BookCopy, ClipboardList, Users2 } from "lucide-react"
import {
    AiOutlineCalendar,
    AiOutlineFile,
    AiOutlineHome,
    AiOutlineInfoCircle,
    AiOutlineMessage,
    AiOutlineNotification
} from "react-icons/ai"
import { cn } from "./utils"

const defaultNavLinkClassName = "h-4 w-4 3xl:w-5 3xl:h-5"

export const navlinks = [
    {
        name: 'Home',
        icon: <AiOutlineHome className={cn("", defaultNavLinkClassName)} />,
        to: '/',
        end: true
    },
    {
        name: 'Updates',
        icon: <BookCheck className={cn("", defaultNavLinkClassName)} />,
        to: '/updates',
        end: true
    },
    {
        name: 'Calendar',
        icon: <AiOutlineCalendar className={cn("", defaultNavLinkClassName)} />,
        to: '/calendar',
        end: true
    },
    {
        name: 'Messages',
        icon: <AiOutlineMessage className={cn("", defaultNavLinkClassName)} />,
        to: '/messages',
        end: true
    },
    {
        name: 'Courses',
        icon: <BookCopy className={cn("", defaultNavLinkClassName)} />,
        to: '/courses',
        end: true
    },
] as const

export const courseNavLinks = [
    {
        name: 'Overview',
        icon: <AiOutlineHome className={cn("", defaultNavLinkClassName)} />,
        to: '.',
        end: true
    },
    {
        name: 'Schedule',
        icon: <AiOutlineCalendar className={cn("", defaultNavLinkClassName)} />,
        to: 'schedule',
        end: false
    },
    {
        name: 'Announcements',
        icon: <AiOutlineNotification className={cn("", defaultNavLinkClassName)} />,
        to: 'announcements',
        end: false
    },
    {
        name: 'Resources',
        icon: <AiOutlineFile className={cn("", defaultNavLinkClassName)} />,
        to: 'resources',
        end: false
    },
    {
        name: 'Tasks',
        icon: <ClipboardList className={cn("", defaultNavLinkClassName)} />,
        to: 'tasks',
        end: false
    },
    {
        name: 'Participants',
        icon: <Users2 className={cn("", defaultNavLinkClassName)} />,
        to: 'participants',
        end: false
    },
    {
        name: 'Course Information',
        icon: <AiOutlineInfoCircle className={cn("", defaultNavLinkClassName)} />,
        to: 'course-information',
        end: false
    }
] as const