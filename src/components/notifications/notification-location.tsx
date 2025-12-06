import { Link } from "react-router-dom";

export default function NotificationLocation({
	locationTitle,
	locationId,
}: {
	locationTitle: string;
	locationId: number;
}) {
	return (
		<Link
			className="text-primary transition-colors hover:text-primary/80 hover:underline"
			to={`/courses/${locationId}`}
		>
			{locationTitle}
		</Link>
	);
}
