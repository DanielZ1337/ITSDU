import renderLink from "@/components/custom-render-link-linkify"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUser } from "@/hooks/atoms/useUser"
import Linkify from "linkify-react"
import { useState } from "react"
import { useParams } from "react-router-dom"

export default function TestAI() {
    const { elementId } = useParams()
    const [message, setMessage] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [chatMessages, setChatMessages] = useState<string[]>([])
    const user = useUser()!

    async function chatCompletion() {
        setLoading(true)
        const currentIndex = chatMessages.length

        const res = await fetch(`https://itsdu.danielz.dev/api/message/${elementId}`, {
            method: 'POST',
            body: JSON.stringify({
                message,
                userId: user.PersonId
            }),
        })

        const reader = res.body?.getReader()

        if (!reader) {
            throw new Error('No reader')
        }

        const decoder = new TextDecoder("utf-8")

        let loop = true

        while (loop) {
            const chunk = await reader.read()

            const { done, value } = chunk

            if (done) {
                loop = false
                break
            }

            const decodedChunk = decoder.decode(value)
            setChatMessages(prevMessages => {
                const messages = [...prevMessages]
                if (messages[currentIndex]) {
                    messages[currentIndex] += decodedChunk
                } else {
                    messages[currentIndex] = decodedChunk
                }
                return messages
            })

        }
        setLoading(false)
        setMessage('')
    }


    return (
        <div className="flex p-4 rounded-lg flex-1 max-h-[85vh]">
            <iframe src="https://itsdu.danielz.dev/s3/lec08-ajax-rest.pdf" className="rounded-lg w-full" />
            <div className="flex flex-col space-y-4 p-4 rounded-lg w-full">
                <div
                    className="overflow-y-auto flex flex-col space-y-4 whitespace-pre-line bg-accent p-4 rounded shadow h-full mb-4 min-w-96 max-w-[100vw] text-foreground">
                    {chatMessages.map((message) => (
                        <p
                            key={Math.random() * 10}
                        ><Linkify options={{
                            render: renderLink
                        }}>{message}</Linkify>
                        </p>
                    ))}
                </div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        // mutate(message)
                        chatCompletion()
                    }}
                    className="flex justify-between gap-4"
                >
                    <Input disabled={loading} value={message} onChange={(e) => setMessage(e.target.value)} />
                    <Button disabled={loading}>
                        Submit
                    </Button>
                </form>
            </div>
        </div>
    )
}
