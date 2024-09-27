import {AnimatePresence, m} from 'framer-motion';
import {Button} from "@/components/ui/button.tsx";
import {ChevronUp} from "lucide-react";
import React, {useEffect, useState} from "react";

export default function ScrollToTopButton({viewportRef}: {
    viewportRef: React.RefObject<HTMLDivElement>
}) {

    const [showToTopButton, setShowToTopButton] = useState<boolean>(false)

    useEffect(() => {
        const onScroll = () => {
            if (viewportRef.current) {
                setShowToTopButton(viewportRef.current.scrollTop > 100)
            }
        }
        viewportRef.current?.addEventListener('scroll', onScroll)
        return () => viewportRef.current?.removeEventListener('scroll', onScroll)
    }, [viewportRef])

    return (
        <AnimatePresence>
            {showToTopButton && (
                <m.div
                    initial={{opacity: 0, y: 100}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: 100}}
                    transition={{duration: 0.2}}
                >
                    <Button
                        variant={"outline"}
                        size={"icon"}
                        className="fixed right-8 bottom-4 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full text-white shadow-md transition-all duration-200 hover:shadow-lg"
                        onClick={() => {
                            viewportRef.current?.scrollTo({
                                top: 0,
                                behavior: "smooth"
                            })
                        }}
                    >
                        <ChevronUp className="h-7 w-7 stroke-foreground"/>
                    </Button>
                </m.div>
            )}
        </AnimatePresence>
    )
}