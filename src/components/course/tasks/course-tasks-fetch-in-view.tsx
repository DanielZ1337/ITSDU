import { FetchMoreInview } from "@/components/fetch-more-in-view";
import { AnimatePresence } from "framer-motion";
import { CourseTaskEmpty } from "./course-task-empty";
import { CourseTaskError } from "./course-task-error";

export function CourseTasksFetchInView({
	length,
	children,
	isError,
	error,
	hasNextPage,
	fetchNextPage,
	isFetchingNextPage,
}: {
	length?: number;
	children: any;
	isError?: boolean;
	error?: any;
	hasNextPage?: boolean;
	fetchNextPage?: () => void;
	isFetchingNextPage?: boolean;
}) {
	if (isError) {
		return <CourseTaskError message={error?.message} />;
	}

	if (length !== undefined && length < 1) {
		return <CourseTaskEmpty />;
	}

	return (
		<AnimatePresence mode="wait">
			{children}
			{hasNextPage && fetchNextPage && (
				<FetchMoreInview
					hasNextPage={hasNextPage}
					fetchNextPage={fetchNextPage}
					isFetchingNextPage={isFetchingNextPage}
					className="py-4 text-center text-sm text-gray-600"
				>
					{isFetchingNextPage
						? "Loading more..."
						: hasNextPage
							? "Load more"
							: ""}
				</FetchMoreInview>
			)}
		</AnimatePresence>
	);
}
