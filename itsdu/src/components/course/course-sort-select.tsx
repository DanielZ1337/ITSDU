import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select.tsx";
import {
	CourseCardsSortByTypes,
	CourseCardsSortByTypesConst,
	CourseCardsSortByTypesLabels,
} from "@/types/api-types/extra/course-cards-sort-by-types.ts";

export default function CourseSortSelect({
	selectedRankedBy,
	setSelectedRankedBy,
}: {
	selectedRankedBy: CourseCardsSortByTypes;
	// eslint-disable-next-line no-unused-vars
	setSelectedRankedBy: (courseType: CourseCardsSortByTypes) => void;
}) {
	return (
		<Select onValueChange={setSelectedRankedBy} value={selectedRankedBy}>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder={"Sort by"} className={"text-left"}>
					{CourseCardsSortByTypesLabels[selectedRankedBy]}
				</SelectValue>
			</SelectTrigger>
			<SelectContent>
				{Object.entries(CourseCardsSortByTypesConst).map(([key, value]) => (
					<SelectItem key={key} value={value}>
						{CourseCardsSortByTypesLabels[value]}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
