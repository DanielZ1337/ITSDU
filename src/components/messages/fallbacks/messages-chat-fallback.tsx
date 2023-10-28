import {Loader2} from 'lucide-react'

export default function MessagesChatFallback() {
    return (
        <div className="flex justify-center items-center h-full m-auto">
            <Loader2 className={"stroke-foreground shrink-0 h-6 w-6 animate-spin m-auto"}/>
        </div>
    )
}