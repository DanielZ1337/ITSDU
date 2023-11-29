import {cn} from '@/lib/utils'
import {useTheme} from 'next-themes'
import {Loader} from './ui/loader'

export default function CodeBlockFallback() {
    const {resolvedTheme} = useTheme()
    return (
        <pre
            className={cn(
                "relative flex w-full h-full overflow-hidden rounded-lg border min-h-44",
                //hsl(230, 1%, 98%)
                resolvedTheme === "dark" ? "bg-black" : "bg-[#f6f8fa]",
            )}>
            <Loader className="m-auto"/>
        </pre>
    )
}
