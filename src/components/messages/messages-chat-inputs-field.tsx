import MessagesChatInputFileDialog from "@/components/messages/messages-chat-input-file-dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";

export default function MessagesChatInputsField({
                                                    files,
                                                    setFiles,
                                                    isSendingFile,
                                                    uploadProgress,
                                                    textareaRef,
                                                    handleSubmit,
                                                    isSendingMessage,
                                                    message,
                                                    setMessage,
                                                }: {
    files: File[] | null,
    // eslint-disable-next-line no-unused-vars
    setFiles: (files: File[] | null) => void
    isSendingFile: boolean
    uploadProgress: number
    textareaRef: any
    // eslint-disable-next-line no-unused-vars
    handleSubmit: (e: any) => void
    isSendingMessage: boolean
    message: string
    // eslint-disable-next-line no-unused-vars
    setMessage: (value: string) => void
}) {

    return (
        <div className="p-4 border-t max-h-64 flex flex-col">
            <form className="flex items-center gap-2" onSubmit={handleSubmit}>
                <div className={"flex-1 relative"}>
                    <Textarea rows={1} className="w-full min-h-[2.5rem] max-h-48 overflow-hidden"
                              ref={textareaRef}
                              onInput={(e) => {
                                  // resize textarea
                                  e.currentTarget.style.height = "auto"
                                  e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`
                              }}
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              placeholder="Type your message..."/>
                    <MessagesChatInputFileDialog files={files} setFiles={setFiles} isSendingFile={isSendingFile}
                                                 uploadProgress={uploadProgress}/>
                </div>
                <Button variant={"outline"}
                        className="rounded-full" type="submit"
                        disabled={isSendingMessage || message === '' && !files || isSendingFile}
                >
                    {isSendingMessage || isSendingFile ? "Sending..." : "Send"}
                </Button>
            </form>
        </div>
    )
}