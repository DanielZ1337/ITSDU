import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import React, {FormEvent, useCallback, useEffect} from "react";
import usePOSTlightbulletinAddComment from "@/queries/lightbulletin/usePOSTlightbulletinAddComment.ts";
import {Loader2} from "lucide-react";
import {useToast} from "@/components/ui/use-toast";

export default function LightbulletinCommentForm({lightbulletinId}: {
    lightbulletinId: number
}) {

    const [comment, setComment] = React.useState<string>("")
    const {toast} = useToast()

    const {mutate, isLoading} = usePOSTlightbulletinAddComment({
        lightBulletinId: lightbulletinId,
    }, {Comment: comment}, {
        onSuccess: () => {
            setComment("")
            toast({
                title: "Success",
                description: "Comment added successfully",
                variant: "success",
                duration: 3000,
            })
        },
        onError: (err) => {
            toast({
                title: "Error",
                description: err.message || "An error occurred while trying to add the comment",
                variant: "destructive",
                duration: 5000,
            })
        }
    })

    const handleSubmit = useCallback((e: FormEvent<HTMLFormElement> | KeyboardEvent) => {
        e.preventDefault()

        if (comment.length === 0) return

        mutate({
            Comment: comment,
        })
    }, [comment, mutate])

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Enter" && e.ctrlKey) {
                console.log("ctrl+enter")
                handleSubmit(e)
            }
        }

        window.addEventListener("keydown", handleKeyDown)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [handleSubmit]);

    return (
        <form className="my-4" onSubmit={handleSubmit}>
            {/*<label className="sr-only" htmlFor="comment">
                            Add a new comment
                        </label>*/}
            <Input
                className="mb-2"
                id="comment"
                name="comment"
                placeholder="Add a new comment..."
                type="text"
                onChange={(e) => setComment(e.target.value)}
                value={comment}
            />
            {comment.length > 0 && (
                <Button
                    disabled={isLoading}
                    variant={"outline"}
                    size={"lg"}
                    className="w-full"
                    type="submit">
                    {isLoading ? <span className={"inline-flex shrink-0 text-center justify-center items-center"}>
                        <Loader2 className="animate-spin inline-block mr-2" size={16}/>
                        Adding comment...
                    </span> : "Add comment"}
                </Button>
            )}
        </form>
    )
}