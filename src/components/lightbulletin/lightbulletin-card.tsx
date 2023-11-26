import React, { Suspense, useEffect, useState } from "react";
import { BsChatSquareTextFill, BsFileEarmarkFill } from "react-icons/bs";
import { Badge } from "@/components/ui/badge.tsx";
import { BellOff, BellRing, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import usePUTlightbulletinNotifications from "@/queries/lightbulletin/usePUTlightbulletinNotifications.ts";
import { useToast } from "@/components/ui/use-toast.ts";
import LightbulletinComments from "@/components/lightbulletin/lightbulletin-comments.tsx";
import LightbulletinCommentForm from "@/components/lightbulletin/lightbulletin-comment-form.tsx";
import useGETlightbulletinResources from "@/queries/lightbulletin/useGETlightbulletinResources.ts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import { Link, useNavigate } from "react-router-dom";
import PersonHoverCard from "@/components/person/person-hover-card";
import Linkify from "linkify-react";
import renderLink from "../custom-render-link-linkify";
import {
    ItslearningRestApiEntitiesLightBulletinsLightBulletinV2
} from "@/types/api-types/utils/Itslearning.RestApi.Entities.LightBulletins.LightBulletinV2";
import HoverDate from "../hover-date";
import { isResourcePDFFromUrlOrElementType, isSupportedResourceInApp, useNavigateToResource } from "@/types/api-types/extra/learning-tool-id-types";
import { ItslearningRestApiEntitiesElementType } from "@/types/api-types/utils/Itslearning.RestApi.Entities.ElementType";
import { useCourse } from "@/hooks/atoms/useCourse";
import { getPersonInitials } from "@/lib/utils";
import LightbulletinAvatar from "./lightbulletin-avatar";

export default function LightbulletinCard({ bulletin }: {
    bulletin: ItslearningRestApiEntitiesLightBulletinsLightBulletinV2
}) {
    const [readMore, setReadMore] = useState(false);
    const [hasReadMore, setHasReadMore] = useState<boolean>(false)
    const textRef = React.useRef<HTMLPreElement>(null);
    const [showComments, setShowComments] = useState<boolean>(false)
    const [showResources, setShowResources] = useState<boolean>(false)
    const { toast } = useToast()
    const navigate = useNavigate()
    const { courseId } = useCourse()
    const navigateToResource = useNavigateToResource(navigate)

    const { mutate, isLoading } = usePUTlightbulletinNotifications({
        lightbulletinId: bulletin.LightBulletinId,
    })

    const { data: Resources } = useGETlightbulletinResources({
        bulletinId: bulletin.LightBulletinId,
    }, {
        enabled: bulletin.ResourcesCount > 0,
    })

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
            className="h-fit group p-4 has data-[hasreadmore=true]:hover:dark:bg-foreground/15 data-[readmore=true]:dark:hover:bg-foreground/15 data-[hasreadmore=true]:hover:bg-foreground/10 data-[readmore=true]:hover:bg-foreground/10 rounded-md transition-all duration-200 bg-foreground/5 dark:bg-foreground/10 shadow-md overflow-hidden hover:shadow-lg hover:shadow-foreground/10 dark:hover:shadow-foreground/5">
            <div className="flex justify-between">
                <div className="flex items-center space-x-2">
                    <LightbulletinAvatar
                        src={bulletin.PublishedBy.ProfileImageUrlSmall}
                        name={bulletin.PublishedBy.FullName}
                    />
                    <div className="flex flex-col truncate space-y-0.5">
                        <PersonHoverCard personId={bulletin.PublishedBy.PersonId} asChild showTitle={false}>
                            <Link
                                to={`/person/${bulletin.PublishedBy.PersonId}`}
                                className="font-semibold text-blue-500 hover:underline"
                            >
                                {bulletin.PublishedBy.FullName}{' '}
                            </Link>
                        </PersonHoverCard>
                        <HoverDate date={bulletin.PublishedDate} />
                    </div>
                </div>
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
                    className="ml-4 flex h-fit w-fit transform cursor-pointer justify-end rounded-full p-2 transition-all duration-200 ease-in-out bg-background/30 hover:opacity-80 hover:shadow-md active:scale-95 active:opacity-60 md:ml-6 lg:ml-8 xl:ml-10">
                    {bulletin.IsSubscribed ? (
                        <BellRing className={"stroke-success w-6 h-6"} />
                    ) : (
                        <BellOff className={"stroke-destructive w-6 h-6"} />
                    )}
                </Button>
            </div>
            <pre ref={textRef} onClick={() => {
                setReadMore(!readMore)
            }}
                className={"py-4 text-wrap font-sans font-normal group-data-[readmore=false]:line-clamp-6 group-data-[readmore=true]:line-clamp-none transition-all duration-200 group-data-[hasreadmore=false]:group-data-[readmore=true]:cursor-pointer group-data-[hasreadmore=true]:group-data-[readmore=false]:cursor-pointer"}>
                <Linkify options={{ render: renderLink }}>
                    {bulletin.Text}
                </Linkify>
            </pre>
            {showResources && (
                <div className="mt-4 mb-4 flex flex-col rounded-lg p-2 space-y-4">
                    {Resources!.EntityArray.map((resource) => (
                        <div
                            className={"hover:cursor-pointer hover:bg-foreground/5 py-2 px-2 hover:border-transparent border border-foreground/10 rounded-lg group/attachment"}
                            key={resource.ElementId} onClick={() => {
                                if (isSupportedResourceInApp(resource)) {
                                    navigateToResource(resource)
                                    // @ts-ignore
                                } else if (resource.ElementType === ItslearningRestApiEntitiesElementType[ItslearningRestApiEntitiesElementType.Folder]) {
                                    navigate(`/courses/${courseId}/resources/${resource.ElementId}`)
                                } else {
                                    window.app.openExternal(resource.ContentUrl, true)
                                }
                            }}>
                            <div
                                className="flex items-center p-2 text-blue-500 group-hover/attachment:text-blue-600 space-x-2">
                                <img src={resource.IconUrl} alt={resource.Title} className={"w-6 h-6"} />
                                <span className="truncate">{resource.Title}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {showComments && (
                <>
                    {bulletin.CommentsCount > 0 && (
                        <Suspense fallback={
                            <Loader2 className={"w-6 h-6 stroke-current text-gray-500 animate-spin m-auto my-4"} />
                        }>
                            <LightbulletinComments lightbulletinId={bulletin.LightBulletinId} />
                        </Suspense>
                    )}
                    <LightbulletinCommentForm lightbulletinId={bulletin.LightBulletinId} />
                </>
            )}
            <div className="mt-2 flex gap-4 truncate text-lg">
                {/*{bulletin.CommentsCount > 0 && (*/}
                <Badge
                    onClick={() => setShowComments(!showComments)}
                    variant={"purple"}
                >
                    {bulletin.CommentsCount}
                    <BsChatSquareTextFill className={"mt-1"} />
                </Badge>
                {/*)}*/}
                {bulletin.ResourcesCount > 0 && (
                    <Badge
                        onClick={() => setShowResources(!showResources)}
                        variant={"purple"}
                    >
                        {bulletin.ResourcesCount}
                        <BsFileEarmarkFill />
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