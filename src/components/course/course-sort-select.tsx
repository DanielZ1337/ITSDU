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
import { ArrowUpDown } from "lucide-react";

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
			<SelectTrigger className="w-[160px] h-9 bg-secondary/50 border-0 focus:ring-1">
				<ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground mr-2" />
				<SelectValue placeholder="Sort by" className="text-left">
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
