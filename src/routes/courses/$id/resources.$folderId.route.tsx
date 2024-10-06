import { createFileRoute } from '@tanstack/react-router'
import ResourcesDataTable from "@/components/resources/resources-table.tsx";
import useGETcourseFolderResources from "@/queries/courses/useGETcourseFolderResources";


export const Route = createFileRoute('/courses/$id/resources/$folderId')({
  component: CourseResources,
})

function CourseResources() {
    const {folderId: folderIdParam,id} = Route.useParams();
    const courseId = Number(id)
    const folderId = Number(folderIdParam)

    const {data, isLoading} = useGETcourseFolderResources({
        courseId,
        folderId
    })

    return (
        <div className={"p-4 flex-1 flex"}>
            <ResourcesDataTable data={data?.Resources.EntityArray} isLoading={isLoading}/>
        </div>
    )
}
