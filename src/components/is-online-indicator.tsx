import { useIsOnline } from '@/hooks/useIsOnline'
import { queryClient } from '@/lib/tanstack-client';
import { cn } from '@/lib/utils';
import { AnimatePresence, m } from 'framer-motion';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useErrorBoundary } from "react-error-boundary";

export default function IsOnlineIndicator() {
    const { isOnline, debouncedIsOnline } = useIsOnline()
    const { resetBoundary } = useErrorBoundary();

    const changedFromOfflineToOnline = debouncedIsOnline === false && isOnline === true
    const navigate = useNavigate()


    useEffect(() => {
        if (changedFromOfflineToOnline) {
            window.auth.refresh().then(() => {

                queryClient.invalidateQueries()
                queryClient.resetQueries()
                queryClient.refetchQueries()
                // queryClient.removeQueries()
                queryClient.clear()
                resetBoundary()
                setTimeout(() => {
                    navigate(0)
                }, 1000)
            })
        }
    }, [changedFromOfflineToOnline])

    return (
        <>
            <AnimatePresence>
                {isOnline === false && (
                    <IsOnline title="You are offline" className="bg-red-500" />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {changedFromOfflineToOnline && (
                    <IsOnline title="You are online" className="bg-green-500" />
                )}
            </AnimatePresence>
        </>
    )
}

function IsOnline({ title, className }: { title: string, className?: string }) {
    return (
        <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={cn("text-white items-center flex justify-center leading-tight tracking-tight font-semibold", className)}
        >
            <span className="block py-2">
                {title}
            </span>
        </m.div>
    )
}
