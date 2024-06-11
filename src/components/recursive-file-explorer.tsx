import { Suspense, useCallback, useState } from 'react'
// eslint-disable-next-line no-redeclare
import { File, FolderClosedIcon, FolderOpenIcon } from 'lucide-react'
import useGETcourseFolderResources from '@/queries/courses/useGETcourseFolderResources.ts'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorPage from '@/error-page.tsx'
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
import { toast as sonnerToast } from 'sonner'
import { Button } from './ui/button'
import type { ItslearningRestApiEntitiesElementLink } from '@/types/api-types/utils/Itslearning.RestApi.Entities.ElementLink'
import { useSearch } from './ui/search-input'
import { Highlight } from './ui/hightlight'
import { getFormattedSize } from '@/lib/utils'

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

	const { data, isLoading } = useGETcourseFolderResources({
		courseId: courseId,
		folderId: folderId,
	})

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

	const hasResources = (data?.Resources?.EntityArray?.length ?? 0) > 0

	const { value: searchValue } = useSearch()

	return (
		<div className={'ml-2 pl-3 my-2 border-l-2 border-border py-1'}>
			{!isLoading && !hasResources && <span className={'text-zinc-400'}>No resources found</span>}
			{isLoading && (
				<ReactLoading
					className={'loading-dots -ml-0.5 -mt-2'}
					height={30}
					width={30}
					type={'bubbles'}
				/>
			)}
			{!isLoading &&
				data!.Resources.EntityArray.map((parent) => {
					return (
						<div
							key={parent.ElementId}
							className='h-hit flex items-center justify-start gap-2 py-1'
						>
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
											className={'inline-flex justify-center items-start pr-2 flex-col'}
											onClick={() => toggleNested(parent.ElementId)}
										>
											<span className={'text-left flex gap-2'}>
												{showNested[parent.ElementId] ? (
													<FolderOpenIcon className={'shrink-0'} />
												) : (
													<FolderClosedIcon className={'shrink-0'} />
												)}

												<Highlight
													highlight={searchValue}
													text={parent.Title}
												/>
											</span>
											{showNested[parent.ElementId] && (
												<RecursiveFileExplorer
													isOpen={showNested[parent.ElementId]}
													courseId={courseId}
													folderId={parent.ElementId}
												/>
											)}
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
											className={
												'inline-flex gap-2 hover:underline  transition-all duration-200 hover:text-zinc-300 justify-center items-center pr-2'
											}
											onClick={() => handleResourceNavigation(parent)}
										>
											<File className={'shrink-0 inline-block'} />
											<p className={'text-left'}>
												<Highlight
													highlight={searchValue}
													text={parent.Title}
												/>
											</p>
										</button>
									</ResourceContextMenu>
								)}
						</div>
					)
				})}
		</div>
	)
}

export function useDownloadToast({
	resource,
}: {
	resource?: ItslearningRestApiEntitiesPersonalCourseCourseResource | ItslearningRestApiEntitiesElementLink
} = {}) {
	return {
		async downloadToast(resourceArg = resource) {
			if (!resourceArg) return
			const toastId = sonnerToast.loading(`Downloading ${resourceArg.Title}...`)
			const { path, size } = await window.download.start(resourceArg.ElementId, resourceArg.Title)
			sonnerToast.success(`Downloaded ${resourceArg.Title}`, {
				id: toastId,
				description: `${path} (${getFormattedSize(size)})`,
				richColors: true,
				duration: 2000,
				dismissible: true,
				action: {
					label: 'Open',
					onClick: () => {
						window.app.openShell(path)
					},
				},
			})
		},
	}
}

export function ResourceContextMenu({
	resource,
	children,
	asChild = true,
}: {
	resource: ItslearningRestApiEntitiesPersonalCourseCourseResource | ItslearningRestApiEntitiesElementLink
	children: React.ReactNode
	asChild?: boolean
}) {
	const navigateToResource = useNavigateToResource()

	const { downloadToast } = useDownloadToast({ resource })

	return (
		<ContextMenu>
			<ContextMenuTrigger asChild={asChild}>{children}</ContextMenuTrigger>
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
