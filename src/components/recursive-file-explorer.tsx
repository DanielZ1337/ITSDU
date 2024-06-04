import { Suspense, useCallback, useState } from 'react'
// eslint-disable-next-line no-redeclare
import { File, FolderClosedIcon, FolderOpenIcon } from 'lucide-react'
import useGETcourseFolderResources from '@/queries/courses/useGETcourseFolderResources.ts'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorPage from '@/error-page.tsx'
import { useToast } from '@/components/ui/use-toast.ts'
import '@/styles/3-dots-loading.css'
import { ItsolutionsItslUtilsConstantsElementType } from '@/types/api-types/utils/Itsolutions.ItslUtils.Constants.ElementType.ts'
import {
	isResourceFile,
	isSupportedResourceInApp,
	useNavigateToResource,
} from '@/types/api-types/extra/learning-tool-id-types'
import { useNavigate } from 'react-router-dom'
import type { ItslearningRestApiEntitiesPersonalCourseCourseResource } from '@/types/api-types/utils/Itslearning.RestApi.Entities.Personal.Course.CourseResource'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu'
import { ReactLoading } from './react-loading-new/react-loading'

type NestedItem = {
	[key: string]: boolean
}

export default function RecursiveFileExplorer({
	courseId,
	folderId,
	isOpen,
}: {
	courseId: number
	folderId: number
	isOpen: boolean
}) {
	const [showNested, setShowNested] = useState<NestedItem>({})
	const { toast, dismiss } = useToast()

	const { data } = useGETcourseFolderResources(
		{
			courseId: courseId,
			folderId: folderId,
		},
		{
			suspense: true,
		}
	)

	const toggleNested = (name: string | number) => {
		setShowNested({ ...showNested, [name]: !showNested[name] })
	}

	const navigateToResource = useNavigateToResource()

	const handleResourceNavigation = useCallback(
		(resource: ItslearningRestApiEntitiesPersonalCourseCourseResource) => {
			if (isSupportedResourceInApp(resource)) {
				navigateToResource(resource)
			} else {
				window.app.openExternal(resource.ContentUrl)
			}
		},
		[navigateToResource]
	)

	return (
		<div className={'ml-5'}>
			{data!.Resources.EntityArray.map((parent) => {
				return (
					<div key={parent.ElementId}>
						{/* rendering folders */}
						<ErrorBoundary fallback={<ErrorPage />}>
							<Suspense
								fallback={
									<ReactLoading
										className={'loading-dots -ml-0.5 -mt-2'}
										height={30}
										width={30}
										type={'bubbles'}
									/>
								}
							>
								{/*@ts-ignore documentation for itslearning is wrong, so this gives a wrong type*/}
								{parent.ElementType ===
									ItsolutionsItslUtilsConstantsElementType[ItsolutionsItslUtilsConstantsElementType.Folder] && (
									<button
										className={'inline-flex'}
										onClick={() => toggleNested(parent.ElementId)}
									>
										{showNested[parent.ElementId] ? (
											<FolderOpenIcon className={'shrink-0'} />
										) : (
											<FolderClosedIcon className={'shrink-0'} />
										)}
										<span className={'ml-2 text-left'}>
											{parent.Title}
											<RecursiveFileExplorer
												courseId={courseId}
												folderId={parent.ElementId}
												isOpen={showNested[parent.ElementId]}
											/>
										</span>
									</button>
								)}
							</Suspense>
						</ErrorBoundary>
						{/* rendering files */}
						{/*@ts-ignore documentation for itslearning is wrong, so this gives a wrong type*/}
						{isOpen &&
							parent.ElementType !==
								ItsolutionsItslUtilsConstantsElementType[ItsolutionsItslUtilsConstantsElementType.Folder] && (
								<ResourceContextMenu resource={parent}>
									<button
										className={'inline-flex gap-2 hover:underline  transition-all duration-200 hover:text-zinc-300'}
										onClick={() => handleResourceNavigation(parent)}
									>
										<File className={'shrink-0 inline-block'} />
										<p className={'text-left'}>{parent.Title}</p>
									</button>
								</ResourceContextMenu>
							)}
					</div>
				)
			})}
		</div>
	)
}

export function useDownloadToast({ resource }: { resource: ItslearningRestApiEntitiesPersonalCourseCourseResource }) {
	const { toast, dismiss } = useToast()

	return async () => {
		toast({
			title: 'Downloading...',
			description: resource.Title,
			duration: 3000,
		})
		await window.download.start(resource.ElementId, resource.Title)
		window.ipcRenderer.once('download:complete', (_, args) => {
			console.log(args)
			toast({
				title: 'Downloaded',
				description: resource.Title,
				duration: 3000,
				variant: 'success',
				onMouseDown: async () => {
					// if the user clicks on the toast, open the file
					// get the time that the mouse was pressed
					const mouseDownTime = Date.now()
					// wait for the mouse to be released
					await new Promise<void>((resolve) => {
						window.addEventListener(
							'mouseup',
							() => {
								resolve()
							},
							{ once: true }
						)
					})

					// if the mouse was pressed for less than 500ms, open the file
					if (Date.now() - mouseDownTime < 80) {
						console.log('Opening shell')
						await window.app.openShell(args)
						dismiss()
					} else {
						console.log('Not opening shell')
					}
				},
			})
		})
		window.ipcRenderer.once('download:error', (_, args) => {
			console.log(args)
			toast({
				title: 'Download error',
				description: resource.Title,
				duration: 3000,
				variant: 'destructive',
			})
		})
	}
}

export function ResourceContextMenu({
	resource,
	children,
}: {
	resource: ItslearningRestApiEntitiesPersonalCourseCourseResource
	children: React.ReactNode
}) {
	const navigateToResource = useNavigateToResource()

	const downloadToast = useDownloadToast({ resource })

	return (
		<ContextMenu>
			<ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuItem
					onClick={(e) => {
						e.stopPropagation()
						window.app.openExternal(resource.ContentUrl)
					}}
				>
					View content
				</ContextMenuItem>
				{isResourceFile(resource) && (
					<ContextMenuItem
						onClick={(e) => {
							e.stopPropagation()
							console.log(resource)
							// window.download.start(resource.ElementId, resource.Title)
							downloadToast()
						}}
					>
						Download
					</ContextMenuItem>
				)}
				{isSupportedResourceInApp(resource) && (
					<ContextMenuItem
						onClick={async (e) => {
							e.stopPropagation()
							// documents/:elementId for pdfs
							// office/:elementId for office documents
							navigateToResource(resource)
						}}
					>
						Open In App
					</ContextMenuItem>
				)}
			</ContextMenuContent>
		</ContextMenu>
	)
}
