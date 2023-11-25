import * as React from "react"

import { cn, getRelativeTimeString } from "@/lib/utils"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Link, useLocation } from "react-router-dom";
import useGETstarredCourses from "@/queries/course-cards/useGETstarredCourses";

export function CourseNavigationMenu({ title }: { title: string }) {
    const { data: starredCourses } = useGETstarredCourses({
        isShowMore: true,
        PageSize: 9999,
    })

    return (
        <NavigationMenu
            className="no-drag z-30"
        >
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger
                        className="bg-transparent font-semibold text-balance text-lg px-4"
                    >
                        <span className="max-w-sm truncate lg:max-w-[40rem] xl:max-w-full">{title}</span>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent
                        className="bg-foreground/10 z-[1000] rounded-md md:w-96"
                    >
                        <ul className="space-y-1">
                            {starredCourses?.EntityArray.map(course => (
                                <ListItem
                                    key={course.CourseId}
                                    title={course.Title}
                                    courseId={course.CourseId}
                                >
                                    {getRelativeTimeString(new Date(course.LastOnline))}
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

function ListItem({ title, courseId, children, className, ...props }: {
    title: string,
    courseId: string | number,
    children: React.ReactNode,
    className?: string
}) {
    const { pathname } = useLocation()

    const updatedTo = `${pathname.replace(/\/courses\/\d+/, `/courses/${courseId}`)}`

    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    to={updatedTo}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    )
}