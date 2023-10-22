import { cn } from '@/lib/utils'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Skeleton } from '../ui/skeleton'
import { motion } from 'framer-motion';

export default function MessageSidebarChatLoader() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", damping: 300, stiffness: 1000, duration: 5 }}
            className={"w-full text-left group p-4 border-b cursor-pointer flex items-center hover:bg-foreground/10 transition-colors"}>
            <div className="mr-3">
                <Skeleton className={"w-10 h-10 flex-shrink-0 rounded-full"} />
            </div>
            <div className={"w-5/6"}>
                <Skeleton className={"w-1/2 h-4 mb-1"} />
                {/* <h2 className="font-semibold text-base">{author}</h2> */}
                <Skeleton className={"w-3/4 h-3"} />
                {/* <p className="text-sm text-gray-500 line-clamp-1 break-all">{he.decode(title)}</p> */}
            </div>
        </motion.div>
    )
}
