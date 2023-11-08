import renderLink from "@/components/custom-render-link-linkify"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {useAIChatCompletion} from "@/hooks/useAIChatCompletion"
import Linkify from "linkify-react"
import {useState} from "react"

export default function TestAI() {
    const [message, setMessage] = useState<string>('')
    const [chatMessages, setChatMessages] = useState<string[]>([])

    // const [mutate, { data }] = useCompletionRQ(1223435)

    const {abort, errorMessage, loading} = useAIChatCompletion(message, 1285161, () => {
        console.log('done')
    })


    return (
        <div className="flex p-4 rounded-lg flex-1 max-h-[85vh]">
            <iframe src="https://itsdu.danielz.dev/s3/lec08-ajax-rest.pdf" className="rounded-lg w-full"/>
            <div className="flex flex-col space-y-4 p-4 rounded-lg w-full">
                <div
                    className="overflow-y-auto flex flex-col space-y-4 whitespace-pre-line bg-accent p-4 rounded shadow h-full mb-4 min-w-96 max-w-[100vw] text-foreground">
                    {/* <p><Linkify options={{
                        render: renderLink
                    }}>{data}</Linkify>
                    </p> */}
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
                        // mutate(message)
                        chatCompletion()
                    }}
                    className="flex justify-between gap-4"
                >
                    <Input disabled={loading} value={message} onChange={(e) => setMessage(e.target.value)}/>
                    <Button disabled={loading}>
                        Submit
                    </Button>
                </form>
            </div>
        </div>
    )
}
