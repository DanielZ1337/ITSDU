import { Link } from "react-router-dom";
import PersonHoverCard from "../person/person-hover-card";

export default function NotificationPublishedBy({ personId, name }: { personId: number, name: string }) {
    return (
        <PersonHoverCard
            personId={personId}
            showTitle={false}
            asChild
        >
            <Link className="text-blue-500 hover:text-blue-600 transition-colors hover:underline"
                to={`/person/${personId}`}>
                {name}
            </Link>
        </PersonHoverCard>
    )
}