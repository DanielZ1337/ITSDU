import {ResourcesDataTable} from "@/components/resources/resources-table.tsx";
import useGETcourseFolderResources from "@/queries/courses/useGETcourseFolderResources";
import {useParams} from "react-router-dom";

export default function CourseResources() {
    const params = useParams();
    const courseId = Number(params.id)
    const folderId = Number(params.folderId)

    const {data, isLoading} = useGETcourseFolderResources({
        courseId,
        folderId
    })

    console.log(data)

    return (
        <div className={"p-4 flex-1 flex"}>
            <ResourcesDataTable data={data?.Resources.EntityArray} isLoading={isLoading}/>
        </div>
    )
}