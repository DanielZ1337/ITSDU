import {Outlet} from "react-router-dom";
import BrowserNav from "./browse-nav";
import {Suspense, useEffect, useRef} from "react";
import {Spinner} from "@nextui-org/spinner";
import Header from "@/components/header";
import {Toaster} from "@/components/ui/toaster.tsx";
import ScrollToTopButton from "@/components/scroll-to-top-button.tsx";
import {ErrorBoundary} from "react-error-boundary";
import {showBrowseNav as showBrowseNavAtom} from '../atoms/browse-nav';
import {useAtom} from "jotai";
import {AnimatePresence, motion} from 'framer-motion';

export default function Layout() {
    const ref = useRef<HTMLDivElement>(null);
    const [showBrowseNav, setShowBrowseNav] = useAtom(showBrowseNavAtom);

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.ctrlKey && e.key === 'b') {
                e.preventDefault()
                setShowBrowseNav((prev) => !prev)
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, []);

    return (
        <div className="min-h-[100dvh] min-w-[100dvw] flex flex-1 flex-col w-full max-h-[100dvh] overflow-hidden">
            <div className={"flex flex-shrink-0 flex-grow-0 flex-col"}>
                <AnimatePresence>
                    {showBrowseNav && <motion.div
                        layout
                        initial={{opacity: 0, height: 0}}
                        animate={{opacity: 1, height: "auto"}}
                        exit={{opacity: 0, height: 0}}
                        className="overflow-hidden"
                    >
                        <BrowserNav/>
                    </motion.div>
                    }
                </AnimatePresence>
                <Header/>
            </div>
            <ErrorBoundary fallback={<div>ERROR</div>}>
                <Suspense
                    fallback={<Spinner size="lg" color="primary" label="Loading..." className={"m-auto"}/>}>
                    <div className="flex flex-1 flex-col overflow-x-auto overflow-y-auto"
                        /*style={{
                            scrollbarGutter: "stable both-edges"
                        }}*/
                         ref={ref}>
                        <Outlet/>
                    </div>
                </Suspense>
            </ErrorBoundary>
            <ScrollToTopButton viewportRef={ref}/>
            <Toaster/>
        </div>
    )
}