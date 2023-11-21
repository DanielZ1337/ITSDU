import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {ItslearningRestApiEntitiesComment} from '@/types/api-types/utils/Itslearning.RestApi.Entities.Comment'
import {Button} from '@/components/ui/button'
import {ChevronDown} from 'lucide-react'
import {useToast} from '@/components/ui/use-toast'
import useDELETElightbulletinComment from '@/queries/lightbulletin/useDELETElightbulletinComment'

export default function LightbulletinCommentDropdown({comment, setIsEditing}: {
    comment: ItslearningRestApiEntitiesComment,
    setIsEditing: (isEditing: boolean) => void,
}) {
    const {toast} = useToast()

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

    return (
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
                    }}
                                      className="hover:!bg-destructive"
                    >Delete</DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
