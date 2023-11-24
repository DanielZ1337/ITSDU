import useFetchNextPageOnInView from "@/hooks/useFetchNextPageOnView";
import { AnimatePresence, motion } from 'framer-motion';

export function NotificationsCardsFetchMoreInView({ hasNextPage, fetchNextPage, isFetchingNextPage }: {
    hasNextPage?: boolean,
    fetchNextPage: () => void,
    isFetchingNextPage: boolean,
}) {
    const ref = useFetchNextPageOnInView(hasNextPage, fetchNextPage);
    return (
        <AnimatePresence>
            {hasNextPage && (
                <motion.div exit={{ opacity: 0, height: 0 }}>
                    <motion.div
                        ref={ref}
                        className="text-center mt-4 text-gray-600 text-sm"
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    >
                        {isFetchingNextPage ? 'Fetching more notifications...' : 'End of notifications'}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}