import { isSupportedResourceInApp, useNavigateToResource } from '@/types/api-types/extra/learning-tool-id-types'
import { ItslearningRestApiEntitiesElementLink } from '@/types/api-types/utils/Itslearning.RestApi.Entities.ElementLink'
import { ResourceContextMenu } from '../recursive-file-explorer'

export default function NotificationElement({ element }: { element: ItslearningRestApiEntitiesElementLink }) {
	const navigateToResource = useNavigateToResource()

	return (
		<ResourceContextMenu resource={element}>
			<button
				onClick={() => {
					if (isSupportedResourceInApp(element)) {
						navigateToResource(element)
					} else {
						window.app.openExternal(element.ContentUrl)
					}
				}}
				className='text-blue-500 transition-colors hover:text-blue-600 hover:underline'
			>
				{element.Title}
			</button>
		</ResourceContextMenu>
	)
}
