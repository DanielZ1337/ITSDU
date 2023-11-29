import { TasksCardSkeleton } from "../tasks-card-skeleton";

export default function TasksCardSkeletons({ count }: { count?: number }) {
    return Array(count || 10).fill(0).map((_, i) => (
        <TasksCardSkeleton key={i} />
    ));
}