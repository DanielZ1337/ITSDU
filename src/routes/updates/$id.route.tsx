import { createFileRoute } from "@tanstack/react-router";
import renderLink from "@/components/custom-render-link-linkify";
import PersonHoverCard from "@/components/person/person-hover-card";
import useGETnotificationsStream from "@/queries/notifications/useGETnotificationsStream";
import Linkify from "linkify-react";
import { Helmet } from "react-helmet-async";
import useGETnotificationElements from "../../queries/notifications/useGETnotificationElements";
import {
  isSupportedResourceInApp,
  useNavigateToResource,
} from "@/types/api-types/extra/learning-tool-id-types";

export const Route = createFileRoute("/updates/$id")({
  component: NotificationID,
});

function NotificationID() {
  const { id } = Route.useParams();
  const { data: notification } = useGETnotificationsStream(
    {
      FromId: Number(id),
      PageSize: 1,
      showLightBulletins: true,
    },
    {
      suspense: true,
    },
  );

  const currentNotificaton = notification!.pages[0].EntityArray[0];

  const { data: resources } = useGETnotificationElements({
    notificationId: currentNotificaton.NotificationId,
    PageSize: 100,
  });

  const navigateToResource = useNavigateToResource();

  return (
    <div className="flex w-full flex-1 flex-col overflow-hidden p-6">
      <Helmet>
        <title>{currentNotificaton!.Text}</title>
      </Helmet>
      <h1 className="mb-4 text-2xl font-bold">{currentNotificaton!.Text}</h1>
      <div className="m-auto w-full overflow-auto px-20">
        <div className="m-auto max-w-2xl rounded-md p-10 shadow-md bg-foreground/10 dark:bg-foreground/40">
          <div className="mb-4 flex items-center">
            <img
              loading="lazy"
              src={currentNotificaton!.IconUrl}
              alt="Notification Icon"
              className="mr-2 h-6 w-6"
            />
            <h1 className="ml-2 text-lg font-bold">
              {currentNotificaton!.LocationTitle}
            </h1>
          </div>
          <p className="mb-4">{currentNotificaton!.Text}</p>
          {currentNotificaton!.PublishedDate && (
            <p className="mb-4 text-sm text-foreground/80">
              Published Date:{" "}
              {new Date(currentNotificaton!.PublishedDate).toDateString()}
            </p>
          )}
          {currentNotificaton.LightBulletin && (
            <div className="border-t border-gray-300 pt-4">
              <h2 className="mb-2 font-semibold text-md">Announcement:</h2>
              <p className="whitespace-pre-wrap text-sm text-foreground/80">
                <Linkify options={{ render: renderLink }}>
                  {currentNotificaton!.LightBulletin.Text}
                </Linkify>
              </p>
            </div>
          )}
          {currentNotificaton!.ElementsCount > 0 && (
            <div className="border-t border-gray-300 pt-4">
              <h2 className="mb-2 font-semibold text-md">Resources:</h2>
              {resources?.EntityArray.map((resource) => (
                <div
                  key={resource.ElementId}
                  className="mb-2 flex items-center"
                >
                  <img
                    loading="lazy"
                    src={resource.IconUrl}
                    alt="Resource Icon"
                    className="mr-2 h-6 w-6"
                  />
                  <button
                    onClick={async () => {
                      if (isSupportedResourceInApp(resource)) {
                        navigateToResource(resource);
                      } else {
                        await window.app.openExternal(resource.ContentUrl);
                      }
                    }}
                    className="text-sm text-foreground/80 hover:underline"
                  >
                    {resource.Title}
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4">
            <PersonHoverCard
              personId={currentNotificaton!.PublishedBy.PersonId}
              showTitle={false}
            >
              Published By: {currentNotificaton!.PublishedBy.FullName}
            </PersonHoverCard>
          </div>
        </div>
      </div>
    </div>
  );
}
