import React from 'react'
import {ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger,} from "@/components/ui/context-menu"
import {useNavigate} from 'react-router-dom'
import {courseNavLinks} from '@/lib/routes'

const filteredCourseNavLinks = courseNavLinks.filter((route) => route.end === false)

export default function CourseCardContextMenu({courseId, children}: { courseId: number, children: React.ReactNode }) {

    const navigate = useNavigate()

    const handleItemClick = (route: string) => {
        navigate(`/courses/${courseId}/${route}`)
    }

    return (
        <ContextMenu>
            <ContextMenuTrigger>
                {children}
            </ContextMenuTrigger>
            <ContextMenuContent>
                {filteredCourseNavLinks.map((route) => (
                    <ContextMenuItem key={route.name}
                                     onClick={() => handleItemClick(route.to)}>{route.name}</ContextMenuItem>
                ))}
            </ContextMenuContent>
        </ContextMenu>
    )
}
