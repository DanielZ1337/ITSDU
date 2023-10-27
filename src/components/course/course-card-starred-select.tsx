import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { CourseCardsSelectOptions, CourseCardsSelectOptionsEnum } from "@/types/course-cards-select-options.ts";

export default function CourseCardStarredSelect({
    selectedStarredOption,
    setSelectedStarredOption,
}: {
    selectedStarredOption: CourseCardsSelectOptions
    // eslint-disable-next-line no-unused-vars
    setSelectedStarredOption: (value: CourseCardsSelectOptions) => void
}) {

    return (
        <Select onValueChange={setSelectedStarredOption} value={selectedStarredOption}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={"Sort by"} className={"text-left"}>
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
    )
}