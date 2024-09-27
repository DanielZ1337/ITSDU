import {CoursePlansCardSkeleton} from "./course-plans-card-skeleton";

export default function CoursePlansCardSkeletons({count}: { count?: number }) {
    return Array(count || 10).fill(0).map((_, i) => (
        <CoursePlansCardSkeleton key={i}/>
    ));
}