import {cn} from "@/lib/utils.ts"
import {useNavigate} from "react-router-dom"

export default function CourseCardInfo({icon, count, className, href}: {
    icon: React.ReactNode,
    count: number,
    className?: string,
    href?: string
}) {

    const navigate = useNavigate()

    return (
        <span
            onClick={(e) => {
                if (href) {
                    e.stopPropagation()
                    navigate(href)
                }
            }}
            className={cn("text-gray-500 text-sm flex gap-2 items-center justify-center hover:bg-gray-200 rounded-md p-2", className)}>
            {icon}{count}
        </span>
    )
}
