import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import useGETpreviousChats from '@/queries/AI/useGETpreviousChats'
import { ArrowRightIcon, DownloadIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function AIChats() {
    const { data } = useGETpreviousChats({}, {
        suspense: true
    })

    return (
        <div className="container mx-auto p-4 md:p-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Previous AI Chats</h1>
            <div className="grid gap-6 grid-cols-2">
                {data?.pages.map((page) => {
                    return page.files.map((file) => {
                        return (
                            <AIChatCard
                                title={file.filename || "Untitled"}
                                date={new Date(file.timestamp)}
                                // description={file.description}
                                elementId={file.elementId}
                            />
                        )
                    })
                })}
            </div>
        </div>
    )
}

function AIChatCard({ title, date, description, elementId }: { title: string, date: Date, description?: string, elementId: number }) {

    const navigate = useNavigate()

    const handleDownload = async () => {
        await window.download.start(elementId, title)
    }

    const handleGoToChat = async () => {
        navigate(`/documents/pdf/${elementId}`)
    }

    return (
        <Card className="w-full max-w-md">
            <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="font-semibold text-lg">{title}</h2>
                    <Badge className="font-normal">{date.toLocaleDateString()}</Badge>
                </div>
                {description && <p className="text-gray-500">{description}</p>}
                <div className="mt-4">
                    <Button variant="outline"
                        onClick={handleDownload}
                    >
                        <DownloadIcon className="w-4 h-4 mr-2" />
                        Download as PDF
                    </Button>
                    <Button className="ml-4" variant="outline"
                        onClick={handleGoToChat}
                    >
                        <ArrowRightIcon className="w-4 h-4 mr-2" />
                        Go to AI Chat
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
