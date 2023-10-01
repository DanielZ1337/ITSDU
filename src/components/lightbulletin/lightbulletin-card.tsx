import {GETlightbulletinsForCourse} from "@/api-types/lightbulletin-course/GETlightbulletinsForCourse.ts";

export default function LightbulletinCard({bulletin}: { bulletin: GETlightbulletinsForCourse['EntityArray'][0] }) {

    return (
        <div key={bulletin.LightBulletinId} className="p-4 rounded-md bg-foreground/10 shadow-md hover:shadow-lg">
            <p className={"line-clamp-6"}>{bulletin.Text}</p>
            <p className="text-gray-500">
                Published by{' '}
                <a
                    href={bulletin.PublishedBy.ProfileUrl}
                    className="text-blue-500 hover:underline"
                >
                    {bulletin.PublishedBy.FullName}
                </a>{' '}
                on {new Date(bulletin.PublishedDate).toLocaleDateString()}
            </p>
            <div className="mt-2 flex justify-between">
        <span className="text-gray-600">
          {bulletin.CommentsCount} Comment{bulletin.CommentsCount !== 1 && 's'}
        </span>
                <span className="text-gray-600">
          {bulletin.ResourcesCount} Resource{bulletin.ResourcesCount !== 1 && 's'}
        </span>
                {bulletin.IsSubscribed && (
                    <span className="text-green-500 font-semibold">Subscribed</span>
                )}
            </div>
        </div>
    )
}
