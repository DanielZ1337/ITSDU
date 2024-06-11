import { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '../../ui/dialog'
import { Button } from '../../ui/button'
import { Expand } from 'lucide-react'
import { Document, Page } from 'react-pdf'
import { useResizeDetector } from 'react-resize-detector'
import { Loader } from '@/components/ui/loader'
import { useCustomPDFContext } from '../../../hooks/useCustomPDF'
import { useInView } from 'react-intersection-observer'
import { toast } from 'sonner'

interface PdfFullscreenProps {
	fileUrl?: string
}

const PdfFullscreen = ({ fileUrl }: PdfFullscreenProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const { setNumPages, numPages } = useCustomPDFContext()

	const { width, ref } = useResizeDetector()
	const [isLoading, setIsLoading] = useState(true)

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(v) => {
				if (!v) {
					setIsOpen(v)
				}
			}}
		>
			<DialogTrigger
				onClick={() => setIsOpen(true)}
				asChild
			>
				<Button
					variant='ghost'
					className='gap-1.5'
					aria-label='fullscreen'
				>
					<Expand className='h-4 w-4' />
				</Button>
			</DialogTrigger>
			<DialogContent className='w-full max-w-7xl no-drag'>
				<div
					ref={ref}
					className='mt-6 overflow-x-hidden overflow-y-auto h-full max-h-[calc(100vh-10rem)]'
				>
					<Document
						loading={
							<div className='flex justify-center'>
								<Loader className='my-24' />
							</div>
						}
						onLoadError={() => {
							toast.error('Error loading PDF', {
								description: 'Please try again later',
							})
						}}
						onLoadSuccess={({ numPages }) => {
							setNumPages(numPages)
							setIsLoading(false)
						}}
						file={fileUrl}
						className='max-h-full'
					>
						{Array.from(new Array(numPages), (_, index) => (
							<InViewPage
								isLoading={isLoading}
								key={index}
								pageNumber={index + 1}
							>
								<Page
									pageNumber={index + 1}
									className='max-h-full'
									loading={null}
									width={width}
								/>
								{numPages && index !== numPages - 1 && (
									<div className='h-2 bg-gray-200 absolute bottom-0 left-0 right-0' />
								)}
							</InViewPage>
						))}
					</Document>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default PdfFullscreen

function InViewPage({
	children,
	pageNumber,
	isLoading,
}: {
	children: React.ReactNode
	pageNumber: number
	isLoading: boolean
}) {
	const { setCurrPage } = useCustomPDFContext()
	const { ref } = useInView({
		threshold: 0.5,
		onChange: (inView) => {
			if (inView && !isLoading) {
				setCurrPage(pageNumber)
			}
		},
	})

	return (
		<div
			ref={ref}
			className='relative'
			style={{
				height: '100%',
				width: '100%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			{children}
		</div>
	)
}
