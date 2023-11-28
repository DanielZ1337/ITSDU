import useGETcourseLastThreeUpdatedResources from '@/queries/courses/useGETcourseLastThreeUpdatedResources'
import React from 'react'
import { useParams } from 'react-router-dom'

export default function Overview() {
    const { courseId } = useParams()
    const { data } = useGETcourseLastThreeUpdatedResources({
        courseId: Number(courseId),
        elementType: 0,
    }, {
        suspense: true
    })

    console.log(data)

    return (
        <div>Overview</div>
    )
}
