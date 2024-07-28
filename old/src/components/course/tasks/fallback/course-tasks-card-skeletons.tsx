import {CourseTasksCardSkeleton} from "./course-tasks-card-skeleton";

export default function CourseTasksCardSkeletons({count}: { count?: number }) {
    return Array(count || 10).fill(0).map((_, i) => (
        <CourseTasksCardSkeleton key={i}/>
    ));
}