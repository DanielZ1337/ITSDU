import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import useGETcourses from "@/queries/course-cards/useGETcourses";
import useGETcourseAllResources from "@/queries/courses/useGETcourseAllResources";
import useGETcoursesv3 from "@/queries/courses/useGETcoursesv3";
import {
	isSupportedResourceInApp,
	useNavigateToResource,
} from "@/types/api-types/extra/learning-tool-id-types";
import { ItslearningRestApiEntitiesPersonalCourseCourseResource } from "@/types/api-types/utils/Itslearning.RestApi.Entities.Personal.Course.CourseResource";
import {
	DndContext,
	KeyboardSensor,
	PointerSensor,
	UniqueIdentifier,
	closestCenter,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	arrayMove,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS as CSSDND } from "@dnd-kit/utilities";
import { createContext, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type SelectedDocument = {
	ElementId: number;
	Title: string;
	CourseId: number;
	CourseTitle: string;
};
const MergeDocumentsContext = createContext<{
	selectedDocuments: Map<number, SelectedDocument> | null;
	setSelectedDocuments: (
		selectedDocuments: Map<number, SelectedDocument> | null,
	) => void;
	addSelectedDocument: (selectedDocument: SelectedDocument) => void;
	removeSelectedDocument: (selectedDocument: SelectedDocument) => void;
}>({
	selectedDocuments: null,
	setSelectedDocuments: () => {},
	addSelectedDocument: () => {},
	removeSelectedDocument: () => {},
});

const useMergeDocumentsContext = () => {
	const context = useContext(MergeDocumentsContext);
	if (!context) {
		throw new Error(
			"useMergeDocumentsContext must be used within a MergeDocumentsProvider",
		);
	}
	return context;
};

export default function MergeZIPDocuments() {
	const [selectedDocuments, setSelectedDocuments] = useState<Map<
		number,
		SelectedDocument
	> | null>(null);
	const [openedStarredUnstarred, setOpenedStarredUnstarred] = useState<
		string[]
	>([]);
	const [openedCourses, setOpenedCourses] = useState<string[]>([]);
	const [isDownloading, setIsDownloading] = useState(false);
	const [isMerging, setIsMerging] = useState(false);
	const [options, setOptions] = useState<{
		organizeByCourse: boolean;
	}>({
		organizeByCourse: true,
	});

	const addSelectedDocument = (selectedDocument: SelectedDocument) => {
		setSelectedDocuments(
			new Map([
				...(selectedDocuments || new Map()),
				[selectedDocument.ElementId, selectedDocument],
			]),
		);
	};

	const removeSelectedDocument = (selectedDocument: SelectedDocument) => {
		const newSelectedDocuments = new Map(selectedDocuments);
		newSelectedDocuments.delete(selectedDocument.ElementId);
		setSelectedDocuments(newSelectedDocuments);
	};

	const contextValue = useMemo(
		() => ({
			selectedDocuments,
			setSelectedDocuments,
			addSelectedDocument,
			removeSelectedDocument,
		}),
		[
			selectedDocuments,
			setSelectedDocuments,
			addSelectedDocument,
			removeSelectedDocument,
		],
	);

	const { data, isLoading } = useGETcoursesv3({});

	const { data: data2, isLoading: isLoading2 } = useGETcourses("All", {});

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const handleDragEnd = (event: {
		active: { id: UniqueIdentifier };
		over: { id: UniqueIdentifier } | null;
	}) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			setSelectedDocuments((currentSelectedDocuments) => {
				if (!currentSelectedDocuments) {
					return null;
				}

				const items = Array.from(currentSelectedDocuments.keys());
				const oldIndex = items.indexOf(Number(active.id));
				const newIndex = items.indexOf(Number(over.id));

				const newOrder = arrayMove(
					Array.from(currentSelectedDocuments.entries()),
					oldIndex,
					newIndex,
				);

				return new Map(newOrder);
			});
		}
	};

	if (isLoading || isLoading2 || !data || !data2) {
		return <Loader className={"m-auto"} />;
	}

	//combine data and data2 based on the course id
	const combinedData = data?.EntityArray.map((course) => {
		const course2 = data2?.EntityArray.find(
			(course2) => course2.CourseId === course.CourseId,
		);

		return {
			...course,
			...course2,
		};
	});

	const starredCourses = combinedData?.filter(
		(course) => course.IsFavouriteCourse,
	);
	const unstarredCourses = combinedData?.filter(
		(course) => !course.IsFavouriteCourse,
	);

	const downloadAsZip = () => {
		const selectedDocumentsArray = Array.from(
			selectedDocuments?.values() || [],
		);

		if (selectedDocumentsArray.length === 0) {
			return;
		}

		setIsDownloading(true);

		const allElementIds = selectedDocumentsArray.map(
			(document) => document.ElementId,
		);

		window.app
			.zipDownloadAllCourseResources(allElementIds, {
				organizeByCourse: options.organizeByCourse,
			})
			.then((path) => {
				if (!path) return;

				toast.success(
					`The documents have been downloaded as a ZIP file to ${path}`,
					{
						action: {
							label: "Open",
							onClick: () => void window.app.openItem(path),
						},
					},
				);
				setSelectedDocuments(null);
			})
			.catch((error) => {
				toast.error(
					`An error occurred while downloading the documents as a ZIP file: ${error.message}`,
				);
				setSelectedDocuments(null);
			})
			.finally(() => {
				setIsDownloading(false);
			});
	};

	const isButtonDisabled =
		selectedDocuments?.size === 0 || !selectedDocuments || isDownloading;

	const handleMergePDF = () => {
		if (isMerging) return;

		setIsMerging(true);

		const selectedDocumentsArray = Array.from(
			selectedDocuments?.values() || [],
		);

		if (selectedDocumentsArray.length === 0 || !selectedDocuments) {
			return;
		}

		//map to strings

		const allElementIds = selectedDocumentsArray.map((document) =>
			String(document.ElementId),
		);

		window.app
			.mergePDFs(allElementIds)
			.then((path) => {
				if (!path) return;

				toast.success(
					`The documents have been merged into a single PDF file at ${path}`,
					{
						action: {
							label: "Open",
							onClick: () => void window.app.openItem(path),
						},
					},
				);
				setSelectedDocuments(null);
			})
			.catch((error) => {
				toast.error(
					`An error occurred while merging the documents: ${error.message}`,
				);
				console.error(error);
			})
			.finally(() => {
				setIsMerging(false);
			});
	};

	return (
		<MergeDocumentsContext.Provider value={contextValue}>
			<div className="flex max-w-full w-full mx-auto justify-between p-10 lg:p-20 h-full max-h-full flex-1 overflow-hidden gap-4 transition-all">
				<Card className="flex flex-col justify-between max-h-full max-w-xl w-full min-w-0">
					<div className="flex flex-col max-h-full h-full w-full overflow-hidden">
						<CardHeader className="w-full">
							<CardTitle>Selected Documents</CardTitle>
							<CardDescription>
								<span>These are the documents you have selected to merge</span>
								<div className="mt-2 flex gap-2 justify-end items-center w-full max-w-full overflow-auto transition-all">
									<Button
										className="line-clamp-1 w-fit truncate"
										variant={"destructive"}
										disabled={isButtonDisabled}
										onClick={() => setSelectedDocuments(null)}
									>
										Clear
									</Button>
									<Button
										className="line-clamp-1 w-fit truncate"
										variant={"secondary"}
										disabled={isButtonDisabled || isMerging}
										onClick={handleMergePDF}
									>
										{isMerging ? <Loader size={"sm"} /> : "Merge PDFs"}
									</Button>
									<Button
										className="line-clamp-1 w-fit truncate"
										variant={"secondary"}
										disabled={isButtonDisabled}
										onClick={downloadAsZip}
									>
										{isDownloading ? <Loader size={"sm"} /> : "Download as ZIP"}
									</Button>
									{/* <Switch
										checked={options.organizeByCourse}
										onCheckedChange={(value) =>
											setOptions({
												...options,
												organizeByCourse: value,
											})
										}
									/> */}
									<Toggle
										pressed={options.organizeByCourse}
										onPressedChange={(value) =>
											setOptions({
												...options,
												organizeByCourse: value,
											})
										}
										className="line-clamp-1 w-fit truncate group data-[state=on]:bg-success-200 text-white data-[state=on]:text-white  data-[state=off]:bg-destructive data-[state=off]:hover:bg-destructive/75 data-[state=on]:hover:bg-success/75 data-[state=on]:hover:text-success-900 data-[state=off]:hover:text-muted-foreground"
									>
										<span className="group-data-[state=off]:visible group-data-[state=off]:hidden">
											Sorted by course
										</span>
										<span className="group-data-[state=on]:visible group-data-[state=on]:hidden">
											Unsorted
										</span>
									</Toggle>
								</div>
							</CardDescription>
						</CardHeader>
						<CardContent className="overflow-y-auto overflow-x-hidden h-full gap-2 flex flex-col min-w-0">
							<DndContext
								sensors={sensors}
								collisionDetection={closestCenter}
								onDragEnd={handleDragEnd}
							>
								<SortableContext
									items={Array.from(selectedDocuments?.keys() || [])}
									strategy={verticalListSortingStrategy}
								>
									{selectedDocuments ? (
										Array.from(selectedDocuments.values()).map((document) => (
											<SortableItem
												key={document.ElementId}
												id={document.ElementId}
											>
												<Card className="overflow-hidden bg-secondary border-none">
													<CardHeader>
														<CardTitle className="truncate text-lg">
															{document.Title}
														</CardTitle>
														<CardDescription>
															{document.CourseTitle}
														</CardDescription>
													</CardHeader>
												</Card>
											</SortableItem>
										))
									) : (
										<div className="flex justify-center">
											<span className="text-muted-foreground">
												No documents selected
											</span>
										</div>
									)}
								</SortableContext>
							</DndContext>
						</CardContent>
					</div>
				</Card>

				<div className="flex flex-col items-center justify-center max-w-2xl w-full min-w-0">
					<Card className="flex flex-col justify-between max-h-full w-full overflow-auto min-w-0">
						<CardContent className="pt-6">
							<Accordion
								type="multiple"
								value={openedStarredUnstarred}
								onValueChange={setOpenedStarredUnstarred}
							>
								<AccordionItem value="starred">
									<AccordionTrigger>
										<h2>
											Starred Courses
											{/* <Button className='ml-2' variant={"secondary"}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                }}>
                                                Download all
                                            </Button> */}
										</h2>
									</AccordionTrigger>
									<AccordionContent>
										{starredCourses?.map((course) => (
											<Accordion
												type="multiple"
												value={openedCourses}
												onValueChange={setOpenedCourses}
												key={course.CourseId}
											>
												<AccordionItem
													value={String(course.CourseId)}
													className={cn(
														course ===
															starredCourses[starredCourses.length - 1] &&
															"border-b-0",
													)}
												>
													<AccordionTrigger>
														<h3>{course.Title}</h3>
													</AccordionTrigger>
													<AccordionContent>
														<CourseDocuments
															courseTitle={course.Title}
															courseId={course.CourseId}
															isDownloading={isDownloading}
														/>
													</AccordionContent>
												</AccordionItem>
											</Accordion>
										))}
									</AccordionContent>
								</AccordionItem>
								<AccordionItem value="unstarred" className="border-b-0">
									<AccordionTrigger>
										<h2>Unstarred Courses</h2>
									</AccordionTrigger>
									<AccordionContent>
										{unstarredCourses?.map((course, index) => (
											<Accordion
												type="multiple"
												value={openedCourses}
												onValueChange={setOpenedCourses}
												key={course.CourseId}
											>
												<AccordionItem
													value={String(course.CourseId)}
													className={cn(
														index === unstarredCourses.length - 1 &&
															"border-b-0",
													)}
												>
													<AccordionTrigger>
														<h3>{course.Title}</h3>
													</AccordionTrigger>
													<AccordionContent>
														<CourseDocuments
															courseTitle={course.Title}
															courseId={course.CourseId}
															isDownloading={isDownloading}
														/>
													</AccordionContent>
												</AccordionItem>
											</Accordion>
										))}
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						</CardContent>
					</Card>
				</div>
			</div>
		</MergeDocumentsContext.Provider>
	);
}

function SortableItem({
	id,
	children,
}: {
	id: number;
	children: React.ReactNode;
}) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id });

	const style = {
		transform: CSSDND.Transform.toString(transform),
		transition,
	};

	return (
		<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
			{children}
		</div>
	);
}

function CourseDocuments({
	courseId,
	courseTitle,
	isDownloading,
}: {
	courseId: number;
	courseTitle?: string;
	isDownloading?: boolean;
}) {
	const { data, isLoading } = useGETcourseAllResources(courseId);
	const { setSelectedDocuments, selectedDocuments } =
		useMergeDocumentsContext();

	if (isLoading || !data) {
		return (
			<div className="flex justify-center text-center flex-col gap-2">
				<Loader className="m-auto" size={"sm"} />
				<span className="text-muted-foreground text-sm text-center">
					Loading documents...
				</span>
			</div>
		);
	}

	if (data.length === 0) {
		return (
			<div className="w-full text-center">
				<span className="text-muted-foreground text-sm text-center">
					No documents found
				</span>
			</div>
		);
	}

	const toggleSelectAll = (checked: boolean) => {
		const courseDocuments = new Map(
			data.map((resource) => [
				resource.ElementId,
				{
					ElementId: resource.ElementId,
					Title: resource.Title,
					CourseId: courseId,
					CourseTitle: courseTitle!,
				},
			]),
		);

		if (checked) {
			setSelectedDocuments(
				new Map([...(selectedDocuments || new Map()), ...courseDocuments]),
			);
		} else {
			const newSelectedDocuments = new Map(selectedDocuments);
			data.forEach((resource) => {
				newSelectedDocuments.delete(resource.ElementId);
			});
			setSelectedDocuments(newSelectedDocuments);
		}
	};

	const allDocumentsForCourseSelected =
		data.every((resource) => selectedDocuments?.has(resource.ElementId)) &&
		data.length > 0;

	const disabled = isDownloading || isLoading;

	return (
		<div className="flex flex-col gap-2">
			<Toggle
				disabled={disabled}
				pressed={allDocumentsForCourseSelected}
				onPressedChange={toggleSelectAll}
				className={cn(
					allDocumentsForCourseSelected
						? "!bg-destructive hover:!bg-destructive/75"
						: "!bg-success-200 hover:!bg-success-100",
					"text-white",
				)}
			>
				{allDocumentsForCourseSelected ? "Deselect all" : "Select all"}
			</Toggle>
			<div className="flex w-1/2 my-2 items-center justify-center mx-auto">
				<div className="w-full bg-purple-500 h-0.5 rounded-full" />
			</div>
			{data.map((resource) => (
				<SelectableDocumentCard
					key={resource.ElementId}
					resource={resource}
					courseId={courseId}
					courseTitle={courseTitle}
					isLoading={disabled}
				/>
			))}
		</div>
	);
}

function SelectableDocumentCard({
	resource,
	courseId,
	courseTitle,
	isLoading,
}: {
	resource: ItslearningRestApiEntitiesPersonalCourseCourseResource;
	courseId: number;
	courseTitle?: string;
	isLoading: boolean;
}) {
	const { addSelectedDocument, removeSelectedDocument, selectedDocuments } =
		useMergeDocumentsContext();
	const navigate = useNavigate();
	const navigateToResource = useNavigateToResource(navigate);

	const handleOnCheckedChange = (
		checked: boolean,
		resource: Omit<SelectedDocument, "CourseTitle">,
	) => {
		const selectedDocument = {
			ElementId: resource.ElementId,
			Title: resource.Title,
			CourseId: courseId,
			CourseTitle: courseTitle!,
		};

		if (checked) {
			addSelectedDocument(selectedDocument);
		} else {
			removeSelectedDocument(selectedDocument);
		}
	};

	const openResource = () => {
		if (isSupportedResourceInApp(resource)) {
			navigateToResource(resource);
		} else {
			window.app.openExternal(resource.ContentUrl);
		}
	};

	const selectedDocumentsArray = Array.from(selectedDocuments?.values() || []);

	const selected = selectedDocumentsArray.some(
		(document) => document.ElementId === resource.ElementId,
	);

	return (
		<Card className="overflow-hidden p-2 bg-secondary border-none">
			<CardDescription className="flex justify-between items-center text-white">
				<button
					disabled={isLoading}
					onClick={openResource}
					className="px-4 text-white truncate w-fit cursor-pointer hover:text-white hover:underline transition-colors duration-200 ease-in-out"
				>
					{resource.Title}
				</button>

				<Toggle
					disabled={isLoading}
					variant={"outline"}
					pressed={selected}
					onPressedChange={(checked) =>
						handleOnCheckedChange(checked, resource)
					}
					className="group data-[state=on]:bg-destructive data-[state=on]:text-destructive-foreground data-[state=off]:bg-success data-[state=off]:hover:bg-success-foreground data-[state=off]:hover:bg-success/50 data-[state=off]:hover:text-white data-[state=off]:text-white data-[state=on]:hover:bg-destructive data-[state=on]:hover:text-destructive-foreground border-none"
				>
					<span className="group-data-[state=on]:visible group-data-[state=on]:hidden ">
						Add
					</span>
					<span className="group-data-[state=off]:visible group-data-[state=off]:hidden ">
						Remove
					</span>
				</Toggle>
			</CardDescription>
		</Card>
	);
}
