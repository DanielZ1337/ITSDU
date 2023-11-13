import {cn} from '@/lib/utils.ts'
import {MdCalendarMonth, MdOutlineClass, MdOutlineMessage, MdPerson, MdSettings} from 'react-icons/md'
import React from 'react'
import {useUser} from '@/hooks/atoms/useUser.ts'
import {motion} from 'framer-motion';

const links = [
    {
        name: "Courses",
        href: "/courses",
        icon: <MdOutlineClass className={"w-6 h-6"}/>
    },
    {
        name: "Messages",
        href: "/messages",
        icon: <MdOutlineMessage className={"w-6 h-6"}/>
    },
    {
        name: "Calendar",
        href: "/calendar",
        icon: <MdCalendarMonth className={"w-6 h-6"}/>
    },
]

const links2 = [
    {
        name: "Profile",
        href: "/profile",
        icon: <MdPerson className={"w-6 h-6"}/>
    },
    {
        name: "Settings",
        href: "/settings",
        icon: <MdSettings className={"w-6 h-6"}/>
    },
]

export default function NewUITest() {
    const user = useUser()!

    return (
        <div className='w-screen h-screen flex'>
            <Sidebar/>
        </div>
    )
}

function SidebarNavLink({href, title, icon, className}: {
    href: string,
    title: string,
    icon: React.ReactNode,
    className?: string
}) {

    return (
        <a href={href}
           className={cn("tracking-normal flex flex-col items-center justify-center gap-2 p-4 rounded-lg hover:bg-accent hover:text-foreground transition-all duration-200", className)}>
            {icon}
            <p className={"text-sm line-clamp-1 break-all"}>{title}</p>
        </a>
    )
}

function Sidebar() {
    const [hover, setHover] = React.useState(false)

    const toggleHover = () => {
        setHover(!hover)
    }

    return (
        <>
            <motion.div className='h-full flex flex-col border overflow-hidden z-50'
                        initial={{width: 64}}
                        animate={{width: hover ? 300 : 64}}
                        transition={{duration: 0.2}}
                        onMouseEnter={toggleHover}
                        onMouseLeave={toggleHover}
            >
                <span className='flex flex-col items-center justify-center gap-4 p-4'>
                    <div className='flex'>
                        <span className='w-8'>
                            {links2[0].icon}
                        </span>
                        <p>
                            {links2[0].name}
                        </p>
                    </div>
                </span>
            </motion.div>
            <motion.div className='h-screen w-screen absolute left-0 top-0 bg-black z-40 backdrop-blur-lg'
                        initial={{opacity: 0}}
                        animate={{opacity: hover ? 0.5 : 0}}
            />
        </>
    )
}