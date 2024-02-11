import SuspenseWrapper from '@/components/suspense-wrapper'
import useGETcourseCardSettings from '@/queries/course-cards/useGETcourseCardSettings'
import useGETcourses from '@/queries/course-cards/useGETcourses'
import useGETcourseRootResources from '@/queries/courses/useGETcourseRootResources'
import useGETcoursesv3 from '@/queries/courses/useGETcoursesv3'
import React from 'react'

export default function MergeDocuments() {
    const { data, isLoading } = useGETcoursesv3({

    })

    const { data: data2, isLoading: isLoading2 } = useGETcourses("All", {})

    if (isLoading || isLoading2) {
        return (
            <div>Loading...</div>
        )
    }

    //combine data and data2 based on the course id
    const combinedData = data?.EntityArray.map((course) => {
        const course2 = data2?.EntityArray.find((course2) => course2.CourseId === course.CourseId)

        return {
            ...course,
            ...course2
        }
    })

    const favoriteCourses = combinedData?.filter((course) => course.IsFavouriteCourse)
    const unfavoriteCourses = combinedData?.filter((course) => !course.IsFavouriteCourse)

    return (
        <div>
            <div>
                <h1>Favorite courses</h1>
                {favoriteCourses?.map((course) => (
                    <div key={course.CourseId}>{course.Title} {course.CourseId}</div>
                ))}
            </div>
            <div>
                <h1>Unfavorite courses</h1>
                {unfavoriteCourses?.map((course) => (
                    <div key={course.CourseId}>{course.Title}</div>
                ))}
            </div>
        </div>
    )
}
