import useGETcourseBasic from "@/queries/courses/useGETcourseBasic.ts";
import {useParams} from "react-router-dom";
import {getRelativeTimeString} from "@/lib/utils.ts";

export default function CourseInformation() {
    const params = useParams();
    const courseId = Number(params.id)

    const {data: course} = useGETcourseBasic({
        courseId
    }, {
        suspense: true
    })

    return (
        <div className="px-8 pt-6 pb-8 mb-4 flex flex-col my-2">
            <div className="-mx-3 md:flex mb-6">
                <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                           htmlFor="course-name">
                        Course Name
                    </label>
                    <p className="text-grey-darker text-base">{course?.Title}</p>
                </div>
                <div className="md:w-1/2 px-3">
                    <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                           htmlFor="course-code">
                        Course Code
                    </label>
                    <p className="text-grey-darker text-base">{course?.Code}</p>
                </div>
            </div>
            <div className="-mx-3 md:flex mb-6">
                <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                           htmlFor="course-start-date">
                        Start Date
                    </label>
                    <p className="text-grey-darker text-base">{new Date(course!.CreatedDateTimeUtc).toDateString()}{" "}({getRelativeTimeString(new Date(course!.CreatedDateTimeUtc))})</p>
                </div>
            </div>
            {/*<div className="-mx-3 md:flex mb-6">
                <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" htmlFor="course-teacher">
                        Teacher
                    </label>
                    <p className="text-grey-darker text-base">{course?.teacher}</p>
                </div>
                <div className="md:w-1/2 px-3">
                    <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" htmlFor="course-description">
                        Description
                    </label>
                    <p className="text-grey-darker text-base">{course?.description}</p>
                </div>
            </div>*/}
        </div>
    )
}