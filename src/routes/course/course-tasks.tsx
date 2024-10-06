import { CourseTaskTabButton } from "@/components/course/tasks/course-task-tab-button";
import { CourseTasksActive } from "@/components/course/tasks/course-tasks-active";
import { CourseTasksCompleted } from "@/components/course/tasks/course-tasks-completed";
import { useCycle } from "framer-motion";
import { useParams } from "react-router-dom";

const TASKS_PAGE_SIZE = 100;

export default function CourseTasks() {
	const { id } = useParams();
	const courseId = Number(id);

	const [activeTab, cycleTab] = useCycle("active", "completed");

	const handleTabClick = () => {
		cycleTab();
	};

	return (
		<div
			className="h-full overflow-y-auto overflow-x-hidden p-4"
			style={{
				scrollbarGutter: "stable both-edges",
			}}
		>
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Tasks</h1>
				<div className="flex items-center gap-4">
					<CourseTaskTabButton
						active={activeTab === "active"}
						onClick={handleTabClick}
					>
						Active
					</CourseTaskTabButton>
					<CourseTaskTabButton
						active={activeTab === "completed"}
						onClick={handleTabClick}
					>
						Completed
					</CourseTaskTabButton>
				</div>
			</div>
			<div className="mt-4">
				{activeTab === "active" ? (
					<CourseTasksActive PageSize={TASKS_PAGE_SIZE} courseId={courseId} />
				) : (
					<CourseTasksCompleted
						PageSize={TASKS_PAGE_SIZE}
						courseId={courseId}
					/>
				)}
			</div>
		</div>
	);
}
