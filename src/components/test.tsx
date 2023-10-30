import {createMutationFunction, createQueryFunction} from "@/lib/utils";
import {TanstackKeys} from "@/types/tanstack-keys";
import {GETstarredCourses, GETstarredCoursesParams} from '../types/api-types/course-cards/GETstarredCourses';
import {
    PUTcourseFavorite,
    PUTcourseFavoriteApiUrl,
    PUTcourseFavoriteParams,
} from "@/types/api-types/courses/PUTcourseFavorite.ts";
import {GETunstarredCoursesApiUrl} from "@/types/api-types/course-cards/GETunstarredCourses";

export default function TestSuspense() {

    const useUnstarredCourses = createQueryFunction<GETstarredCoursesParams, GETstarredCourses>(
        GETunstarredCoursesApiUrl,
        TanstackKeys.UnstarredCourses
    );


    const usePUTcourseFavorite = createMutationFunction<PUTcourseFavoriteParams, PUTcourseFavoriteParams, PUTcourseFavorite>(
        "PUT",
        PUTcourseFavoriteApiUrl,
        TanstackKeys.CourseFavorite
    );

    const {mutate} = usePUTcourseFavorite()

    const {data, isLoading} = useUnstarredCourses({})

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <h1>Test Suspense</h1>
            <div>
                {data?.EntityArray.map((course) => (
                    <div key={course.CourseId}>
                        <p>{course.Title}</p>
                        <button onClick={() => {
                            mutate({
                                courseId: course.CourseId,
                            })
                        }}>Favorite
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}