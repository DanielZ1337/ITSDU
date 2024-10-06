import { useCourse } from "@/hooks/atoms/useCourse";
import { Outlet } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/courses/$id")({
  component: () => {
    const { setCourseId } = useCourse();
    setCourseId(Number(Route.useParams().id));

    return <Outlet />;
  },
});
