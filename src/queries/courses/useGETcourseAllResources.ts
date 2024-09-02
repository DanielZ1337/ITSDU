import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { getAccessToken } from '@/lib/utils.ts'
import { TanstackKeys } from '@/types/tanstack-keys'
import { GETcourseFolderResourcesApiUrl } from '@/types/api-types/courses/GETcourseFolderResources'
import { GETcourseRootResources, GETcourseRootResourcesApiUrl } from '@/types/api-types/courses/GETcourseRootResources'
import axios from 'axios'
import { ItsolutionsItslUtilsConstantsElementType } from '@/types/api-types/utils/Itsolutions.ItslUtils.Constants.ElementType'
import { ItslearningPlatformRestApiSdkCommonEntitiesLearningToolType } from '@/types/api-types/utils/Itslearning.Platform.RestApi.Sdk.Common.Entities.LearningToolType'
import { ItslearningRestApiEntitiesPersonalCourseCourseResource } from '@/types/api-types/utils/Itslearning.RestApi.Entities.Personal.Course.CourseResource'
import { isResourcePDFFromUrlOrElementType } from '@/types/api-types/extra/learning-tool-id-types'

export default function useGETcourseAllResources(
	courseId: number,
	queryConfig?: UseQueryOptions<
		ItslearningRestApiEntitiesPersonalCourseCourseResource[],
		Error,
		ItslearningRestApiEntitiesPersonalCourseCourseResource[],
		string[]
	>
) {
	return useQuery(
		[TanstackKeys.CourseAllResources, String(courseId)],
		async () => {
			return await getCourseAllResources(courseId)
		},
		{
			...queryConfig,
		}
	)
}

export async function getCourseAllResources(
	courseId: number
): Promise<ItslearningRestApiEntitiesPersonalCourseCourseResource[]> {
	const pdf_map = new Map<number, ItslearningRestApiEntitiesPersonalCourseCourseResource>()

	type GETcourseResourceParams = {
		courseId: number
		elementType?: ItsolutionsItslUtilsConstantsElementType
		learningToolType?: ItslearningPlatformRestApiSdkCommonEntitiesLearningToolType
	} & { folderId?: number }

	const getResourceData = async (
		params: GETcourseResourceParams
	): Promise<ItslearningRestApiEntitiesPersonalCourseCourseResource[]> => {
		const res = await axios.get(
			(params.folderId ? GETcourseFolderResourcesApiUrl : GETcourseRootResourcesApiUrl)({
				...params,
				folderId: params.folderId ?? 0, // Set folderId to 0 if it is undefined
			}),
			{
				params: {
					access_token: (await getAccessToken()) || '',
					...params,
				},
			}
		)

		if (res.status !== 200) throw new Error(res.statusText)

		const data = res.data as GETcourseRootResources
		const folders: ItslearningRestApiEntitiesPersonalCourseCourseResource[] = []

		for (const resource of data.Resources.EntityArray) {
			if (resource.ElementType === 'Folder') {
				folders.push(resource)
			} else if (isResourcePDFFromUrlOrElementType(resource)) {
				pdf_map.set(resource.ElementId, resource)
			}
		}

		return folders
	}

	const getCourseResources = async (params: GETcourseResourceParams) => {
		const folders = await getResourceData(params)

		// If no folders are found, stop recursion
		if (folders.length === 0) return

		const folderPromises = folders.map((folder) =>
			getCourseResources({
				...params,
				folderId: folder.ElementId,
			})
		)

		await Promise.all(folderPromises)
	}

	await getCourseResources({
		courseId,
		elementType: ItsolutionsItslUtilsConstantsElementType.Resources,
		learningToolType: ItslearningPlatformRestApiSdkCommonEntitiesLearningToolType.LearningResource,
	})

	// return all pdfs as an array
	return Array.from(pdf_map.values())
}
