import { useIsOnline } from '@/hooks/useIsOnline'
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

export default function IsOnlineIndicator() {
    const { isOnline, debouncedIsOnline } = useIsOnline()

    return (
        <>
            <AnimatePresence>
                {isOnline === false && (
                    <IsOnline title="You are offline" className="bg-red-500" />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {debouncedIsOnline === false && isOnline === true && (
                    <IsOnline title="You are online" className="bg-green-500" />
                )}
            </AnimatePresence>
        </>
    )
}

function IsOnline({ title, className }: { title: string, className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={cn("text-white items-center flex justify-center leading-tight tracking-tight font-semibold", className)}
        >
            <span className="py-2 block">
                {title}
            </span>
        </motion.div>
    )
}
