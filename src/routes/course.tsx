/*eslint-disable no-unused-vars*/

import {Suspense} from "react";
import {useSearchParams} from "react-router-dom";
import LightbulletinsForCourse from "@/components/lightbulletin/lightbulletins-for-course.tsx";
import useGETcourseBasic from "@/queries/courses/useGETcourseBasic.ts";
import {Helmet} from "react-helmet";
import Splitter, {SplitDirection} from '@devbookhq/splitter'
import '../styles/splitter-custom.css'
import LightbulletinsForCourseLoader from "@/components/lightbulletin/lightbulletins-for-course-loader.tsx";
import Resources from "@/components/resources/resources.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {ErrorBoundary} from "react-error-boundary";
import {Button} from "@/components/ui/button.tsx";

export default function Course() {
    let [searchParams] = useSearchParams();
    const courseId = Number(searchParams.get('id'))
    const {data} = useGETcourseBasic({
        courseId: courseId
    }, {
        suspense: true,
    })
    // const navigation = useNavigation();
    // const state = navigation.state;

    /*const {data: courseBasicData} = useQuery(['courseBasicData'], async () => {
        const {data} = await axios.get(`${baseUrl}restapi/personal/courses/${searchParams.get('id')}/v1`, {
            params: {
                'access_token': window.localStorage.getItem('access_token')
            }
        })
        return data
    }, {
        suspense: true,
        refetchInterval: 10000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchIntervalInBackground: false,
    })*/

    if (!courseId) {
        return (
            <p>Course not found</p>
        )
    }

    return (
        <div className={"flex gap-4 flex-1"}>
            <Helmet>
                <title>{data!.Title}</title>
            </Helmet>
            <Splitter direction={SplitDirection.Horizontal}>
                <div className={"flex flex-col h-full"}>
                    <div className={"flex items-end gap-2"}>
                        <h1 className={"text-3xl font-bold text-balance"}>{data!.Title}</h1>
                        <p className={"text-gray-500 flex-shrink-0"}>{data!.Code}</p>
                    </div>
                    <div className={"flex flex-col gap-4"}>
                        <h2 className={"text-xl font-bold"}>Lightbulletins</h2>
                        <ErrorBoundary
                            FallbackComponent={Fallback}
                        >
                            <Suspense
                                fallback={<LightbulletinsForCourseLoader/>}
                            >
                                <LightbulletinsForCourse courseId={courseId}/>
                            </Suspense>
                        </ErrorBoundary>
                    </div>
                </div>
                <div
                    className={"flex flex-col gap-4 min-w-[33vw] overflow-y-auto overflow-x-hidden"}>
                    <h2 className={"text-xl font-bold"}>Resources</h2>
                    <ErrorBoundary
                        FallbackComponent={Fallback}
                    >
                        <Suspense
                            fallback={<div className={"flex flex-col gap-2 w-full"}>
                                <Skeleton className="h-4 bg-gray-400 rounded"/>
                                <Skeleton className="h-4 bg-gray-400 rounded"/>
                                <Skeleton className="h-4 bg-gray-400 rounded"/>
                                <Skeleton className="h-4 bg-gray-400 rounded"/>
                            </div>}>
                            <Resources courseId={courseId}/>
                        </Suspense>
                    </ErrorBoundary>
                </div>
            </Splitter>
        </div>
    )
}

// @ts-ignore
function Fallback({error, resetErrorBoundary}) {
    // Call resetErrorBoundary() to reset the error boundary and retry the render.

    return (
        <div className={"flex flex-col gap-4 w-full"}>
            <p>Something went wrong:</p>
            <pre>{error.message}</pre>
            <Button onClick={resetErrorBoundary}>Try again</Button>
        </div>
    );
}