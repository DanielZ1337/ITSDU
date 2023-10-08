import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {
    CourseCardsSortByTypesConst,
    CourseCardsSortByTypesLabels
} from "@/api-types/extra/course-cards-sort-by-types.ts";

export default function CourseSortSelect({
                                             selectedRankedBy,
                                             setSelectedRankedBy,
                                         }: {
    selectedRankedBy: string
    // eslint-disable-next-line no-unused-vars
    setSelectedRankedBy: (value: string) => void
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
    )
}