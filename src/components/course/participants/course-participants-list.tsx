import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Link} from "react-router-dom";
import PersonHoverCard from "@/components/person/person-hover-card";
import {GETcourseParticipants} from "@/types/api-types/courses/GETcourseParticipants";

export default function CourseParticipantsList({participants}: { participants: GETcourseParticipants["EntityArray"] }) {


    if (participants.length === 0) {
        return (
            <ul>
                <li className="p-4 mb-4">
                    <div className="text-center">
                        <h2 className="text-lg font-bold">No participants found</h2>
                        <p className="text-gray-600">Try searching for something else</p>
                    </div>
                </li>
            </ul>
        )
    }

    return (
        <ul>
            {participants.map((participant) => (
                <li key={participant.PersonId}
                    className="border rounded-lg p-4 mb-4 hover:bg-foreground/10 transition-colors">
                    <PersonHoverCard personId={participant.PersonId} showTitle={false} asChild>
                        <Link to={`/person/${participant.PersonId}`} className="flex items-center">
                            <div className="mr-4">
                                <Avatar className="w-12 h-12">
                                    <AvatarImage src={participant.PictureUrl} alt={participant.FullName}/>
                                    <AvatarFallback>
                                        {participant.FullName.split(" ").map((name) => name[0]).slice(0, 3).join("")}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="text-left">
                                <h2 className="text-lg font-bold">{participant.FullName}</h2>
                                <p className="text-gray-600">Role: {participant.Role}</p>
                            </div>
                            <div className="ml-auto">
                                <p className="text-gray-600">
                                    {participant.ExtraInformation}
                                </p>
                            </div>
                        </Link>
                    </PersonHoverCard>
                </li>
            ))}
        </ul>
    );
}