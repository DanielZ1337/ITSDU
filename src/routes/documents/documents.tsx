import useResourceByElementID from '@/queries/resources/useResourceByElementID'
import { lazy, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { m } from 'framer-motion';
import { useAISidepanel } from '@/hooks/atoms/useAISidepanel'
import { useResizeDetector } from 'react-resize-detector'
import AISidePanel from '@/components/ai-chat/ai-sidepanel'
import { useAtom } from 'jotai'
import { customPDFrendererAtom } from '@/atoms/default-pdf-renderer'
import { ArrowLeftToLine, ArrowRightToLine } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Loader } from '@/components/ui/loader';
import { CustomPDFProvider } from '@/contexts/custom-pdf-context';
import { useSettings } from '@/hooks/atoms/useSettings';

const PdfRenderer = lazy(() => import('@/components/resources/pdf/pdf-renderer'))

export default function Documents() {
    const { elementId } = useParams();

    if (!elementId) return <div>Element ID not found</div>

    const { isLoading, data } = useResourceByElementID(elementId);
    const { aiSidepanel, toggleSidebar } = useAISidepanel()
    const { ref: aiSidepanelRef, width: aiSidepanelWidth } = useResizeDetector()

    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState<number | null>(null);
    const [containerHeight, setContainerHeight] = useState<number | null>(null);

    useEffect(() => {
        if (containerRef.current) {
            setContainerWidth(containerRef.current.clientWidth);
            setContainerHeight(containerRef.current.clientHeight);
        }
    }, [containerRef.current?.clientHeight])

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.clientWidth);
                setContainerHeight(containerRef.current.clientHeight);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const { settings } = useSettings()

    const DefaultPdfRenderer = () => {
        if (isLoading) {
            return (
                <div className="flex h-full w-full items-center justify-center">
                    <div className="h-10 w-10">
                        <Loader className={"m-auto"} />
                    </div>
                </div>
            )
        } else {
            return (
                <div className="relative flex h-full w-full items-center justify-center">
                    <iframe src={data?.url} className="h-full w-full" />
                    <Button className="absolute inset-y-0 right-4 my-auto mr-4 group" variant='secondary'
                        data-active={aiSidepanel} onClick={toggleSidebar}>
                        <span className='relative h-4 w-4'>
                            <ArrowRightToLine
                                className='w-4 h-4 absolute group-data-[active=false]:opacity-0 transition-all' />
                            <ArrowLeftToLine
                                className='w-4 h-4 absolute animate-in group-data-[active=true]:opacity-0 transition-all' />
                        </span>
                    </Button>
                </div>
            )
        }
    }

    return (
        <div className="flex h-full max-h-full w-full flex-1 overflow-hidden" ref={containerRef}>
            {settings.CustomPDFrenderer ? (
                <CustomPDFProvider>
                    <PdfRenderer
                        url={data?.url}
                        filename={data?.name}
                        aiSidepanelWidth={aiSidepanelWidth ?? 0}
                        externalIsLoading={isLoading}
                        containerWidth={containerWidth}
                        containerHeight={containerHeight}
                    />
                </CustomPDFProvider>
            ) : (
                <DefaultPdfRenderer />
            )}

            <div className="flex h-full w-fit"
                ref={aiSidepanelRef}
            >
                <m.div className="flex h-full max-h-full flex-row overflow-hidden"
                    initial={false}
                    animate={{ width: aiSidepanel ? '33vw' : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <AISidePanel elementId={elementId} />
                </m.div>
            </div>
        </div>
    )
}