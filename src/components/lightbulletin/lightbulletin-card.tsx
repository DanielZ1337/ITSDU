import {GETlightbulletinsForCourse} from "@/types/api-types/lightbulletin-course/GETlightbulletinsForCourse.ts";
import React, {Suspense, useEffect, useState} from "react";
import {BsChatSquareTextFill, BsFileEarmarkFill} from "react-icons/bs";
import {Badge} from "@/components/ui/badge.tsx";
import {BellOff, BellRing, Loader2} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import usePUTlightbulletinNotifications from "@/queries/lightbulletin/usePUTlightbulletinNotifications.ts";
import {useToast} from "@/components/ui/use-toast.ts";
import LightbulletinComments from "@/components/lightbulletin/lightbulletin-comments.tsx";
import LightbulletinCommentForm from "@/components/lightbulletin/lightbulletin-comment-form.tsx";
import useGETlightbulletinResources from "@/queries/lightbulletin/useGETlightbulletinResources.ts";

export default function LightbulletinCard({bulletin}: {
    bulletin: GETlightbulletinsForCourse['EntityArray'][0]
}) {
    const [readMore, setReadMore] = useState(false);
    const [hasReadMore, setHasReadMore] = useState<boolean>(false)
    const textRef = React.useRef<HTMLPreElement>(null);
    const [showComments, setShowComments] = useState<boolean>(false)
    const [showResources, setShowResources] = useState<boolean>(false)

    const {mutate, isLoading} = usePUTlightbulletinNotifications({
        lightbulletinId: bulletin.LightBulletinId,
    })

    const {data: Resources} = useGETlightbulletinResources({
        bulletinId: bulletin.LightBulletinId,
    }, {
        enabled: bulletin.ResourcesCount > 0,
    })

    const {toast} = useToast()

    useEffect(() => {
        setInterval(() => {
            if (textRef.current) {
                setHasReadMore(textRef.current.scrollHeight > textRef.current.clientHeight)
            }
        }, 1000)
    }, []);


    return (
        <div data-marginonpublished={bulletin.Text.split("\n").length > 1} data-readmore={readMore}
             data-hasreadmore={hasReadMore} key={bulletin.LightBulletinId}
             className="h-fit group p-4 has data-[hasreadmore=true]:hover:bg-foreground/15 data-[readmore=true]:hover:bg-foreground/15 rounded-md transition-all duration-200 bg-foreground/5 dark:bg-foreground/10 shadow-md overflow-hidden hover:shadow-lg hover:shadow-foreground/10 dark:hover:shadow-foreground/5">
            <div className="flex justify-between">
                <pre ref={textRef} onClick={() => {
                    setReadMore(!readMore)
                }}
                     className={"text-wrap font-sans font-semibold tracking-tight leading-snug group-data-[readmore=false]:line-clamp-6 group-data-[readmore=true]:line-clamp-none transition-all duration-200 group-data-[hasreadmore=false]:group-data-[readmore=true]:cursor-pointer group-data-[hasreadmore=true]:group-data-[readmore=false]:cursor-pointer"}>
                    {bulletin.Text}
                </pre>
                <Button
                    disabled={isLoading}
                    onClick={() => {
                        mutate({
                            isSubscribed: !bulletin.IsSubscribed
                        }, {
                            onSuccess: () => {
                                console.log("success")
                                bulletin.IsSubscribed = !bulletin.IsSubscribed
                                toast({
                                    title: "Success",
                                    description: bulletin.IsSubscribed ? "You will now receive notifications for this lightbulletin" : "You will no longer receive notifications for this lightbulletin",
                                    duration: 3000,
                                    variant: "success"
                                })
                            },
                            onError: () => {
                                console.log("error")
                                toast({
                                    title: "Error",
                                    description: "Something went wrong",
                                    duration: 3000,
                                    variant: "destructive"
                                })
                            },
                        })
                    }}
                    size={"icon"}
                    variant={"secondary"}
                    className="flex justify-end cursor-pointer hover:opacity-80 active:opacity-60 p-2 rounded-full bg-background/30 h-fit w-fit active:scale-95 transform transition-all duration-200 ease-in-out hover:shadow-md ml-4 md:ml-6 lg:ml-8 xl:ml-10">
                    {bulletin.IsSubscribed ? (
                        <BellRing className={"stroke-success w-6 h-6"}/>
                    ) : (
                        <BellOff className={"stroke-destructive w-6 h-6"}/>
                    )}
                </Button>
            </div>
            {showResources && (
                <div className="mt-4 mb-4 flex flex-col space-y-4">
                    {Resources!.EntityArray.map((resource) => (
                        <div className={"hover:cursor-pointer"} key={resource.ElementId} onClick={() => {
                            window.app.openExternal(resource.ContentUrl, true)
                        }}>
                            <div className="flex items-center space-x-2 text-blue-500 hover:text-blue-600">
                                <img src={resource.IconUrl} alt={resource.Title} className={"w-6 h-6"}/>
                                <span className="truncate">{resource.Title}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}


            <p className="text-gray-500 truncate group-data-[marginonpublished=true]:mt-4 group-data-[marginonpublished=false]:mt-0">
                Published by{' '}
                <a
                    href={bulletin.PublishedBy.ProfileUrl}
                    className="text-blue-500 hover:underline"
                >
                    {bulletin.PublishedBy.FullName}
                </a>{' '}
                on {new Date(bulletin.PublishedDate).toLocaleDateString()}
            </p>
            {showComments && (
                <>
                    {bulletin.CommentsCount > 0 && (
                        <Suspense fallback={
                            <Loader2 className={"w-6 h-6 stroke-current text-gray-500 animate-spin m-auto my-4"}/>
                        }>
                            <LightbulletinComments lightbulletinId={bulletin.LightBulletinId}/>
                        </Suspense>
                    )}
                    <LightbulletinCommentForm lightbulletinId={bulletin.LightBulletinId}/>
                </>
            )}
            <div className="mt-2 flex gap-4 truncate text-lg">
                {/*{bulletin.CommentsCount > 0 && (*/}
                <Badge
                    onClick={() => setShowComments(!showComments)}
                    variant={"outline"}
                    className={"hover:bg-secondary-200 gap-2 px-4 py-1 text-sm"}>
                    {bulletin.CommentsCount}
                    <BsChatSquareTextFill className={"mt-1"}/>
                </Badge>
                {/*)}*/}
                {bulletin.ResourcesCount > 0 && (
                    <Badge
                        onClick={() => setShowResources(!showResources)}
                        variant={"outline"}
                        className={"hover:bg-secondary-200 gap-2 px-4 py-1 text-sm"}>
                        {bulletin.ResourcesCount}
                        <BsFileEarmarkFill/>
                    </Badge>
                )}
            </div>
            {/*<div className="mt-4 flex justify-end">
                {hasReadMore && (
                    <div className={"mx-auto w-full flex items-center justify-center"}>
                        <Button variant={"secondary"} size={"sm"}
                                className={"text-blue-500 cursor-pointer"}
                                onClick={() => setReadMore(!readMore)}>
                            {readMore ? "Read less" : "Read more"}
                        </Button>
                    </div>
                )}
            </div>*/}
        </div>
    )
}
