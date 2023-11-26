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
        <div className="my-2 mb-4 flex flex-col px-8 pt-6 pb-8">
            <div className="-mx-3 mb-6 md:flex">
                <div className="mb-6 px-3 md:mb-0 md:w-1/2">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-grey-darker"
                           htmlFor="course-name">
                        Course Name
                    </label>
                    <p className="text-base text-grey-darker">{course?.Title}</p>
                </div>
                <div className="px-3 md:w-1/2">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-grey-darker"
                           htmlFor="course-code">
                        Course Code
                    </label>
                    <p className="text-base text-grey-darker">{course?.Code}</p>
                </div>
            </div>
            <div className="-mx-3 mb-6 md:flex">
                <div className="mb-6 px-3 md:mb-0 md:w-1/2">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-grey-darker"
                           htmlFor="course-start-date">
                        Start Date
                    </label>
                    <p className="text-base text-grey-darker">{new Date(course!.CreatedDateTimeUtc).toDateString()}{" "}({getRelativeTimeString(new Date(course!.CreatedDateTimeUtc))})</p>
                </div>
            </div>
            {/*<div className="-mx-3 mb-6 md:flex">
                <div className="mb-6 px-3 md:mb-0 md:w-1/2">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-grey-darker" htmlFor="course-teacher">
                        Teacher
                    </label>
                    <p className="text-base text-grey-darker">{course?.teacher}</p>
                </div>
                <div className="px-3 md:w-1/2">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-grey-darker" htmlFor="course-description">
                        Description
                    </label>
                    <p className="text-base text-grey-darker">{course?.description}</p>
                </div>
            </div>*/}
        </div>
    )
}