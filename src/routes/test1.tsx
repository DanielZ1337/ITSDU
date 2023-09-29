import {JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal} from "react";
import {baseUrl} from "@/lib/utils.ts";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";

export default function Test1() {

    const {data, isLoading} = useQuery(['bulletins'], async () => {
        const res = await axios.get(`${baseUrl}restapi/personal/courses/29222/bulletins/v1`, {
            params: {
                'access_token': window.localStorage.getItem('access_token')
            }
        })

        if (res.status !== 200) {
            throw new Error(res.statusText)
        }

        console.log(res.data)
        return res.data
    })

    // Function to generate a single bulletin item
    const generateBulletinItem = (bulletin: {
        LightBulletinId: Key | null | undefined;
        Text: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined;
        PublishedBy: {
            ProfileUrl: string | undefined;
            FullName: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined;
        };
        PublishedDate: string | number | Date;
        CommentsCount: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined;
        ResourcesCount: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined;
        IsSubscribed: any;
    }) => (
        <div key={bulletin.LightBulletinId} className="bg-white p-4 rounded shadow mb-4">
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
    );

    if (isLoading) {
        return (
            <div className={"flex flex-col"}>
                <div className={"flex flex-row flex-wrap gap-4 items-center justify-center"}>
                    {/* eslint-disable-next-line no-unused-vars */}
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_: any) => {
                        return (
                            <div className={"flex flex-col w-72 h-36 bg-white rounded-md shadow-md"}>
                                <div className={"flex flex-col w-full h-full p-4"}>
                                    <div className={"flex flex-row justify-between items-center"}>
                                        <div className={"w-4/5 h-4 bg-gray-200 rounded-md animate-pulse"}/>
                                    </div>
                                    <div className={"flex flex-col"}>
                                        <span className={"text-gray-500 text-sm"}>Loading...</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        data.EntityArray.map((bulletin: {
            LightBulletinId: Key | null | undefined;
            Text: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactPortal | Iterable<ReactNode> | null | undefined;
            PublishedBy: {
                ProfileUrl: string | undefined;
                FullName: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactPortal | Iterable<ReactNode> | null | undefined;
            };
            PublishedDate: string | number | Date;
            CommentsCount: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined;
            ResourcesCount: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined;
            IsSubscribed: any;
        }) => generateBulletinItem(bulletin))
    );
}