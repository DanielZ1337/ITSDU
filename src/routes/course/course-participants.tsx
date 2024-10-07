import CourseParticipantsList from "@/components/course/participants/course-participants-list.tsx";
import CourseParticipantsRolesSelect from "@/components/course/participants/course-participants-roles-select.tsx";
import { Input } from "@/components/ui/input";
import useGETcourseParticipants from "@/queries/courses/useGETcourseParticipants";
import { CourseParticipantRole } from "@/types/course-participants-roles";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function CourseParticipants() {
	const [searchTerm, setSearchTerm] = useState("");
	const { id } = useParams();
	const courseId = Number(id);

	const { data: participants } = useGETcourseParticipants(
		{ courseId },
		{ suspense: true },
	);

	console.log(participants);

	let filteredParticipants = participants!.EntityArray.filter((participant) =>
		participant.FullName.toLowerCase().includes(searchTerm.toLowerCase()),
	);
	const roleIdsFromFilteredParticipants = [
		...new Set(filteredParticipants.map((participant) => participant.RoleId)),
	];
	const [selectedRolesIds, setSelectedRolesIds] = useState<
		CourseParticipantRole[]
	>(roleIdsFromFilteredParticipants);
	filteredParticipants = filteredParticipants.filter((participant) =>
		selectedRolesIds.includes(participant.RoleId),
	);

	return (
		<div className="p-4">
			<h1 className="mb-4 text-2xl font-bold">Course Participants</h1>
			<div className="mb-4 flex items-center">
				<Input
					type="text"
					placeholder="Search participants"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="mr-2 w-full rounded-md border border-gray-300 px-4 py-2 sm:w-1/2"
				/>
				<CourseParticipantsRolesSelect
					roleIds={roleIdsFromFilteredParticipants}
					onChange={setSelectedRolesIds}
				/>
			</div>
			<CourseParticipantsList participants={filteredParticipants} />
		</div>
	);
}
