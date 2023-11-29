import {Suspense, useEffect, useRef, useState} from "react";
import {Pencil, StarIcon} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import {useDebounce} from "@uidotdev/usehooks";
import {Skeleton} from "@/components/ui/skeleton";
import {
    CourseCardsSortByTypes,
    CourseCardsSortByTypesConst,
} from "@/types/api-types/extra/course-cards-sort-by-types.ts";
import {Helmet} from "react-helmet-async";
import CourseSortSelect from "@/components/course/course-sort-select.tsx";
import CourseCardStarredSelect from "@/components/course/course-card/course-card-starred-select.tsx";
import CourseCards from "@/components/course/course-card/course-cards.tsx";
import {CourseCardsSelectOptions, CourseCardsSelectOptionsEnum} from "@/types/course-cards-select-options.ts";
import {isCoursesBulkStarEditingAtom} from "@/atoms/courses-bulk-star-edit.ts";
import {useAtom} from "jotai";
import {Toggle} from "@/components/ui/toggle.tsx";
import CourseSearchDialog from "@/components/course/course-search-dialog";
import {isMacOS} from "@/lib/utils";

export default function Index() {
    const [searchInput, setSearchInput] = useState<string>("");
    const debouncedSearchTerm = useDebounce(searchInput, 100);
    const [selectedRankedBy, setSelectedRankedBy] = useState<CourseCardsSortByTypes>(
        CourseCardsSortByTypesConst[0]
    );
    const [selectedStarredOption, setSelectedStarredOption] = useState<CourseCardsSelectOptions>(CourseCardsSelectOptionsEnum.Starred);
    const [isCoursesBulkEditing, setIsCoursesBulkEditing] = useAtom(isCoursesBulkStarEditingAtom);
    const [cardsHeight, setCardsHeight] = useState<number>(0);
    const cardsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (cardsRef.current) {
            setCardsHeight(cardsRef.current.offsetHeight);
        }
    }, [cardsRef]);

    return (
        <div className={"flex flex-col flex-1 h-full w-full py-4"}>
            <Helmet>
                <title>itslearning</title>
            </Helmet>
            <div className={"flex flex-col gap-4 w-full sm:px-2 lg:px-4 xl:px-10"}>
                <h1 className={"text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tighter"}>
                    Courses
                </h1>
                <div
                    className={"flex flex-row gap-4 w-full justify-end mt-4 sm:mt-8 md:mt-12 lg:mt-16 xl:mt-20"}>
                    <div className={"w-1/3 relative"}>
                        <Input
                            placeholder={"Search"}
                            value={searchInput}
                            onChange={(e) => {
                                setSearchInput(e.target.value);
                            }}
                            autoFocus
                        />
                        <kbd
                            className="pointer-events-none absolute right-2 my-auto hidden h-5 select-none items-center gap-1 rounded border font-mono font-medium opacity-100 top-2.5 bg-muted px-1.5 text-[10px] lg:flex"
                        >
                            <span>{isMacOS() ? "⌘" : "Ctrl"}</span>K
                        </kbd>
                        <span className="sr-only">Search products</span>
                    </div>
                    <CourseSortSelect selectedRankedBy={selectedRankedBy} setSelectedRankedBy={setSelectedRankedBy}/>
                    <CourseCardStarredSelect
                        selectedStarredOption={selectedStarredOption}
                        setSelectedStarredOption={setSelectedStarredOption}
                    />
                    <Toggle
                        aria-label="Toggle bulk edit"
                        onPressedChange={setIsCoursesBulkEditing}
                        defaultPressed={isCoursesBulkEditing}
                        variant={"outline"}
                        className={"py-2 px-3"}
                    >
                        <Pencil className={"stroke-foreground shrink-0 m-1 h-6 w-6"}/>
                    </Toggle>
                </div>
            </div>
            <div className={"w-full text-center my-2 sm:my-4 md:my-6 lg:my-8 xl:my-10"}>
                {searchInput.length > 0 && (
                    <span
                        className={
                            "line-clamp-1 break-all text-wrap text-gray-500 text-sm sm:text-base md:text-lg font-semibold tracking-tighter mx-auto"
                        }
                    >
                        Showing results for "{searchInput}"
                    </span>
                )}
            </div>
            <div className={"items-center w-full h-full flex-wrap flex gap-4 lg:gap-6 justify-center flex-1 px-10"}
                 ref={cardsRef}>
                <Suspense fallback={
                    [...Array(12).keys()].map(i => i++).map((i) => (
                        <div key={i}
                             className={"flex flex-col bg-white rounded-md shadow-md w-72 h-36 lg:w-80 lg:h-44"}>
                            <div className={"flex flex-col w-full h-1/2 p-4 lg:p-6"}>
                                <div className={"flex flex-row justify-between items-center"}>
                                    <Skeleton className={"w-4/5 h-4 bg-gray-200 rounded-md"}/>
                                    <StarIcon
                                        className={"stroke-yellow-500 shrink-0 m-1 h-6 w-6"}/>
                                </div>
                            </div>
                        </div>
                    ))
                }>
                    <CourseCards
                        config={{
                            PageSize: 24,
                            isShowMore: false,
                            PageIndex: 0,
                            sortBy: selectedRankedBy,
                            searchText: debouncedSearchTerm,
                        }}
                        courseCardTypes={selectedStarredOption}
                    />
                </Suspense>
            </div>
            <CourseSearchDialog searchInput={debouncedSearchTerm} setSearchInput={setSearchInput}/>
            <div style={{height: cardsHeight}}/>
        </div>
    );
}