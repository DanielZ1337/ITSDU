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
        icon: <AiOutlineHome className="w-4 h-4" />,
        to: '/',
        end: true
    },
    {
        name: 'Courses',
        icon: <AiOutlineHome className="w-4 h-4" />,
        to: '/courses',
        end: true
    },
    {
        name: 'Updates',
        icon: <BookCheck className="w-4 h-4" />,
        to: '/updates',
        end: true
    },
    {
        name: 'Calendar',
        icon: <AiOutlineCalendar className="w-4 h-4" />,
        to: '/calendar',
        end: true
    },
    {
        name: 'Messages',
        icon: <AiOutlineMessage className="w-4 h-4" />,
        to: '/messages',
        end: true
    },
]

export const courseNavLinks = [
    {
        name: 'Overview',
        icon: <AiOutlineHome className="w-4 h-4" />,
        to: '.',
        end: true
    },
    {
        name: 'Schedule',
        icon: <AiOutlineCalendar className="w-4 h-4" />,
        to: 'schedule',
        end: false
    },
    {
        name: 'Announcements',
        icon: <AiOutlineNotification className="w-4 h-4" />,
        to: 'announcements',
        end: false
    },
    {
        name: 'Resources',
        icon: <AiOutlineFile className="w-4 h-4" />,
        to: 'resources',
        end: false
    },
    {
        name: 'Tasks',
        icon: <ClipboardList className="w-4 h-4" />,
        to: 'tasks',
        end: false
    },
    {
        name: 'Participants',
        icon: <Users2 className="w-4 h-4" />,
        to: 'participants',
        end: false
    },
    {
        name: 'Course Information',
        icon: <AiOutlineInfoCircle className="w-4 h-4" />,
        to: 'course-information',
        end: false
    }
]