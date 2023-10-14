import {ItslearningRestApiEntitiesComment} from "@/types/api-types/utils/Itslearning.RestApi.Entities.Comment.ts";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {ChevronDown, Loader2} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import usePUTlightbulletinUpdateComment from "@/queries/lightbulletin/usePUTlightbulletinUpdateComment.ts";
import {useEffect, useState} from "react";
import useDELETElightbulletinComment from "@/queries/lightbulletin/useDELETElightbulletinComment.ts";
import {Input} from "@/components/ui/input.tsx";
import {useToast} from "@/components/ui/use-toast";

export default function LightbulletinComment({comment}: {
    comment: ItslearningRestApiEntitiesComment
}) {
    const [commentText, setCommentText] = useState(comment.CommentText)
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [showUpdate, setShowUpdate] = useState<boolean>(false)
    const {toast} = useToast()
    const {mutate: updateComment, isLoading: isUpdating} = usePUTlightbulletinUpdateComment({
        commentId: comment.Id,
    }, {
        onSuccess: () => {
            setIsEditing(false)
            toast({
                title: "Success",
                description: "Comment updated successfully",
                variant: "success",
                duration: 5000,
            })
            comment.CommentText = commentText
        },
        onError: (err) => {
            toast({
                title: "Error",
                description: err.message || "An error occurred while trying to update the comment",
                variant: "destructive",
                duration: 5000,
            })
        }
    })

    const {mutate: deleteComment, isLoading: isDeleting} = useDELETElightbulletinComment({
        commentId: comment.Id,
    }, {
        onError: (err) => {
            toast({
                title: "Error",
                description: err.message || "An error occurred while trying to update the comment",
                variant: "destructive",
                duration: 5000,
            })
        }
    })

    useEffect(() => {
        setShowUpdate(isEditing && commentText.length > 0 && commentText !== comment.CommentText)
    }, [comment.CommentText, commentText, isEditing]);

    return (
        <div className="flex space-x-2">
            <Avatar className={"mt-1.5"}>
                <AvatarImage src={comment.Author.ProfileImageUrlSmall}
                             alt={comment.Author.FullName}/>
                <AvatarFallback>
                    {comment.Author.FullName.split(" ").map((name) => name[0]).join("")}
                </AvatarFallback>
            </Avatar>
            <div className={"w-full"}>
                <h2 className="font-semibold">{comment.Author.FullName}</h2>
                {isEditing ? (
                    <form onSubmit={(e) => {
                        e.preventDefault()

                        if (commentText.length === 0 || isDeleting || isUpdating) return

                        updateComment({
                            Comment: commentText,
                        })
                    }}
                    >
                        <Input type="text" className="mb-2 w-full" value={commentText} onChange={(e) => {
                            setCommentText(e.target.value)
                        }}/>
                        <div className="flex gap-2 mb-2">
                            <Button variant={"ghost"} size={"sm"} onClick={() => setIsEditing(false)}>Cancel</Button>
                            {showUpdate && (
                                <Button variant={"outline"} size={"sm"} type={"submit"}
                                        disabled={commentText.length === 0 || isDeleting || isUpdating || !showUpdate}
                                        className={"inline-flex justify-center items-center text-center space-x-2"}>
                                    {isUpdating ? (
                                        <span
                                            className={"inline-flex shrink-0 text-center justify-center items-center"}>
                                            <Loader2 className="animate-spin inline-block mr-2 h-4 w-4"/>
                                            Updating...
                                        </span>
                                    ) : (
                                        <span>Update</span>
                                    )}
                                </Button>
                            )}
                        </div>
                    </form>
                ) : (
                    <p className={"mt-0.5"}>{comment.CommentText}</p>
                )}
                <p className="text-gray-500 text-sm">Posted
                    on {new Date(comment.CreatedDateTime).toLocaleDateString()}</p>
            </div>
            {comment.Author.PersonId === 467633 && (
                <>
                    <div className={"flex-grow"}/>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={"ghost"} size={"icon"} className={"rounded-full hover:shadow"}>
                                <ChevronDown/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            {comment.AllowEditComment && (
                                <DropdownMenuItem onClick={() => setIsEditing(true)}>Edit</DropdownMenuItem>
                            )}
                            {comment.AllowDeleteComment && (
                                <DropdownMenuItem onClick={() => {
                                    deleteComment({
                                        commentId: comment.Id,
                                    }, {
                                        onSuccess: () => {
                                            toast({
                                                title: "Success",
                                                description: "Comment deleted successfully",
                                                variant: "success",
                                                duration: 5000,
                                            })
                                        },
                                        onError: (err) => {
                                            toast({
                                                title: "Error",
                                                description: err.message || "An error occurred while trying to delete the comment",
                                                variant: "destructive",
                                                duration: 5000,
                                            })
                                        }
                                    })
                                }}>Delete</DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            )}
        </div>
    )
}