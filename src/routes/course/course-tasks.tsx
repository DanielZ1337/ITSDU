import useGETcourseTasklistDailyWorkflow from "@/queries/courses/useGETcourseTasklistDailyWorkflow.ts";
import {useParams} from "react-router-dom";

export default function CourseTasks() {
    const params = useParams()
    const courseId = Number(params.id)
    const {data} = useGETcourseTasklistDailyWorkflow({
        courseId,
        PageIndex: 0,
        PageSize: 100,
    }, {
        suspense: true,
    })

    return (
        <div className={"p-4 flex-1 flex"}>
            <div className={"flex-1"}>
                <h1 className={"text-2xl font-bold"}>Tasks</h1>
                <div className={"mt-4"}>
                    <div className={"flex flex-col gap-4"}>
                        {data!.EntityArray.length !== 0 ? (
                            data!.EntityArray.map((task) => (
                                task.TaskDailyWorkflow.EntityArray.map((workflow) => {
                                    if (workflow.CourseId !== courseId) {
                                        return null
                                    }

                                    return (
                                        <div key={workflow.TaskId} className={"flex flex-col gap-2"}>
                                            <h2 className={"text-xl font-bold"}>{workflow.CourseTitle}</h2>
                                            <p>{workflow.TaskTitle}</p>
                                        </div>
                                    )
                                })
                            ))
                        ) : (
                            <div className={"text-center"}>
                                <h2 className={"text-lg font-bold"}>No tasks found</h2>
                                <p className={"text-gray-600"}>Try searching for something else</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}