import {Suspense} from "react";
import {useSearchParams} from "react-router-dom";
import LightbulletinsForCourse from "@/components/lightbulletin/lightbulletins-for-course.tsx";
import useGETcourseBasic from "@/queries/courses/useGETcourseBasic.ts";
import {Helmet} from "react-helmet";
import ErrorPage from "@/error-page.tsx";
import Splitter, {SplitDirection} from '@devbookhq/splitter'
import '../styles/splitter-custom.css'
import LightbulletinsForCourseLoader from "@/components/lightbulletin/lightbulletins-for-course-loader.tsx";
import Resources from "@/components/resources/resources.tsx";

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
                <div className={"flex flex-col gap-4 h-full"}>
                    <div className={"flex flex-col gap-4"}>
                        <h1 className={"text-3xl font-bold"}>{data!.Title}</h1>
                    </div>
                    <div className={"flex flex-col gap-4"}>
                        <h2 className={"text-xl font-bold"}>Lightbulletins</h2>
                        <ErrorPage>
                            <Suspense
                                fallback={<LightbulletinsForCourseLoader/>}
                            >
                                <LightbulletinsForCourse courseId={courseId}/>
                            </Suspense>
                        </ErrorPage>
                    </div>
                </div>
                <div
                    className={"flex flex-col gap-4 min-w-[33vw] max-w-[33vw] overflow-y-auto overflow-x-hidden"}>
                    <h2 className={"text-xl font-bold"}>Resources</h2>
                    <ErrorPage>
                        <Suspense
                            fallback={<div className={"h-96 w-full bg-foreground/10 rounded-md shadow-md"}/>}>
                            <Resources courseId={courseId}/>
                        </Suspense>
                    </ErrorPage>
                </div>
            </Splitter>
        </div>
    )
}