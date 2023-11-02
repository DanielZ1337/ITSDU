import renderLink from "@/components/custom-render-link-linkify"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { openai } from "@/lib/openai"
import { pineconeClient } from "@/lib/pinecone"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { PineconeStore } from "langchain/vectorstores/pinecone"
import Linkify from "linkify-react"
import { useEffect, useState } from "react"

const mockedMessages = [
    `Based on the given context, it seems like the user is asking for a summary of the topics mentioned. Here is a summary of the topics mentioned:

    - Server-side: Refers to the backend of a web application, where the server processes requests and generates responses.
    - Laravel: A PHP framework used for web application development, providing a structured and efficient way to build web applications.
    - PHP: A server-side scripting language commonly used for web development.
    - JavaScript: A programming language primarily used for client-side scripting in web browsers.
    - JQuery: A JavaScript library that simplifies HTML document traversal, event handling, and animation.
    - JSON: Stands for JavaScript Object Notation, a lightweight data interchange format commonly used for transmitting data between a server and a web application.
    - DOM Manipulation: Refers to manipulating the Document Object Model (DOM) of a web page using JavaScript or other scripting languages.
    - DOM Navigation: The process of traversing and accessing different elements within the DOM tree structure.
    - DOM Events: Actions or occurrences that happen in the DOM, such as a user clicking a button or scrolling a page.
    - Web Rant: It is unclear what specifically the user is referring to with "Web Rant." It could be a general complaint or frustration related to web development.
    
    Please let me know if there is anything else I can assist you with.`,
    `fuck this shit im out`,
]

export default function TestAI() {
    const [message, setMessage] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [chatMessages, setChatMessages] = useState<string[]>([])

    useEffect(() => {
        console.log(chatMessages)
    }, [chatMessages])

    async function chatCompletion() {
        setLoading(true)
        const currentIndex = chatMessages.length
        const pineconeIndex = pineconeClient.Index('itsdu')

        const embeddings = new OpenAIEmbeddings({
            openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
        })
        const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
            pineconeIndex,
            // namespace: elementId,
        })

        const results = await vectorStore.similaritySearch(message)

        console.log("Results: ", results)

        const res = await openai.chat.completions.create({
            max_tokens: 500,
            model: 'gpt-3.5-turbo',
            temperature: 0,
            stream: true,
            messages: [
                {
                    role: 'system',
                    content:
                        'Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.',
                },
                {
                    role: 'user',
                    content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
        
        CONTEXT:
        ${results.map((r) => r.pageContent.replace(/\n/g, '\n\n')).join('\n\n')}
        
        USER INPUT: ${message}`,
                },
            ],
        })

        const reader = res.toReadableStream().getReader()

        const decoder = new TextDecoder("utf-8")

        while (true) {
            console.log("looping")
            const chunk = await reader.read()

            const { done, value } = chunk

            if (done) {
                break
            }

            const decodedChunk = decoder.decode(value)
            const lines = decodedChunk.split('\n')
            const parsedLines = lines
                .map((line) => line.replace(/^data: /, '').trim())
                .filter((line) => line !== '' && line !== '[DONE]')
                .map((line) => JSON.parse(line))

            for (const parsedLine of parsedLines) {
                const { choices } = parsedLine
                const { delta } = choices[0]
                const { content } = delta
                if (content) {
                    setChatMessages((prev) => {
                        let newMessages = [...prev]
                        if (newMessages.length === currentIndex) {
                            newMessages = [...newMessages, content]
                        } else {
                            newMessages[currentIndex] += content
                        }
                        return newMessages
                    })
                }
            }

        }
        setLoading(false)
        setMessage('')
    }

    return (
        <div className="flex p-4 rounded-lg flex-1">
            <iframe src="https://itsdu.danielz.dev/s3/lec08-ajax-rest.pdf" className="rounded-lg w-full" />
            <div className="flex flex-col space-y-4 p-4 rounded-lg w-full">
                <div className="flex flex-col space-y-4 whitespace-pre-wrap bg-accent p-4 rounded shadow h-full mb-4 min-w-96 max-w-[100vw] text-foreground break-all">
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
