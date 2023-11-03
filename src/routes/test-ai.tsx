import renderLink from "@/components/custom-render-link-linkify"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Linkify from "linkify-react"
import { useState } from "react"

export default function TestAI() {
    const [message, setMessage] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [chatMessages, setChatMessages] = useState<string[]>([])

    async function chatCompletion() {
        setLoading(true)
        const currentIndex = chatMessages.length

        const res = await fetch('http://localhost:3000/api/message/1223435', {
            method: 'POST',
            body: JSON.stringify({
                message,
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
                <div className="overflow-y-auto flex flex-col space-y-4 whitespace-pre-line bg-accent p-4 rounded shadow h-full mb-4 min-w-96 max-w-[100vw] text-foreground">
                    {chatMessages.map((message) => (
                        <p><Linkify options={{
                            render: renderLink
                        }} key={Math.random() * 10}>{message}</Linkify>
                        </p>
                    ))}
                </div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
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