import {ResourcesDataTable} from "@/components/resources/resources-table.tsx";
import useGETcourseRootResources from "@/queries/courses/useGETcourseRootResources";
import {useParams} from "react-router-dom";

export default function CourseRootResources() {
    const params = useParams();
    const courseId = Number(params.id)

    const {data, isLoading} = useGETcourseRootResources({
        courseId: courseId
    })

    return (
        <div className={"p-4 flex-1 flex"}>
            <ResourcesDataTable data={data?.Resources.EntityArray} isLoading={isLoading} root/>
        </div>
    )
}