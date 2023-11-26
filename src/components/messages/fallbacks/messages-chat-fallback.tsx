import {Loader2} from 'lucide-react'

export default function MessagesChatFallback() {
    return (
        <div className="m-auto flex h-full items-center justify-center">
            <Loader2 className={"stroke-foreground shrink-0 h-6 w-6 animate-spin m-auto"}/>
        </div>
    )
}