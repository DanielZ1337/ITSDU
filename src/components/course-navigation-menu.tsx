import * as React from "react"

import {cn, getRelativeTimeString} from "@/lib/utils"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {Link} from "react-router-dom";
import useGETstarredCourses from "@/queries/course-cards/useGETstarredCourses";

export function CourseNavigationMenu({title}: { title: string }) {
    const {data: starredCourses} = useGETstarredCourses({
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
                        {title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent
                        className="bg-foreground/10 z-[1000] rounded-md md:w-96"
                    >
                        <ul className="space-y-1">
                            {starredCourses?.EntityArray.map(course => (
                                <ListItem
                                    key={course.CourseId}
                                    title={course.Title}
                                    to={`/courses/${course.CourseId}`}
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

function ListItem({title, to, children, className, ...props}: {
    title: string,
    to: string,
    children: React.ReactNode,
    className?: string
}) {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    to={to}
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