import PdfRenderer from '@/components/pdf-renderer'
import useResourceByElementID from '@/hooks/usePDFbyElementID'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAISidepanel } from '@/hooks/atoms/useAISidepanel'
import { useResizeDetector } from 'react-resize-detector'
import AISidePanel from '@/components/ai-chat/ai-sidepanel'

export default function Documents() {
    const { elementId } = useParams();

    if (!elementId) return <div>Element ID not found</div>

    const { isLoading, data } = useResourceByElementID(elementId);
    const { aiSidepanel } = useAISidepanel()
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

    return (
        <div className="flex-1 w-full h-full flex max-h-full overflow-hidden" ref={containerRef}>
            <PdfRenderer
                url={data}
                aiSidepanelWidth={aiSidepanelWidth ?? 0}
                externalIsLoading={isLoading}
                containerWidth={containerWidth}
                containerHeight={containerHeight}
            />

            <div className="flex flex-1 w-full h-full"
                ref={aiSidepanelRef}
            >
                <motion.div className="flex flex-row flex-1 h-full max-h-full overflow-hidden"
                    initial={false}
                    animate={{ width: aiSidepanel ? '33vw' : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <AISidePanel elementId={elementId} />
                </motion.div>
            </div>
        </div>
    );
}
