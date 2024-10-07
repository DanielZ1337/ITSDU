import LightbulletinCommentForm from "@/components/lightbulletin/lightbulletin-comment-form.tsx";
import LightbulletinComments from "@/components/lightbulletin/lightbulletin-comments.tsx";
import PersonHoverCard from "@/components/person/person-hover-card";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useCourse } from "@/hooks/atoms/useCourse";
import useGETlightbulletinResources from "@/queries/lightbulletin/useGETlightbulletinResources.ts";
import usePUTlightbulletinNotifications from "@/queries/lightbulletin/usePUTlightbulletinNotifications.ts";
import { ItslearningRestApiEntitiesLightBulletinsLightBulletinV2 } from "@/types/api-types/utils/Itslearning.RestApi.Entities.LightBulletins.LightBulletinV2";
import { LinkifyType } from "@/types/linkify";
import Linkify from "linkify-react";
import { BellOff, BellRing } from "lucide-react";
import React, { Suspense, useState } from "react";
import { BsChatSquareTextFill, BsFileEarmarkFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import renderLink from "../custom-render-link-linkify";
import HoverDate from "../hover-date";
import { Loader } from "../ui/loader";
import LightbulletinAvatar from "./lightbulletin-avatar";
import LightbulletinImage from "./lightbulletin-image";
import LightbulletinLink from "./lightbulletin-link";
import LightbulletinLinkPreview from "./lightbulletin-link-preview";
import LightbulletinResource from "./lightbulletin-resource";

export default function LightbulletinCard({
  bulletin,
  links,
}: {
  bulletin: ItslearningRestApiEntitiesLightBulletinsLightBulletinV2;
  links?: LinkifyType[];
}) {
  const [readMore, setReadMore] = useState(false);
  const textRef = React.useRef<HTMLPreElement>(null);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [showResources, setShowResources] = useState<boolean>(false);
  const { courseId } = useCourse();

  const { mutate, isLoading } = usePUTlightbulletinNotifications({
    lightbulletinId: bulletin.LightBulletinId,
  });

  const { data: Resources } = useGETlightbulletinResources(
    {
      bulletinId: bulletin.LightBulletinId,
    },
    {
      enabled: bulletin.ResourcesCount > 0,
    },
  );

  // let hasReadMore = textRef.current?.scrollHeight > textRef.current?.clientHeight;
  let hasReadMore = bulletin.Text.split("\n").length > 6;

  return (
    <div
      data-marginonpublished={bulletin.Text.split("\n").length > 1}
      data-readmore={readMore}
      data-hasreadmore={hasReadMore}
      key={bulletin.LightBulletinId}
      className="h-fit group p-4 has data-[hasreadmore=true]:hover:dark:bg-foreground/15 data-[hasreadmore=true]:hover:bg-foreground/10 rounded-md transition-all duration-200 bg-foreground/5 dark:bg-foreground/10 shadow-md overflow-hidden hover:shadow-lg hover:shadow-foreground/10 dark:hover:shadow-foreground/5"
    >
      <div className="flex justify-between">
        <div className="flex items-center space-x-2">
          <LightbulletinAvatar
            src={bulletin.PublishedBy.ProfileImageUrlSmall}
            name={bulletin.PublishedBy.FullName}
          />
          <div className="flex flex-col truncate space-y-0.5">
            <PersonHoverCard
              personId={bulletin.PublishedBy.PersonId}
              asChild
              showTitle={false}
            >
              <Link
                to={`/person/${bulletin.PublishedBy.PersonId}`}
                className="font-semibold text-blue-500 hover:underline"
              >
                {bulletin.PublishedBy.FullName}{" "}
              </Link>
            </PersonHoverCard>
            <HoverDate date={bulletin.PublishedDate} />
          </div>
        </div>
        <Button
          disabled={isLoading}
          onClick={() => {
            mutate(
              {
                isSubscribed: !bulletin.IsSubscribed,
              },
              {
                onSuccess: () => {
                  console.log("success");
                  bulletin.IsSubscribed = !bulletin.IsSubscribed;
                  toast.success("Success", {
                    description: bulletin.IsSubscribed
                      ? "You will now receive notifications for this lightbulletin"
                      : "You will no longer receive notifications for this lightbulletin",
                    duration: 3000,
                  });
                },
                onError: () => {
                  console.log("error");
                  toast.error("Error", {
                    description: "Something went wrong",
                    duration: 3000,
                  });
                },
              },
            );
          }}
          size={"icon"}
          variant={"secondary"}
          className="ml-4 flex h-fit w-fit transform cursor-pointer justify-end rounded-full p-2 transition-all duration-200 ease-in-out bg-background/30 hover:opacity-80 hover:shadow-md active:scale-95 active:opacity-60 md:ml-6 lg:ml-8 xl:ml-10"
        >
          {bulletin.IsSubscribed ? (
            <BellRing className={"stroke-success w-6 h-6"} />
          ) : (
            <BellOff className={"stroke-destructive w-6 h-6"} />
          )}
        </Button>
      </div>
      <pre
        ref={textRef}
        onClick={() => setReadMore((prev) => !prev)}
        className={
          "my-4 whitespace-pre text-wrap font-sans font-normal group-data-[readmore=false]:line-clamp-6 group-data-[readmore=true]:line-clamp-none transition-all duration-200 group-data-[hasreadmore=true]:cursor-pointer"
        }
      >
        <Linkify options={{ render: renderLink }}>{bulletin.Text}</Linkify>
      </pre>
      {bulletin.AttachedImages && bulletin.AttachedImages.length > 0 && (
        <div className="mb-4 flex p-2 overflow-auto gap-4">
          {bulletin.AttachedImages.map((image) => (
            <LightbulletinImage key={image.OriginalFileId} image={image} />
          ))}
        </div>
      )}
      {links && links.length > 0 && (
        <div className="mb-4 flex flex-col rounded-lg p-2 space-y-4">
          {links.map((link) => (
            <Suspense
              key={link.href}
              fallback={
                <LightbulletinLink>
                  <Loader className={"stroke-current text-gray-500 m-auto"} />
                </LightbulletinLink>
              }
            >
              <LightbulletinLinkPreview
                key={link.href}
                href={link.value}
                type={link.type as "url" | "email"}
                title={link.value}
              />
            </Suspense>
          ))}
        </div>
      )}
      {/* <div
                className={"w-full items-center justify-center flex flex-col gap-4 truncate text-lg group-data-[readmore=false]:hidden group-data-[readmore=true]:flex"}>
                <OgImagePreview url={links[links.length - 1]} />
            </div> */}
      {showResources && (
        <div className="mb-4 flex flex-col rounded-lg p-2 space-y-4">
          {Resources!.EntityArray.map((resource) => (
            <LightbulletinResource
              key={resource.ElementId}
              resource={resource}
              courseId={courseId!}
            />
          ))}
        </div>
      )}
      {showComments && (
        <>
          {bulletin.CommentsCount > 0 && (
            <Suspense
              fallback={
                <Loader
                  className={"stroke-current text-gray-500 m-auto my-4"}
                />
              }
            >
              <LightbulletinComments
                lightbulletinId={bulletin.LightBulletinId}
              />
            </Suspense>
          )}
          <LightbulletinCommentForm
            lightbulletinId={bulletin.LightBulletinId}
          />
        </>
      )}
      <div className="mt-2 flex gap-4 truncate text-lg">
        {/*{bulletin.CommentsCount > 0 && (*/}
        <LightbulletinBadgeButton
          onClick={() => setShowComments(!showComments)}
        >
          {bulletin.CommentsCount}
          <BsChatSquareTextFill className={"mt-1"} />
        </LightbulletinBadgeButton>
        {/*)}*/}
        {bulletin.ResourcesCount > 0 && (
          <LightbulletinBadgeButton
            onClick={() => setShowResources(!showResources)}
          >
            {bulletin.ResourcesCount}
            <BsFileEarmarkFill />
          </LightbulletinBadgeButton>
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
  );
}

export function LightbulletinBadgeButton({
  children,
  ...props
}: {
  children: React.ReactNode;
} & React.ComponentProps<typeof Badge>) {
  return (
    <Badge size={"lg"} {...props}>
      {children}
    </Badge>
  );
}
