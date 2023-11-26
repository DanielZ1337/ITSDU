import { ArrowLeftToLine, ArrowRightToLine, ChevronDown, ChevronUp, DownloadIcon, Loader2, RotateCw, Search, } from 'lucide-react'
import { Document, Page, pdfjs } from 'react-pdf'

import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { useToast } from '@/components/ui/use-toast'

import { useResizeDetector } from 'react-resize-detector'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useEffect, useMemo, useRef, useState } from 'react'

import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu'
import PdfFullscreen from './pdf-fullscreen'
import { useAISidepanel } from '@/hooks/atoms/useAISidepanel'
import AISidepanelButton from '../ai-chat/ai-sidepanel-button'

// import SimpleBar from 'simplebar-react'
// import PdfFullscreen from './PdfFullscreen'

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

interface PdfRendererProps {
    url?: string
    externalIsLoading?: boolean
    aiSidepanelWidth: number
    containerWidth?: number | null
    containerHeight?: number | null
}

export default function PdfRenderer({ url, externalIsLoading, aiSidepanelWidth, containerWidth, containerHeight }: PdfRendererProps) {
    const { toast } = useToast()

    const { aiSidepanel, toggleSidebar } = useAISidepanel()
    const [numPages, setNumPages] = useState<number>()
    const [currPage, setCurrPage] = useState<number>(1)
    const [scale, setScale] = useState<number>(1)
    const [rotation, setRotation] = useState<number>(0)
    const [renderedScale, setRenderedScale] = useState<
        number | null
    >(null)

    const [pageHeight, setPageHeight] = useState<number | null>(null)
    const [pageWidth, setPageWidth] = useState<number | null>(null)
    const { height: toolbarHeight, ref: toolbarRef } = useResizeDetector()

    console.log('containerHeight', containerHeight)
    console.log('containerWidth', containerWidth)
    console.log('toolbarHeight', toolbarHeight)
    console.log('aiSidepanelWidth', aiSidepanelWidth)
    console.log('pageHeight', pageHeight)
    console.log('pageWidth', pageWidth)

    function getWidth() {

        if (pageHeight && pageWidth && containerHeight && containerWidth && toolbarHeight) {
            const ratio = pageWidth / pageHeight
            const availableHeight = containerHeight - toolbarHeight
            const availableWidth = containerWidth - aiSidepanelWidth
            const availableRatio = availableWidth / availableHeight

            if (ratio > availableRatio) {
                return availableWidth
            } else {
                return Math.floor(Math.min(availableHeight) * Math.min(ratio)) - 1
            }
        } else {
            if (containerHeight && containerWidth && toolbarHeight) {
                const availableHeight = containerHeight - toolbarHeight
                const availableWidth = containerWidth - aiSidepanelWidth
                return Math.floor(Math.min(availableHeight, availableWidth)) - 1
            } else {
                return null
            }
        }
    }

    const width = useMemo(() => getWidth(), [pageHeight, pageWidth, containerHeight, containerWidth, toolbarHeight, aiSidepanelWidth, aiSidepanel])

    const isLoading = renderedScale !== scale

    const CustomPageValidator = z.object({
        page: z
            .string()
            .refine(
                (num) => Number(num) > 0 && Number(num) <= numPages!
            ),
    })

    type TCustomPageValidator = z.infer<
        typeof CustomPageValidator
    >

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<TCustomPageValidator>({
        defaultValues: {
            page: '1',
        },
        resolver: zodResolver(CustomPageValidator),
    })

    console.log(isLoading)

    console.log(errors)

    const handlePageSubmit = ({
        page,
    }: TCustomPageValidator) => {
        setCurrPage(Number(page))
        setValue('page', String(page))
    }
    const ref = useRef<HTMLDivElement>(null)

    const [isPageFocused, setIsPageFocused] = useState(false);

    const handleFocus = () => {
        setIsPageFocused(true);
    };

    const handleDocumentClick = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            setIsPageFocused(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick);

        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, []);

    const handlePageIncrease = () => {
        if (currPage + 1 > numPages!) return
        setCurrPage((prev) =>
            prev + 1 > numPages! ? numPages! : prev + 1
        )
        setValue('page', String(currPage + 1))
    }

    const handlePageDecrease = () => {
        if (currPage - 1 < 1) return
        setCurrPage((prev) =>
            prev - 1 > 1 ? prev - 1 : 1
        )
        setValue('page', String(currPage - 1))
    }


    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // check if the ref is focused
            if (isPageFocused) {
                if (event.key === 'ArrowRight') {
                    handlePageIncrease()
                } else if (event.key === 'ArrowLeft') {
                    handlePageDecrease()
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isPageFocused, currPage, numPages]);

    return (
        <div className='flex h-full w-full flex-col items-center shadow bg-background'
            ref={ref}
        >
            <div className='flex h-14 w-full items-center justify-between border-b px-2'
                ref={toolbarRef}
            >
                <div className='flex items-center gap-1.5'>
                    <Button
                        disabled={currPage <= 1}
                        onClick={handlePageDecrease}
                        variant='ghost'
                        aria-label='previous page'>
                        <ChevronDown className='h-4 w-4' />
                    </Button>

                    <div className='flex items-center gap-1.5'>
                        <Input
                            {...register('page')}
                            className={cn(
                                'w-12 h-8',
                                errors.page && 'focus-visible:ring-red-500'
                            )}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSubmit(handlePageSubmit)()
                                }
                            }}
                        />
                        <p className='text-sm text-zinc-700 space-x-1'>
                            <span>/</span>
                            <span>{numPages ?? 'x'}</span>
                        </p>
                    </div>

                    <Button
                        disabled={
                            numPages === undefined ||
                            currPage === numPages
                        }
                        onClick={handlePageIncrease}
                        variant='ghost'
                        aria-label='next page'>
                        <ChevronUp className='h-4 w-4' />
                    </Button>
                </div>

                <div className='space-x-2'>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                className='gap-1.5'
                                aria-label='zoom'
                                variant='ghost'>
                                <Search className='h-4 w-4' />
                                {scale * 100}%
                                <ChevronDown className='h-3 w-3 opacity-50' />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem
                                onSelect={() => setScale(1)}>
                                100%
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onSelect={() => setScale(1.5)}>
                                150%
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onSelect={() => setScale(2)}>
                                200%
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onSelect={() => setScale(2.5)}>
                                250%
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                        onClick={() => setRotation((prev) => prev + 90)}
                        variant='ghost'
                        aria-label='rotate 90 degrees'>
                        <RotateCw className='h-4 w-4' />
                    </Button>
                    <Button asChild variant={'ghost'}>
                        <a
                            href={url}
                            download='document.pdf'
                            className='flex items-center gap-1.5'
                            aria-label='download'
                        >
                            <DownloadIcon className='h-4 w-4' />
                        </a>
                    </Button>
                    <PdfFullscreen fileUrl={url} />
                    <AISidepanelButton />
                </div>
            </div>

            <div
                className='h-full w-full flex-1 overflow-hidden'
                onClick={handleFocus}
            >
                {externalIsLoading ? (
                    <div className='flex h-full w-full justify-center'>
                        <Loader2 className='m-auto h-8 w-8 animate-spin' />
                    </div>
                ) : (
                    <Document
                        loading={<Loader2 className='m-auto h-8 w-8 animate-spin' />}
                        onLoadError={() => {
                            toast({
                                title: 'Error loading PDF',
                                description: 'Please try again later',
                                variant: 'destructive',
                            })
                        }}
                        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                        file={url}
                        className={cn('w-full h-full flex flex-col overflow-y-auto overflow-x-hidden items-center max-h-full', isLoading && 'justify-center')}>
                        {isLoading && renderedScale ? (
                            <Page
                                width={width ? width : 1}
                                pageNumber={currPage}
                                scale={scale}
                                rotate={rotation}
                                key={'@' + renderedScale}
                            />
                        ) : (
                            <Page
                                className={cn(isLoading ? 'hidden' : '')}
                                _className='w-full h-full flex justify-center items-center !bg-background'
                                width={width ? width : 1}
                                pageNumber={currPage}
                                scale={scale}
                                rotate={rotation}
                                key={'@' + scale}
                                loading={
                                    <div className='flex justify-center'>
                                        <Loader2 className='my-24 h-8 w-8 animate-spin' />
                                    </div>
                                }
                                onRenderSuccess={(page) => {
                                    setPageHeight(page.height)
                                    setPageWidth(page.width)
                                    setRenderedScale(scale)
                                }}
                            />
                        )}
                    </Document>
                )}
            </div>
        </div>
    )
}