import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";

const CourseCardsStarredOptions = {
    "All": "All",
    "Starred": "Starred",
    "Unstarred": "Unstarred",
} as {
    [key: string]: string
}

export default function CourseCardStarredSelect({
                                                    selectedStarredOption,
                                                    setSelectedStarredOption,
                                                }: {
    selectedStarredOption: string
    // eslint-disable-next-line no-unused-vars
    setSelectedStarredOption: (value: string) => void
}) {

    return (
        <Select onValueChange={setSelectedStarredOption} value={selectedStarredOption}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={"Sort by"} className={"text-left"}>
                    {CourseCardsStarredOptions[selectedStarredOption]}
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                {Object.entries(CourseCardsStarredOptions).map(([key, value]) => (
                    <SelectItem key={key} value={value}>
                        {CourseCardsStarredOptions[value]}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}