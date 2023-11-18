import { Link } from "react-router-dom";

export default function NotificationLocation({ locationTitle, locationId }: { locationTitle: string, locationId: number }) {
    return (
        <Link className="text-blue-500 hover:text-blue-600 transition-colors hover:underline"
            to={`/courses/${locationId}`}>
            {locationTitle}
        </Link>
    )
}