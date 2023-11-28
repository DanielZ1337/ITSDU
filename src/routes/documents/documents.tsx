import PdfRenderer from '@/components/pdf-renderers/pdf-renderer'
import useResourceByElementID from '@/queries/resources/useResourceByElementID'
import {useEffect, useRef, useState} from 'react'
import {useParams} from 'react-router-dom'
import {motion} from 'framer-motion'
import {useAISidepanel} from '@/hooks/atoms/useAISidepanel'
import {useResizeDetector} from 'react-resize-detector'
import AISidePanel from '@/components/ai-chat/ai-sidepanel'
import {useAtom} from 'jotai'
import {customPDFrendererAtom} from '@/atoms/default-pdf-renderer'
import {ArrowLeftToLine, ArrowRightToLine, Loader2} from 'lucide-react'
import {Button} from '@/components/ui/button'

export default function Documents() {
    const {elementId} = useParams();

    if (!elementId) return <div>Element ID not found</div>

    const {isLoading, data} = useResourceByElementID(elementId);
    const {aiSidepanel, toggleSidebar} = useAISidepanel()
    const {ref: aiSidepanelRef, width: aiSidepanelWidth} = useResizeDetector()

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

    const [useCustomPDFRenderer] = useAtom(customPDFrendererAtom)

    const DefaultPdfRenderer = () => {
        if (isLoading) {
            return (
                <div className="flex h-full w-full items-center justify-center">
                    <div className="h-10 w-10">
                        <Loader2 className={"stroke-foreground shrink-0 h-6 w-6 animate-spin m-auto"}/>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="relative flex h-full w-full items-center justify-center">
                    <iframe src={data?.url} className="h-full w-full"/>
                    <Button className="absolute inset-y-0 right-4 my-auto mr-4 group" variant='secondary'
                            data-active={aiSidepanel} onClick={toggleSidebar}>
                        <span className='relative h-4 w-4'>
                            <ArrowRightToLine
                                className='w-4 h-4 absolute group-data-[active=false]:opacity-0 transition-all'/>
                            <ArrowLeftToLine
                                className='w-4 h-4 absolute animate-in group-data-[active=true]:opacity-0 transition-all'/>
                        </span>
                    </Button>
                </div>
            )
        }
    }

    return (
        <div className="flex h-full max-h-full w-full flex-1 overflow-hidden" ref={containerRef}>
            {useCustomPDFRenderer ? (
                <PdfRenderer
                    url={data?.url}
                    aiSidepanelWidth={aiSidepanelWidth ?? 0}
                    externalIsLoading={isLoading}
                    containerWidth={containerWidth}
                    containerHeight={containerHeight}
                />
            ) : (
                <DefaultPdfRenderer/>
            )}

            <div className="flex h-full w-full flex-1"
                 ref={aiSidepanelRef}
            >
                <motion.div className="flex h-full max-h-full flex-1 flex-row overflow-hidden"
                            initial={false}
                            animate={{width: aiSidepanel ? '33vw' : 0}}
                            transition={{duration: 0.2}}
                >
                    <AISidePanel elementId={elementId}/>
                </motion.div>
            </div>
        </div>
    )
}