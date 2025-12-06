import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, getFormattedSize } from "@/lib/utils";
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
import {
	BookOpen,
	Check,
	ChevronRight,
	Download,
	FileText,
	FolderOpen,
	GripVertical,
	Loader2,
	Merge,
	Plus,
	Star,
	Trash2,
	X,
} from "lucide-react";
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
	setSelectedDocuments: () => { },
	addSelectedDocument: () => { },
	removeSelectedDocument: () => { },
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

// Skeleton loader for the page
function PageSkeleton() {
	return (
		<div className="flex h-full w-full gap-6 p-6">
			{/* Left panel skeleton */}
			<div className="flex w-80 flex-shrink-0 flex-col rounded-xl border border-border/50 bg-card/50 p-4">
				<Skeleton className="mb-4 h-8 w-48" />
				<Skeleton className="mb-6 h-4 w-full" />
				<div className="flex gap-2 mb-6">
					<Skeleton className="h-9 flex-1" />
					<Skeleton className="h-9 flex-1" />
				</div>
				<div className="space-y-3">
					{[...Array(4)].map((_, i) => (
						<Skeleton key={i} className="h-16 w-full rounded-lg" />
					))}
				</div>
			</div>
			{/* Right panel skeleton */}
			<div className="flex flex-1 flex-col rounded-xl border border-border/50 bg-card/50 p-4">
				<Skeleton className="mb-6 h-8 w-64" />
				<div className="space-y-4">
					{[...Array(3)].map((_, i) => (
						<div key={i} className="space-y-2">
							<Skeleton className="h-12 w-full rounded-lg" />
							<div className="ml-4 space-y-2">
								{[...Array(2)].map((_, j) => (
									<Skeleton key={j} className="h-10 w-full rounded-lg" />
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

// Empty state component
function EmptySelection() {
	return (
		<div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
			<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 mb-4">
				<FileText className="h-8 w-8 text-muted-foreground" />
			</div>
			<h3 className="text-lg font-medium text-foreground mb-1">
				No documents selected
			</h3>
			<p className="text-sm text-muted-foreground max-w-xs">
				Browse courses and select documents to merge or download as ZIP
			</p>
		</div>
	);
}

export default function MergeZIPDocuments() {
	const [selectedDocuments, setSelectedDocuments] = useState<Map<
		number,
		SelectedDocument
	> | null>(null);
	const [openedStarredUnstarred, setOpenedStarredUnstarred] = useState<string[]>(["starred"]);
	const [openedCourses, setOpenedCourses] = useState<string[]>([]);
	const [isDownloading, setIsDownloading] = useState(false);
	const [isMerging, setIsMerging] = useState(false);
	const [organizeByCourse, setOrganizeByCourse] = useState(true);

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
		return <PageSkeleton />;
	}

	const combinedData = data?.EntityArray.map((course) => {
		const course2 = data2?.EntityArray.find(
			(course2) => course2.CourseId === course.CourseId,
		);
		return { ...course, ...course2 };
	});

	const starredCourses = combinedData?.filter((course) => course.IsFavouriteCourse);
	const unstarredCourses = combinedData?.filter((course) => !course.IsFavouriteCourse);

	const downloadAsZip = () => {
		const selectedDocumentsArray = Array.from(selectedDocuments?.values() || []);
		if (selectedDocumentsArray.length === 0) return;

		setIsDownloading(true);
		const allElementIds = selectedDocumentsArray.map((document) => document.ElementId);

		window.app
			.zipDownloadAllCourseResources(allElementIds, { organizeByCourse })
			.then((zipRes) => {
				if (zipRes.canceled) return;
				const { path, size } = zipRes;
				toast.success(`Downloaded successfully`, {
					description: `${path} (${getFormattedSize(size)})`,
					action: {
						label: "Open",
						onClick: () => void window.app.openItem(path),
					},
				});
				setSelectedDocuments(null);
			})
			.catch((error) => {
				toast.error(`Download failed: ${error.message}`);
			})
			.finally(() => {
				setIsDownloading(false);
			});
	};

	const handleMergePDF = () => {
		if (isMerging) return;
		setIsMerging(true);

		const selectedDocumentsArray = Array.from(selectedDocuments?.values() || []);
		if (selectedDocumentsArray.length === 0 || !selectedDocuments) return;

		const allElementIds = selectedDocumentsArray.map((document) => String(document.ElementId));

		window.app
			.mergePDFs(allElementIds)
			.then((path) => {
				if (!path) return;
				toast.success(`PDFs merged successfully`, {
					description: path,
					action: {
						label: "Open",
						onClick: () => void window.app.openItem(path),
					},
				});
				setSelectedDocuments(null);
			})
			.catch((error) => {
				toast.error(`Merge failed: ${error.message}`);
				console.error(error);
			})
			.finally(() => {
				setIsMerging(false);
			});
	};

	const selectedCount = selectedDocuments?.size || 0;
	const isButtonDisabled = selectedCount === 0 || isDownloading || isMerging;

	return (
		<MergeDocumentsContext.Provider value={contextValue}>
			<div className="flex h-full w-full gap-6 p-6 overflow-hidden">
				{/* Left Panel - Selected Documents */}
				<div className="flex w-96 flex-shrink-0 flex-col rounded-xl border border-border/50 bg-card/50 overflow-hidden">
					{/* Header */}
					<div className="flex-shrink-0 border-b border-border/50 bg-muted/30 px-5 py-4">
						<div className="flex items-center justify-between mb-1">
							<h2 className="text-lg font-semibold text-foreground">Selected Documents</h2>
							{selectedCount > 0 && (
								<span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-2 text-xs font-medium text-primary-foreground">
									{selectedCount}
								</span>
							)}
						</div>
						<p className="text-sm text-muted-foreground">
							Drag to reorder • Select from courses
						</p>
					</div>

					{/* Action Buttons */}
					{selectedCount > 0 && (
						<div className="flex-shrink-0 border-b border-border/50 p-3 space-y-2">
							<div className="flex gap-2">
								<Button
									variant="default"
									size="sm"
									className="flex-1 gap-2"
									disabled={isButtonDisabled}
									onClick={handleMergePDF}
								>
									{isMerging ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : (
										<Merge className="h-4 w-4" />
									)}
									Merge PDFs
								</Button>
								<Button
									variant="secondary"
									size="sm"
									className="flex-1 gap-2"
									disabled={isButtonDisabled}
									onClick={downloadAsZip}
								>
									{isDownloading ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : (
										<Download className="h-4 w-4" />
									)}
									ZIP
								</Button>
							</div>
							<div className="flex gap-2">
								<Button
									variant="ghost"
									size="sm"
									className={cn(
										"flex-1 text-xs",
										organizeByCourse && "bg-muted"
									)}
									onClick={() => setOrganizeByCourse(true)}
								>
									<FolderOpen className="h-3.5 w-3.5 mr-1.5" />
									By Course
								</Button>
								<Button
									variant="ghost"
									size="sm"
									className={cn(
										"flex-1 text-xs",
										!organizeByCourse && "bg-muted"
									)}
									onClick={() => setOrganizeByCourse(false)}
								>
									<FileText className="h-3.5 w-3.5 mr-1.5" />
									Flat
								</Button>
								<Button
									variant="ghost"
									size="sm"
									className="text-destructive hover:text-destructive hover:bg-destructive/10"
									onClick={() => setSelectedDocuments(null)}
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>
						</div>
					)}

					{/* Document List */}
					<div className="flex-1 overflow-y-auto p-3">
						<DndContext
							sensors={sensors}
							collisionDetection={closestCenter}
							onDragEnd={handleDragEnd}
						>
							<SortableContext
								items={Array.from(selectedDocuments?.keys() || [])}
								strategy={verticalListSortingStrategy}
							>
								{selectedCount > 0 ? (
									<div className="space-y-2">
										{Array.from(selectedDocuments!.values()).map((document, index) => (
											<SortableDocumentItem
												key={document.ElementId}
												id={document.ElementId}
												document={document}
												index={index}
												onRemove={() => removeSelectedDocument(document)}
											/>
										))}
									</div>
								) : (
									<EmptySelection />
								)}
							</SortableContext>
						</DndContext>
					</div>
				</div>

				{/* Right Panel - Course Browser */}
				<div className="flex flex-1 flex-col rounded-xl border border-border/50 bg-card/50 overflow-hidden min-w-0">
					{/* Header */}
					<div className="flex-shrink-0 border-b border-border/50 bg-muted/30 px-5 py-4">
						<h2 className="text-lg font-semibold text-foreground">Browse Courses</h2>
						<p className="text-sm text-muted-foreground">
							Select documents from your courses
						</p>
					</div>

					{/* Course List */}
					<div className="flex-1 overflow-y-auto p-4">
						<Accordion
							type="multiple"
							value={openedStarredUnstarred}
							onValueChange={setOpenedStarredUnstarred}
							className="space-y-3"
						>
							{/* Starred Courses */}
							<AccordionItem
								value="starred"
								className="rounded-lg border border-border/50 bg-card/30 overflow-hidden"
							>
								<AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/30 [&>svg]:hidden [&[data-state=open]_.chevron-icon]:rotate-90">
									<div className="flex items-center gap-3 w-full">
										<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-500/10">
											<Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
										</div>
										<span className="font-medium">Starred Courses</span>
										<span className="text-sm text-muted-foreground">
											({starredCourses?.length || 0})
										</span>
										<ChevronRight className="chevron-icon h-4 w-4 text-muted-foreground transition-transform duration-200 ml-auto" />
									</div>
								</AccordionTrigger>
								<AccordionContent className="px-2 pb-2">
									<div className="space-y-1">
										{starredCourses?.map((course) => (
											<CourseAccordionItem
												key={course.CourseId}
												course={course}
												openedCourses={openedCourses}
												setOpenedCourses={setOpenedCourses}
												isDownloading={isDownloading}
											/>
										))}
									</div>
								</AccordionContent>
							</AccordionItem>

							{/* Unstarred Courses */}
							<AccordionItem
								value="unstarred"
								className="rounded-lg border border-border/50 bg-card/30 overflow-hidden"
							>
								<AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/30 [&>svg]:hidden">
									<div className="flex items-center gap-3 w-full">
										<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/50">
											<BookOpen className="h-4 w-4 text-muted-foreground" />
										</div>
										<span className="font-medium">Other Courses</span>
										<span className="text-sm text-muted-foreground">
											({unstarredCourses?.length || 0})
										</span>
									</div>
								</AccordionTrigger>
								<AccordionContent className="px-2 pb-2">
									<div className="space-y-1">
										{unstarredCourses?.map((course) => (
											<CourseAccordionItem
												key={course.CourseId}
												course={course}
												openedCourses={openedCourses}
												setOpenedCourses={setOpenedCourses}
												isDownloading={isDownloading}
											/>
										))}
									</div>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</div>
				</div>
			</div>
		</MergeDocumentsContext.Provider>
	);
}

function SortableDocumentItem({
	id,
	document,
	index,
	onRemove,
}: {
	id: number;
	document: SelectedDocument;
	index: number;
	onRemove: () => void;
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id });

	const style = {
		transform: CSSDND.Transform.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={cn(
				"group flex items-center gap-2 rounded-lg border border-border/50 bg-card p-3 transition-all",
				isDragging && "opacity-50 shadow-lg ring-2 ring-primary/20"
			)}
		>
			<button
				{...attributes}
				{...listeners}
				className="flex-shrink-0 cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
			>
				<GripVertical className="h-4 w-4" />
			</button>
			<span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-medium text-primary">
				{index + 1}
			</span>
			<div className="flex-1 min-w-0">
				<p className="text-sm font-medium text-foreground truncate">
					{document.Title}
				</p>
				<p className="text-xs text-muted-foreground truncate">
					{document.CourseTitle}
				</p>
			</div>
			<button
				onClick={onRemove}
				className="flex-shrink-0 rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
			>
				<X className="h-4 w-4" />
			</button>
		</div>
	);
}

function CourseAccordionItem({
	course,
	openedCourses,
	setOpenedCourses,
	isDownloading,
}: {
	course: { CourseId: number; Title: string };
	openedCourses: string[];
	setOpenedCourses: (courses: string[]) => void;
	isDownloading: boolean;
}) {
	const isOpen = openedCourses.includes(String(course.CourseId));

	return (
		<Accordion
			type="multiple"
			value={openedCourses}
			onValueChange={setOpenedCourses}
		>
			<AccordionItem
				value={String(course.CourseId)}
				className="border-0"
			>
				<AccordionTrigger className="rounded-md px-3 py-2 hover:no-underline hover:bg-muted/50 [&>svg]:hidden [&[data-state=open]_.chevron-icon]:rotate-90">
					<div className="flex items-center gap-2 flex-1 min-w-0">
						<FolderOpen className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
						<span className="text-sm truncate">{course.Title}</span>
					</div>
					<ChevronRight className="chevron-icon h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform duration-200" />
				</AccordionTrigger>
				<AccordionContent className="pl-4 pt-1 pb-2">
					{isOpen && (
						<CourseDocuments
							courseId={course.CourseId}
							courseTitle={course.Title}
							isDownloading={isDownloading}
						/>
					)}
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}

function CourseDocumentsSkeleton() {
	return (
		<div className="space-y-2 py-2">
			{[...Array(3)].map((_, i) => (
				<div key={i} className="flex items-center gap-3 px-2">
					<Skeleton className="h-4 w-4 rounded" />
					<Skeleton className="h-4 flex-1" />
					<Skeleton className="h-7 w-16 rounded-md" />
				</div>
			))}
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
	const { setSelectedDocuments, selectedDocuments } = useMergeDocumentsContext();

	if (isLoading || !data) {
		return <CourseDocumentsSkeleton />;
	}

	if (data.length === 0) {
		return (
			<div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
				No documents found
			</div>
		);
	}

	const toggleSelectAll = (shouldSelect: boolean) => {
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

		if (shouldSelect) {
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

	const allSelected =
		data.every((resource) => selectedDocuments?.has(resource.ElementId)) &&
		data.length > 0;
	const someSelected =
		data.some((resource) => selectedDocuments?.has(resource.ElementId)) &&
		!allSelected;

	const disabled = isDownloading || isLoading;

	return (
		<div className="space-y-2">
			{/* Select All Button */}
			<Button
				variant="ghost"
				size="sm"
				disabled={disabled}
				onClick={() => toggleSelectAll(!allSelected)}
				className={cn(
					"w-full justify-start gap-2 text-sm",
					allSelected && "text-primary"
				)}
			>
				<div
					className={cn(
						"flex h-4 w-4 items-center justify-center rounded border transition-colors",
						allSelected
							? "border-primary bg-primary text-primary-foreground"
							: someSelected
								? "border-primary bg-primary/20"
								: "border-muted-foreground/30"
					)}
				>
					{allSelected && <Check className="h-3 w-3" />}
					{someSelected && <div className="h-1.5 w-1.5 rounded-sm bg-primary" />}
				</div>
				{allSelected ? "Deselect all" : "Select all"} ({data.length})
			</Button>

			{/* Document List */}
			<div className="space-y-1">
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

	const selected = selectedDocuments?.has(resource.ElementId) || false;

	const handleToggle = () => {
		const selectedDocument = {
			ElementId: resource.ElementId,
			Title: resource.Title,
			CourseId: courseId,
			CourseTitle: courseTitle!,
		};

		if (selected) {
			removeSelectedDocument(selectedDocument);
		} else {
			addSelectedDocument(selectedDocument);
		}
	};

	const openResource = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (isSupportedResourceInApp(resource)) {
			navigateToResource(resource);
		} else {
			window.app.openExternal(resource.ContentUrl);
		}
	};

	return (
		<div
			className={cn(
				"group flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors cursor-pointer",
				selected ? "bg-primary/10" : "hover:bg-muted/50"
			)}
			onClick={handleToggle}
		>
			<button
				disabled={isLoading}
				onClick={handleToggle}
				className={cn(
					"flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-colors",
					selected
						? "border-primary bg-primary text-primary-foreground"
						: "border-muted-foreground/30 group-hover:border-muted-foreground/50"
				)}
			>
				{selected && <Check className="h-3 w-3" />}
			</button>
			<FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
			<span
				className="flex-1 text-sm truncate cursor-pointer hover:text-primary hover:underline"
				onClick={openResource}
			>
				{resource.Title}
			</span>
			<Button
				variant="ghost"
				size="sm"
				className={cn(
					"h-7 px-2 text-xs opacity-0 transition-opacity group-hover:opacity-100",
					selected
						? "text-destructive hover:text-destructive hover:bg-destructive/10"
						: "text-primary hover:text-primary hover:bg-primary/10"
				)}
				onClick={(e) => {
					e.stopPropagation();
					handleToggle();
				}}
			>
				{selected ? (
					<>
						<X className="h-3 w-3 mr-1" />
						Remove
					</>
				) : (
					<>
						<Plus className="h-3 w-3 mr-1" />
						Add
					</>
				)}
			</Button>
		</div>
	);
}
