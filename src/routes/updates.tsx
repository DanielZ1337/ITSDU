import LightbulletinCard from "@/components/lightbulletin/lightbulletin-card";
import useGETnotificationsStream from "@/queries/notifications/useGETnotificationsStream"
import {
    ItslearningRestApiEntitiesStreamItemV2
} from "@/types/api-types/utils/Itslearning.RestApi.Entities.StreamItemV2";
import React, { Suspense, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import useGETnotification from '../queries/notifications/useGETnotificationElements';
import { ItslearningRestApiEntitiesElementLink } from '../types/api-types/utils/Itslearning.RestApi.Entities.ElementLink';
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from 'framer-motion';
import { isResourcePDFFromUrlOrElementType } from "@/types/api-types/extra/learning-tool-id-types";
import { Skeleton } from "@nextui-org/react";
import { getRelativeTimeString } from "@/lib/utils";


export default function Updates() {
    const { data: updates, fetchNextPage, hasNextPage, isFetchingNextPage } = useGETnotificationsStream({
        showLightBulletins: true,
        PageIndex: 0,
        PageSize: 10,
        UseNewerThan: true,
    }, {
        suspense: true,
        keepPreviousData: true,
    })

    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    return (
        <div className="rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold mb-4">Recent Updates</h1>
            <div className="flex flex-col gap-4">
                {updates && updates.pages.map((page) => (
                    page.EntityArray.map((update) => (
                        <Suspense fallback={
                            <Skeleton className="bg-foreground/10 rounded-md py-8" />
                        } key={update.NotificationId}>
                            <NotificationCard key={update.NotificationId} notification={update} />
                        </Suspense>
                    ))
                ))}
            </div>
            <div ref={ref} className="text-center mt-4 text-gray-600 text-sm">
                {isFetchingNextPage ? 'Fetching more notifications...' : 'End of notifications'}
            </div>
        </div>
    )
}

function NotificationCard({ notification }: { notification: ItslearningRestApiEntitiesStreamItemV2 }) {
    const { data } = useGETnotification({
        notificationId: notification.NotificationId,
        PageSize: 9999,
    }, {
        suspense: true,
    })

    const [showElements, setShowElements] = useState(false)
    const [showLightBulletin, setShowLightBulletin] = useState(false)

    return (
        <div className="bg-foreground/10 rounded-md p-4">
            <h2 className="text-lg font-bold">
                {notification.ElementsCount === 0 ? <>New announcement available in <NotificationLocation
                    notification={notification} /></> : notification.ElementsCount === 1 ? (
                        <>
                            {notification.PublishedBy.FullName} added <NotificationElement
                                element={data!.EntityArray[0]} /> in <NotificationLocation notification={notification} />
                        </>
                    ) : (
                    <>
                        {notification.PublishedBy.FullName} added <NotificationElement
                            element={data!.EntityArray[0]} /> and <button
                                className="text-blue-500 hover:text-blue-600 transition-colors hover:underline"
                                onClick={() => setShowElements(prev => !prev)}>{notification.ElementsCount - 1} more</button> in <NotificationLocation
                            notification={notification} />
                    </>
                )}
            </h2>
            <h3 className="text-sm text-gray-500">{getRelativeTimeString(new Date(notification.PublishedDate))}</h3>
            {notification.LightBulletin &&
                <button className="mt-1 text-blue-500 hover:text-blue-600 transition-colors hover:underline"
                    onClick={() => setShowLightBulletin(prev => !prev)}>{showLightBulletin ? "Hide" : "Show"} light
                    bulletin</button>}
            <AnimatePresence>
                {showElements && <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                >
                    {data!.EntityArray.slice(1).map((element, i) => (
                        <motion.div key={element.ElementId} className="mt-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                transition: { delay: i * 0.1, type: "tween", duration: 0.3 }
                            }}
                            exit={{ opacity: 0, y: 10 }}
                        >
                            <NotificationElement element={element} />
                        </motion.div>
                    ))}
                </motion.div>}
            </AnimatePresence>
            <AnimatePresence>
                {showLightBulletin && notification.LightBulletin && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: 10, height: 0 }}
                        transition={{ type: "tween", duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-2">
                            <LightbulletinCard bulletin={notification.LightBulletin} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function NotificationElement({ element }: { element: ItslearningRestApiEntitiesElementLink }) {
    const navigate = useNavigate()

    return (
        <button onClick={() => {
            if (isResourcePDFFromUrlOrElementType(element.IconUrl)) {
                navigate(`/ai/${element.ElementId}`)
            } else {
                window.app.openExternal(element.ContentUrl)
            }
        }}
            className="text-blue-500 hover:text-blue-600 transition-colors hover:underline"
        >
            {element.Title}
        </button>
    )
}

function NotificationLocation({ notification }: { notification: ItslearningRestApiEntitiesStreamItemV2 }) {
    return (
        <Link className="text-blue-500 hover:text-blue-600 transition-colors hover:underline"
            to={`/courses/${notification.LocationId}`}>
            {notification.LocationTitle}
        </Link>
    )
}