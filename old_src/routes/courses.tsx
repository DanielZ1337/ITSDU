import useGETcoursesv3 from "@/queries/courses/useGETcoursesv3.ts";
import {Link} from "react-router-dom";

export default function CoursesIndex() {
    const {data: courses} = useGETcoursesv3({}, {
        suspense: true,
    });

    return (
        <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 md:grid-cols-3">
            {courses!.EntityArray.map((course) => (
                <div key={course.CourseId}
                     className="flex flex-col justify-between overflow-hidden shadow bg-foreground/10 sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <Link to={`/courses/${course.CourseId}`}>
                            <h3 className="text-lg font-medium leading-6">{course.Title}</h3>
                        </Link>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">{course.CourseCode}</p>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Teachers</dt>
                                <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                                    {course.TeachersInCourse.map((teacher, idx) => (
                                        <div key={teacher.PersonId} className="flex flex-col">
                                            <a href={teacher.ProfileUrl}
                                               className="text-indigo-600 hover:text-indigo-900">{teacher.FullName}</a>
                                            {/* @ts-ignore */}
                                            <p className="text-sm text-gray-500">{teacher.AdditionalInfo}</p>
                                            {idx !== course.TeachersInCourse.length - 1 && <div
                                                className={"shrink-0 grow-0 my-4 h-[1px] w-full rounded-full bg-foreground/50"}/>}
                                        </div>
                                    ))}
                                </dd>
                            </div>
                            <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                                <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">{new Date(course.LastUpdatedUtc).toTimeString()}</dd>
                            </div>
                            <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">New Notifications</dt>
                                <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">{course.NewNotificationsCount}</dd>
                            </div>
                            <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">New Bulletins</dt>
                                <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">{course.NewBulletinsCount}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            ))}
        </div>
    )
}