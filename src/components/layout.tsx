import {Outlet, useNavigation} from "react-router-dom";
import BrowserNav from "./browse-nav";
import React, {Suspense, useEffect, useState} from "react";
import {Spinner} from "@nextui-org/spinner";
import Header from "@/components/header";
import {Toaster} from "@/components/ui/toaster.tsx";
import {AnimatePresence, motion} from "framer-motion";
import {Button} from "@/components/ui/button.tsx";


export default function Layout() {
    const navigation = useNavigation();
    const [showToTopButton, setShowToTopButton] = useState<boolean>(false)
    const ref = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onScroll = () => {
            if (ref.current) {
                setShowToTopButton(ref.current.scrollTop > 100)
            }
        }
        ref.current?.addEventListener('scroll', onScroll)
        return () => ref.current?.removeEventListener('scroll', onScroll)
    }, [])

    if (navigation.state === "loading") {
        return (
            <div className="min-h-[100dvh] min-w-[100dvw] flex flex-1 flex-col w-full max-h-[100dvh] overflow-hidden">
                <Spinner size="lg" color="primary" label="Loading..." className={"m-auto"}/>
            </div>
        )
    }
    return (
        <div className="min-h-[100dvh] min-w-[100dvw] flex flex-1 flex-col w-full max-h-[100dvh] overflow-hidden">
            <div className={"flex flex-shrink-0 flex-grow-0 flex-col"}>
                <BrowserNav/>
                <Header/>
            </div>
            <Suspense
                fallback={<Spinner size="lg" color="primary" label="Loading..." className={"m-auto"}/>}>
                <div className="flex flex-1 flex-col overflow-x-auto overflow-y-auto" style={{
                    scrollbarGutter: "stable both-edges"
                }}
                     ref={ref}
                >
                    <Outlet/>
                    <Toaster/>
                </div>
            </Suspense>
            <AnimatePresence>
                {showToTopButton && (
                    <motion.div
                        initial={{opacity: 0, y: 100}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: 100}}
                        transition={{duration: 0.2}}
                    >
                        <Button
                            variant={"outline"}
                            size={"icon"}
                            className="fixed bottom-4 right-8 z-50 inline-flex items-center justify-center w-12 h-12 text-white transition-all duration-200 rounded-full shadow-md hover:shadow-lg"
                            onClick={() => {
                                ref.current?.scrollTo({
                                    top: 0,
                                    behavior: "smooth"
                                })
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M5 15l7-7 7 7"/>
                            </svg>
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
