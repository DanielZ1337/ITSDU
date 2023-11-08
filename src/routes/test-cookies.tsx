import {cn} from "@/lib/utils"
import {useEffect, useState} from "react"

export default function TestCookies() {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        const getPDFbyElementID = async () => {
            setIsLoading(true)
            const elementId = 1223435
            const arraybuffer = await window.blob.get(elementId)
            const blob = new Blob([arraybuffer], {type: 'application/pdf'})
            const url = URL.createObjectURL(blob)
            const iframe = document.getElementById('pdf') as HTMLIFrameElement
            iframe.src = url
            setIsLoading(false)
        }

        getPDFbyElementID()
    }, [])

    return (
        <div className={cn("w-screen h-screen", isLoading && 'opacity-50')}>
            {isLoading && <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"/>
                    <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"/>
                    <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"/>
                </div>
            </div>}
            <iframe id="pdf" className="w-full h-full"/>
        </div>
    )
}
