import { CourseTaskTabButton } from "@/components/course/tasks/course-task-tab-button";
import { CourseTasksActive } from "@/components/course/tasks/course-tasks-active";
import { CourseTasksCompleted } from "@/components/course/tasks/course-tasks-completed";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import useGETcourseTasks from "@/queries/courses/useGETcourseAllTasks";
import { useNavigateToResource } from "@/types/api-types/extra/learning-tool-id-types";
import { ItslearningRestApiEntitiesTaskStatus } from "@/types/api-types/utils/Itslearning.RestApi.Entities.TaskStatus";
import { format, formatDistanceToNow, isPast } from "date-fns";
import { useCycle } from "framer-motion";
import { AlertCircle, Calendar, Clock, ExternalLink } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const TASKS_PAGE_SIZE = 100;

const statusTitles = {
	Completed: "Completed",
	InProgress: "In Progress",
	NotStarted: "To Do",
	Unknown: "Unknown",
} satisfies Record<keyof typeof ItslearningRestApiEntitiesTaskStatus, string>;

export default function TaskManager() {
	const { data: tasks, isLoading } = useGETcourseTasks({
		PageSize: TASKS_PAGE_SIZE,
	});

	const [filter, setFilter] = useState<string>("active");

	const flatMapped = useMemo(
		() => tasks?.pages.flatMap((page) => page.EntityArray),
		[tasks],
	);

	const filteredTasks = useMemo(() => {
		return flatMapped?.filter((task) => {
			if (filter === "active") {
				return (
					task.Status !== "Completed" &&
					(!task.Deadline || !isPast(new Date(task.Deadline)))
				);
			} else if (filter === "overdue") {
				return (
					task.Deadline &&
					isPast(new Date(task.Deadline)) &&
					task.Status !== "Completed"
				);
			} else if (filter === "completed") {
				return task.Status === "Completed";
			} else if (filter === "todo") {
				return task.Status === "NotStarted";
			} else if (filter === "inprogress") {
				return task.Status === "InProgress";
			}
			return true;
		});
	}, [filter, flatMapped]);

	const getStatusInfo = (
		status: keyof typeof ItslearningRestApiEntitiesTaskStatus,
		isOverdue: boolean,
	) => {
		if (isOverdue)
			return {
				color: "bg-destructive text-destructive-foreground",
				text: `Overdue - ${statusTitles[status]}`,
			};
		switch (status) {
			case "Completed":
				return { color: "bg-green-500 text-white", text: statusTitles[status] };
			case "InProgress":
				return {
					color: "bg-yellow-500 text-black",
					text: statusTitles[status],
				};
			case "NotStarted":
				return { color: "bg-blue-500 text-white", text: statusTitles[status] };
			default:
				return { color: "bg-gray-500 text-white", text: "Unknown" };
		}
	};

	const navigate = useNavigate();

	const handleTaskClick = (url: string) => {
		const urlParsed = new URL(url, "https://sdu.itslearning.com");
		// console.log(urlParsed.toString());
		// navigateToResource(urlParsed.toString());
		navigate({
			pathname: "/sso",
			search: `?url=${urlParsed.toString()}`,
		});
	};

	return (
		<ScrollArea className="w-full mx-auto h-full overflow-y-auto overflow-x-hidden">
			<header className="flex sticky top-0 justify-between items-center gap-4 border-b bg-zinc-100/40 px-6 py-5 shadow backdrop-blur-md dark:bg-zinc-800/40">
				<h1 className="text-2xl font-bold">Tasks</h1>
				<Select onValueChange={setFilter} defaultValue={filter}>
					<SelectTrigger className="w-[180px] bg-background">
						<SelectValue placeholder="Filter tasks" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="active">Active</SelectItem>
						<SelectItem value="overdue">Overdue</SelectItem>
						<SelectItem value="todo">To Do</SelectItem>
						<SelectItem value="inprogress">In Progress</SelectItem>
						{/* <SelectItem value="completed">Completed</SelectItem> */}
						<SelectItem value="all">All Tasks</SelectItem>
					</SelectContent>
				</Select>
			</header>
			<div
				className="container grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-4"
				style={{
					scrollbarGutter: "stable both-edges",
				}}
			>
				{isLoading &&
					Array(6)
						.fill(0)
						.map((_, index) => <TaskSkeleton key={index} />)}
				{filteredTasks?.map((task) => {
					const isOverdue = task.Deadline && isPast(new Date(task.Deadline));
					const statusInfo = getStatusInfo(task.Status, Boolean(isOverdue));
					return (
						<Card
							key={task.TaskId}
							className={cn(
								isOverdue && "border-destructive",
								"h-full flex flex-col bg-foreground/10",
							)}
						>
							<CardHeader>
								<CardTitle className="text-lg">{task.Title}</CardTitle>
								<Badge className={statusInfo.color}>{statusInfo.text}</Badge>
							</CardHeader>
							<CardContent className="h-full flex flex-col justify-between">
								<div className="h-full flex flex-col">
									<Link
										to={`/courses/${task.LocationId}`}
										className="text-sm text-muted-foreground mb-2 hover:underline"
									>
										{task.LocationTitle}
									</Link>
									{task.Deadline && (
										<div className="flex items-center text-sm">
											<Calendar className="w-4 h-4 mr-2" />
											<span>{format(new Date(task.Deadline), "PPP")}</span>
										</div>
									)}
									{isOverdue && (
										<div className="flex items-center text-sm mt-2">
											<AlertCircle className="w-4 h-4 mr-2" />
											<span>
												{/* calculate the time difference between now and the deadline using date-fns*/}
												{formatDistanceToNow(new Date(task.Deadline), {
													addSuffix: true,
												})}
											</span>
										</div>
									)}
									<div className="flex items-center text-sm mt-2">
										<Clock className="w-4 h-4 mr-2" />
										<span>
											{task.Deadline
												? format(new Date(task.Deadline), "p")
												: "No deadline"}
										</span>
									</div>
								</div>
								<Button
									className="w-full mt-4"
									variant={isOverdue ? "destructive" : "default"}
									onClick={() => handleTaskClick(task.ContentUrl)}
								>
									View Details
									<ExternalLink className="w-4 h-4 ml-2" />
								</Button>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</ScrollArea>
	);
}

function TaskSkeleton() {
	return (
		<Card className="h-full flex flex-col bg-foreground/10">
			<CardHeader>
				<Skeleton className="bg-primary/50 rounded-md h-6 w-3/4" />
				<Skeleton className="bg-primary/50 rounded-md h-4 w-1/4" />
			</CardHeader>
			<CardContent>
				<Skeleton className="bg-primary/50 rounded-md h-4 w-full mb-2" />
				<Skeleton className="bg-primary/50 rounded-md h-4 w-3/4 mb-2" />
				<Skeleton className="bg-primary/50 rounded-md h-4 w-1/2 mb-4" />
				<Skeleton className="bg-primary/50 rounded-md h-10 w-full" />
			</CardContent>
		</Card>
	);
}
