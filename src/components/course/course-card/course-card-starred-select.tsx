import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select.tsx";
import {
	CourseCardsSelectOptions,
	CourseCardsSelectOptionsEnum,
} from "@/types/course-cards-select-options.ts";
import { Filter } from "lucide-react";

export default function CourseCardStarredSelect({
	selectedStarredOption,
	setSelectedStarredOption,
}: {
	selectedStarredOption: CourseCardsSelectOptions;
	// eslint-disable-next-line no-unused-vars
	setSelectedStarredOption: (value: CourseCardsSelectOptions) => void;
}) {
	return (
		<Select
			onValueChange={setSelectedStarredOption}
			value={selectedStarredOption}
		>
			<SelectTrigger className="w-[140px] h-9 bg-secondary/50 border-0 focus:ring-1">
				<Filter className="w-3.5 h-3.5 text-muted-foreground mr-2" />
				<SelectValue placeholder="Filter" className="text-left">
					{CourseCardsSelectOptionsEnum[selectedStarredOption]}
				</SelectValue>
			</SelectTrigger>
			<SelectContent>
				{Object.keys(CourseCardsSelectOptionsEnum).map((option) => (
					<SelectItem key={option} value={option}>
						{CourseCardsSelectOptionsEnum[option as CourseCardsSelectOptions]}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
