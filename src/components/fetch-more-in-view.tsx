import useFetchNextPageOnInView from "@/hooks/useFetchNextPageOnView";
import {cn} from "@/lib/utils";
import {AnimatePresence, motion} from 'framer-motion';

export function FetchMoreInview({hasNextPage, fetchNextPage, isFetchingNextPage, className, children, ...props}: {
    hasNextPage?: boolean,
    fetchNextPage: () => void,
    isFetchingNextPage: boolean,
    className?: string,
    children?: React.ReactNode,
}) {
    const ref = useFetchNextPageOnInView(hasNextPage, fetchNextPage, isFetchingNextPage);
    return (
        <AnimatePresence>
            {hasNextPage && (
                <motion.div exit={{opacity: 0, height: 0}}>
                    <motion.div
                        ref={ref}
                        className={cn("text-center mt-4 text-gray-600 text-sm", className)}
                        exit={{opacity: 0, height: 0, marginTop: 0}}
                        {...props}
                    >
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}