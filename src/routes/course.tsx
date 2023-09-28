import React, {useEffect} from "react";
import {Await, useLoaderData, useNavigation, useSearchParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {baseUrl} from "@/lib/utils.ts";
import {Helmet} from "react-helmet";

export default function Course() {
    const data = useLoaderData() as any;
    let [searchParams] = useSearchParams();
    const navigation = useNavigation();
    const state = navigation.state;

    useEffect(() => {
        console.log(state)
    }, [state]);

    const {data: courseBasicData, isLoading} = useQuery(['courseBasicData'], async () => {
        const {data} = await axios.get(`${baseUrl}restapi/personal/courses/${searchParams.get('id')}/v1`, {
            params: {
                'access_token': window.localStorage.getItem('access_token')
            }
        })
        return data
    })

    if (isLoading || state === "loading") {
        return (
            <>
                <Helmet>
                    <title>Loading...</title>
                </Helmet>
                <p>Loading...</p>
            </>
        )
    }

    return (
        <>
            Course
            <Helmet>
                <title>{courseBasicData.Title}</title>
            </Helmet>
            <React.Suspense
                fallback={<p>Loading course information...</p>}
            >
                <Await
                    resolve={data.courseData}
                    errorElement={
                        <p>Error loading package location!</p>
                    }
                >
                    {(courseData) => (
                        courseData.data.EntityArray.map((bulletin: any) => {
                            return <div key={bulletin.LightBulletinId} className="bg-white p-4 rounded shadow mb-4">
                                <p>{bulletin.Text}</p>
                                <p className="text-gray-500">
                                    Published by{' '}
                                    <a
                                        href={bulletin.PublishedBy.ProfileUrl}
                                        className="text-blue-500 hover:underline"
                                    >
                                        {bulletin.PublishedBy.FullName}
                                    </a>{' '}
                                    on {new Date(bulletin.PublishedDate).toLocaleDateString()}
                                </p>
                                <div className="mt-2 flex justify-between">
        <span className="text-gray-600">
          {bulletin.CommentsCount} Comment{bulletin.CommentsCount !== 1 && 's'}
        </span>
                                    <span className="text-gray-600">
          {bulletin.ResourcesCount} Resource{bulletin.ResourcesCount !== 1 && 's'}
        </span>
                                    {bulletin.IsSubscribed && (
                                        <span className="text-green-500 font-semibold">Subscribed</span>
                                    )}
                                </div>
                            </div>
                        })
                    )}
                </Await>
            </React.Suspense>
        </>
    )
}