import useGETnotificationElements from "@/queries/notifications/useGETnotificationElements";
import {
    ItslearningRestApiEntitiesStreamItemV2
} from "@/types/api-types/utils/Itslearning.RestApi.Entities.StreamItemV2";
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from "react";
import LightbulletinCard from "../lightbulletin/lightbulletin-card";
import { getRelativeTimeString } from "@/lib/utils";
import NotificationElement from "./notification-element";
import NotificationTitle from "./notification-title";

export default function NotificationCard({ notification, showLocation = true }: {
    notification: ItslearningRestApiEntitiesStreamItemV2,
    showLocation?: boolean
}) {
    const { data } = useGETnotificationElements({
        notificationId: notification.NotificationId,
        PageSize: 9999,
    }, {
        suspense: true,
    })

    const [showElements, setShowElements] = useState(false)
    const [showLightBulletin, setShowLightBulletin] = useState(false)

    return (
        <div className="rounded-md p-4 bg-foreground/10">
            <h2 className="text-lg font-bold">
                <NotificationTitle
                    notification={notification}
                    showLocation={showLocation}
                    showElements={showElements}
                    setShowElements={setShowElements}
                    element={data?.EntityArray[0]}
                />
            </h2>
            <h3 className="text-sm text-gray-500">{getRelativeTimeString(new Date(notification.PublishedDate))}</h3>
            {notification.LightBulletin && (
                <button
                    className="mt-1 text-blue-500 transition-colors hover:text-blue-600 hover:underline"
                    onClick={() => setShowLightBulletin(prev => !prev)}
                >
                    {showLightBulletin ? "Hide" : "Show"} announcement
                </button>
            )}
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