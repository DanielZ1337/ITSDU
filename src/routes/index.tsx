import {Pencil, StarIcon} from "lucide-react";
import {Suspense, useEffect, useState} from "react";
import {Input} from "@/components/ui/input.tsx";
import {useDebounce} from "@uidotdev/usehooks";
import {Skeleton} from "@/components/ui/skeleton"
import {CourseCardsSortByTypes} from "@/types/api-types/extra/course-cards-sort-by-types.ts";
import {Helmet} from "react-helmet";
import CourseSortSelect from "@/components/course/course-sort-select.tsx";
import CourseCardStarredSelect from "@/components/course/course-card-starred-select.tsx";
import CourseCards from "@/components/course/course-cards.tsx";
import {CourseCardsSelectOptions} from "@/types/course-cards-select-options.ts";
import {CoursesBulkStarEditAtom, isCoursesBulkStarEditingAtom} from "@/atoms/courses-bulk-star-edit.ts";
import {useAtom} from "jotai";
import {Toggle} from "@/components/ui/toggle.tsx";

export default function Index() {
    const [searchInput, setSearchInput] = useState<string>('')
    const debouncedSearchTerm = useDebounce(searchInput, 200);
    const [selectedRankedBy, setSelectedRankedBy] = useState<CourseCardsSortByTypes>("Rank")
    const [selectedStarredOption, setSelectedStarredOption] = useState<CourseCardsSelectOptions>("Starred")
    const [coursesBulkEdit] = useAtom(CoursesBulkStarEditAtom)
    const [isCoursesBulkEditing, setIsCoursesBulkEditing] = useAtom(isCoursesBulkStarEditingAtom)

    useEffect(() => {
        console.log(isCoursesBulkEditing)
    }, [isCoursesBulkEditing]);

    return (
        <div className={"flex flex-col flex-1 h-full w-full py-4"}>
            <Helmet>
                <title>itslearning</title>
            </Helmet>
            <div className={"flex flex-row flex-1 gap-4 flex-wrap justify-center"}>
                <div className={"items-center w-full h-full flex-wrap flex gap-4 justify-center flex-1 my-auto"}>
                    <div className={"flex flex-col gap-4 w-full sm:px-2 lg:px-4 xl:px-10"}>
                        <h1 className={"text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tighter"}>
                            Courses
                        </h1>
                        <div className={"flex flex-row gap-4 w-full justify-end"}>
                            <Input className={"w-1/3"} placeholder={"Search"} value={searchInput} onChange={(e) => {
                                setSearchInput(e.target.value)
                            }} autoFocus
                            />
                            <CourseSortSelect selectedRankedBy={selectedRankedBy}
                                              setSelectedRankedBy={setSelectedRankedBy}/>
                            <CourseCardStarredSelect selectedStarredOption={selectedStarredOption}
                                                     setSelectedStarredOption={setSelectedStarredOption}/>
                            <Toggle aria-label="Toggle bulk edit" onPressedChange={setIsCoursesBulkEditing}
                                    defaultPressed={isCoursesBulkEditing}
                                    variant={"outline"} className={"py-2 px-3"}>
                                <Pencil className={"stroke-foreground shrink-0 m-1 h-6 w-6"}/>
                            </Toggle>
                        </div>
                        {searchInput.length > 0 && (
                            <span
                                className={"text-gray-500 flex gap-2 items-center justify-center text-sm sm:text-base md:text-lg font-semibold tracking-tighter"}>
                                Showing results for "{searchInput}"
                            </span>
                        )}
                    </div>
                    <Suspense fallback={
                        [...Array(12).keys()].map(i => i++).map((i) => (
                                <div key={i} className={"flex flex-col w-72 h-36 bg-white rounded-md shadow-md"}>
                                    <div className={"flex flex-col w-full h-1/2 p-4"}>
                                        <div className={"flex flex-row justify-between items-center"}>
                                            <Skeleton className={"w-4/5 h-4 bg-gray-200 rounded-md"}/>
                                            <StarIcon
                                                className={"stroke-yellow-500 shrink-0 m-1 h-6 w-6"}/>
                                        </div>
                                    </div>
                                </div>
                            )
                        )
                    }>
                        <CourseCards config={{
                            PageSize: 24,
                            isShowMore: false,
                            PageIndex: 0,
                            sortBy: selectedRankedBy,
                            searchText: debouncedSearchTerm
                        }} courseCardTypes={selectedStarredOption}
                        />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}