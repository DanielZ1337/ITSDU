import usePDFbyElementID from "@/hooks/usePDFbyElementID"
import { cn } from "@/lib/utils"

export default function TestCookies() {
    const { isLoading, src } = usePDFbyElementID(1223435)
    return (
        <div className={cn("w-screen h-screen", isLoading && 'opacity-50')}>
            {isLoading && <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" />
                    <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" />
                    <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" />
                </div>
            </div>}
            <iframe src={src} className="w-full h-full" />
        </div>
    )
}
