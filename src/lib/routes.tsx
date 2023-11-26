import { BookCheck, ClipboardList, Users2 } from "lucide-react"
import {
    AiOutlineCalendar,
    AiOutlineFile,
    AiOutlineHome,
    AiOutlineInfoCircle,
    AiOutlineMessage,
    AiOutlineNotification
} from "react-icons/ai"

export const navlinks = [
    {
        name: 'Home',
        icon: <AiOutlineHome className="h-4 w-4" />,
        to: '/',
        end: true
    },
    {
        name: 'Courses',
        icon: <AiOutlineHome className="h-4 w-4" />,
        to: '/courses',
        end: true
    },
    {
        name: 'Updates',
        icon: <BookCheck className="h-4 w-4" />,
        to: '/updates',
        end: true
    },
    {
        name: 'Calendar',
        icon: <AiOutlineCalendar className="h-4 w-4" />,
        to: '/calendar',
        end: true
    },
    {
        name: 'Messages',
        icon: <AiOutlineMessage className="h-4 w-4" />,
        to: '/messages',
        end: true
    },
] as const

export const courseNavLinks = [
    {
        name: 'Overview',
        icon: <AiOutlineHome className="h-4 w-4" />,
        to: '.',
        end: true
    },
    {
        name: 'Schedule',
        icon: <AiOutlineCalendar className="h-4 w-4" />,
        to: 'schedule',
        end: false
    },
    {
        name: 'Announcements',
        icon: <AiOutlineNotification className="h-4 w-4" />,
        to: 'announcements',
        end: false
    },
    {
        name: 'Resources',
        icon: <AiOutlineFile className="h-4 w-4" />,
        to: 'resources',
        end: false
    },
    {
        name: 'Tasks',
        icon: <ClipboardList className="h-4 w-4" />,
        to: 'tasks',
        end: false
    },
    {
        name: 'Participants',
        icon: <Users2 className="h-4 w-4" />,
        to: 'participants',
        end: false
    },
    {
        name: 'Course Information',
        icon: <AiOutlineInfoCircle className="h-4 w-4" />,
        to: 'course-information',
        end: false
    }
] as const