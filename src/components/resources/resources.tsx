import useGETcourseRootResources from '@/queries/courses/useGETcourseRootResources.ts'
import RecursiveFileExplorer, { ResourceContextMenu, useDownloadToast } from '@/components/recursive-file-explorer.tsx'
// eslint-disable-next-line no-redeclare
import { File, FolderClosedIcon, FolderOpenIcon, MoreHorizontal } from 'lucide-react'
import { Suspense, useCallback, useState } from 'react'
import ErrorPage from '@/error-page.tsx'
import { ErrorBoundary } from 'react-error-boundary'
import { useToast } from '@/components/ui/use-toast.ts'
import ReactLoading from 'react-loading'
import '@/styles/3-dots-loading.css'
import { ItsolutionsItslUtilsConstantsElementType } from '@/types/api-types/utils/Itsolutions.ItslUtils.Constants.ElementType.ts'
import {
	isResourceFile,
	isSupportedResourceInApp,
	useNavigateToResource,
} from '@/types/api-types/extra/learning-tool-id-types'
import type { ItslearningRestApiEntitiesPersonalCourseCourseResource } from '@/types/api-types/utils/Itslearning.RestApi.Entities.Personal.Course.CourseResource'
import { useNavigate } from 'react-router-dom'

type NestedItem = {
	[key: string]: boolean
}

export default function Resources({ courseId }: { courseId: number }) {
	const { data } = useGETcourseRootResources(
		{
			courseId: courseId,
		},
		{
			suspense: true,
		}
	)

	const { toast, dismiss } = useToast()

	const [showNested, setShowNested] = useState<NestedItem>({})

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
		<div className={'block flex-wrap p-2'}>
			{data!.Resources.EntityArray.map((parent) => {
				return (
					<div
						key={parent.ElementId}
						className={''}
					>
						{/* rendering folders */}
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
								<span className={'ml-2 text-left'}>{parent.Title}</span>
							</button>
						)}
						{/* rendering files */}
						{/*@ts-ignore documentation for itslearning is wrong, so this gives a wrong type*/}
						{parent.ElementType !==
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
								{showNested[parent.ElementId] && parent && (
									<RecursiveFileExplorer
										isOpen={showNested[parent.ElementId]}
										courseId={courseId}
										folderId={parent.ElementId}
									/>
								)}
							</Suspense>
						</ErrorBoundary>
					</div>
				)
			})}
		</div>
	)
}
