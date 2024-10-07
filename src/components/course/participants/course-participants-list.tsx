import PersonHoverCard from "@/components/person/person-hover-card";
import ProfileAvatar from "@/components/profile-avatar";
import { GETcourseParticipants } from "@/types/api-types/courses/GETcourseParticipants";
import { Link } from "react-router-dom";

export default function CourseParticipantsList({
	participants,
}: {
	participants: GETcourseParticipants["EntityArray"];
}) {
	if (participants.length === 0) {
		return (
			<ul>
				<li className="mb-4 p-4">
					<div className="text-center">
						<h2 className="text-lg font-bold">No participants found</h2>
						<p className="text-gray-600">Try searching for something else</p>
					</div>
				</li>
			</ul>
		);
	}

	return (
		<ul>
			{participants.map((participant) => (
				<li
					key={participant.PersonId}
					className="mb-4 rounded-lg border transition-colors hover:bg-foreground/10"
				>
					<PersonHoverCard
						personId={participant.PersonId}
						showTitle={false}
						asChild
					>
						<Link
							to={`/person/${participant.PersonId}`}
							className="flex items-center p-4 rounded-lg"
						>
							<div className="mr-4">
								<ProfileAvatar
									src={participant.PictureUrl}
									name={participant.FullName}
									className={"w-12 h-12 border-2 border-primary/20"}
									classNameFallback={"bg-foreground/10 font-normal"}
								/>
							</div>
							<div className="text-left">
								<h2 className="text-lg font-bold">{participant.FullName}</h2>
								<p className="text-gray-600">Role: {participant.Role}</p>
							</div>
							<div className="ml-auto">
								<p className="text-gray-600">{participant.ExtraInformation}</p>
							</div>
						</Link>
					</PersonHoverCard>
				</li>
			))}
		</ul>
	);
}
