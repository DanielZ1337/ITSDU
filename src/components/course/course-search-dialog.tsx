import { cn } from "@/lib/utils";
import useGETstarredCourses from "@/queries/course-cards/useGETstarredCourses";
import useGETunstarredCourses from "@/queries/course-cards/useGETunstarredCourses";
import { useDebounce } from "@uidotdev/usehooks";
import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "../ui/command";
import { Skeleton } from "../ui/skeleton";

function CourseCommandList({
	starredFetching,
	unstarredFetching,
	starredCourses,
	unstarredCourses,
	element,
	element1,
}: {
	starredFetching: boolean;
	unstarredFetching: boolean;
	starredCourses: any;
	unstarredCourses: any;
	element: any;
	element1: any;
}) {
	return (
		<>
			<CommandEmpty
				className={cn(
					starredFetching || unstarredFetching
						? "hidden"
						: "py-6 text-center text-sm",
				)}
			>
				No courses found.
			</CommandEmpty>
			{starredFetching || unstarredFetching ? (
				<div className="overflow-hidden px-1 py-2 space-y-1">
					<Skeleton className="h-4 w-10 rounded" />
					<Skeleton className="h-8 rounded-sm" />
					<Skeleton className="h-8 rounded-sm" />
				</div>
			) : (
				starredCourses &&
				unstarredCourses && (
					<div className="overflow-y-auto max-h-[40dvh]">
						<CommandGroup
							heading={`${starredCourses.EntityArray.length} starred courses found`}
						>
							<div className="my-2 overflow-hidden pr-1 space-y-1">
								{starredCourses.EntityArray.map(element)}
							</div>
						</CommandGroup>
						<CommandGroup
							heading={`${unstarredCourses.EntityArray.length} unstarred courses found`}
						>
							<div className="my-2 overflow-hidden pr-1 space-y-1">
								{unstarredCourses.EntityArray.map(element1)}
							</div>
						</CommandGroup>
					</div>
				)
			)}
		</>
	);
}

export default function CourseSearchDialog({
	setSearchInput,
}: {
	searchInput: string;
	// eslint-disable-next-line no-unused-vars
	setSearchInput: (value: string) => void;
}) {
	const [isOpen, setIsOpen] = React.useState(false);
	const navigate = useNavigate();
	const [query, setQuery] = React.useState<string>("");
	const debouncedSearchTerm = useDebounce(query, 200);

	const { data: starredCourses, isLoading: isStarredFetching } =
		useGETstarredCourses(
			{
				PageIndex: 0,
				PageSize: 100,
				searchText: debouncedSearchTerm,
				sortBy: "Rank",
			},
			{
				suspense: false,
				keepPreviousData: true,
			},
		);

	const { data: unstarredCourses, isLoading: isUnstarredFetching } =
		useGETunstarredCourses(
			{
				PageIndex: 0,
				PageSize: 100,
				searchText: debouncedSearchTerm,
				sortBy: "Rank",
			},
			{
				suspense: false,
				keepPreviousData: true,
			},
		);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setIsOpen((isOpen) => !isOpen);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	const handleSelect = useCallback((callback: () => unknown) => {
		setIsOpen(false);
		callback();
	}, []);

	useEffect(() => {
		if (!isOpen) {
			setSearchInput("");
		}
	}, [isOpen, setSearchInput]);

	return (
		<CommandDialog open={isOpen} onOpenChange={setIsOpen}>
			<CommandInput
				placeholder="Search resources..."
				value={query}
				onValueChange={setQuery}
				// className={"border-"}
			/>
			<div className="overflow-hidden max-h-[50dvh]">
				<CommandList>
					<CourseCommandList
						starredFetching={isStarredFetching}
						unstarredFetching={isUnstarredFetching}
						starredCourses={starredCourses}
						unstarredCourses={unstarredCourses}
						element={(resource: any) => (
							<CommandItem
								key={resource.CourseId}
								value={resource.Title}
								className="truncate break-all line-clamp-1"
								onSelect={() =>
									handleSelect(() => {
										console.log("Selected resource", resource);
										navigate(`/courses/${resource.CourseId}`);
									})
								}
							>
								<span>{resource.Title}</span>
							</CommandItem>
						)}
						element1={(resource: any) => (
							<CommandItem
								key={resource.CourseId}
								value={resource.Title}
								className="truncate break-all line-clamp-1"
								onSelect={() =>
									handleSelect(() => {
										console.log("Selected resource", resource);
										navigate(`/course/${resource.CourseId}`);
									})
								}
							>
								<span>{resource.Title}</span>
							</CommandItem>
						)}
					/>
				</CommandList>
			</div>
		</CommandDialog>
	);
}
