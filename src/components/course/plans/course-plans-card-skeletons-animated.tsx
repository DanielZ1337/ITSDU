import { m, motion } from 'framer-motion';
import CoursePlansCardSkeletons from './course-plans-card-skeletons';

export function CoursePlansSkeletonsAnimated({ PageSize }: { PageSize?: number }) {
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
            className="mx-auto h-fit w-full flex flex-col gap-4"
        >
            <CoursePlansCardSkeletons count={PageSizeNormalized || 10} />
        </m.div>
    )
}