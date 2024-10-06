import ResourcesDataTable from "@/components/resources/resources-table.tsx";
import useGETcourseRootResources from "@/queries/courses/useGETcourseRootResources";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/courses/$id/resources")({
  component: CourseRootResources,
});

function CourseRootResources() {
  const { id } = Route.useParams();
  const courseId = Number(id);

  const { data, isLoading } = useGETcourseRootResources({
    courseId: courseId,
  });

  return (
    <div className={"p-4 flex-1 flex"}>
      <ResourcesDataTable data={data?.Resources.EntityArray} isLoading={isLoading} root />
    </div>
  );
}
