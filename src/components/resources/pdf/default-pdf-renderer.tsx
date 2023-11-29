import { Loader2 } from "lucide-react"
import AISidepanelButton from "../../ai-chat/ai-sidepanel-button"
import { Loader } from "@/components/ui/loader"

export default function DefaultPdfRenderer({ isLoading, data }: { isLoading: boolean, data: string }) {
    if (isLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <div className="h-10 w-10">
                    <Loader className={"m-auto"} />
                </div>
            </div>
        )
    }
    return (
        <div className="relative flex h-full w-full items-center justify-center">
            <iframe src={data} className="h-full w-full" />
            <AISidepanelButton className="absolute inset-y-0 right-4 my-auto mr-4" variant={"secondary"} />
        </div>
    )
}

