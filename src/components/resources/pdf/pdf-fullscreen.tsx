import {useState} from 'react'
import {Dialog, DialogContent, DialogTrigger,} from '../../ui/dialog'
import {Button} from '../../ui/button'
import {Expand} from 'lucide-react'
import {Document, Page} from 'react-pdf'
import {useToast} from '../../ui/use-toast'
import {useResizeDetector} from 'react-resize-detector'
import {Loader} from '@/components/ui/loader'

interface PdfFullscreenProps {
    fileUrl?: string
}

const PdfFullscreen = ({fileUrl}: PdfFullscreenProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [numPages, setNumPages] = useState<number>()

    const {toast} = useToast()

    const {width, ref} = useResizeDetector()

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(v) => {
                if (!v) {
                    setIsOpen(v)
                }
            }}>
            <DialogTrigger
                onClick={() => setIsOpen(true)}
                asChild>
                <Button
                    variant='ghost'
                    className='gap-1.5'
                    aria-label='fullscreen'>
                    <Expand className='h-4 w-4'/>
                </Button>
            </DialogTrigger>
            <DialogContent className='w-full max-w-7xl no-drag'>
                <div ref={ref} className='mt-6 overflow-x-hidden overflow-y-auto h-full max-h-[calc(100vh-10rem)]'>
                    <Document
                        loading={
                            <div className='flex justify-center'>
                                <Loader className='my-24'/>
                            </div>
                        }
                        onLoadError={() => {
                            toast({
                                title: 'Error loading PDF',
                                description: 'Please try again later',
                                variant: 'destructive',
                            })
                        }}
                        onLoadSuccess={({numPages}) =>
                            setNumPages(numPages)
                        }
                        file={fileUrl}
                        className='max-h-full'>
                        {new Array(numPages).fill(0).map((_, i) => (
                            <Page
                                loading={null}
                                key={i}
                                width={width ? width : 1}
                                pageNumber={i + 1}
                            />
                        ))}
                    </Document>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default PdfFullscreen