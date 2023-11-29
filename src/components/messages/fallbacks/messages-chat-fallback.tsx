import { Loader } from '@/components/ui/loader'
import { Loader2 } from 'lucide-react'

export default function MessagesChatFallback() {
    return (
        <div className="m-auto flex h-full items-center justify-center">
            <Loader className={"m-auto"} />
        </div>
    )
}