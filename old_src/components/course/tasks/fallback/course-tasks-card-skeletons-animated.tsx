import { m } from 'framer-motion'
import CourseTasksCardSkeletons from './course-tasks-card-skeletons'

export function CourseTasksSkeletonsAnimated({ PageSize }: { PageSize?: number }) {
	let PageSizeNormalized

	if (PageSize) {
		if (PageSize > 10 || PageSize < 1) {
			PageSizeNormalized = 10
		}
	}

	return (
		<m.div
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 20 }}
			transition={{ duration: 0.2 }}
			className='mx-auto grid h-fit w-full grid-cols-1 gap-4 lg:grid-cols-2'
		>
			<CourseTasksCardSkeletons count={PageSizeNormalized ?? 10} />
		</m.div>
	)
}
