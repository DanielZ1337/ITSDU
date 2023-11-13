import { useIsOnline } from '@/hooks/useIsOnline'
import { AnimatePresence, motion } from 'framer-motion';

export default function IsOnlineIndicator() {
    const { isOnline, debouncedIsOnline } = useIsOnline()

    return (
        <>
            <AnimatePresence>
                {isOnline === false && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-red-500 text-white items-center flex justify-center"
                    >
                        <span className="py-2 block">
                            You are offline
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {debouncedIsOnline === false && isOnline === true && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-green-500 text-white items-center flex justify-center"
                    >
                        <span className="py-2 block">
                            You are online
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
