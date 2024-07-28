import useGETcourseBasic from "@/queries/courses/useGETcourseBasic.ts";
import { useParams } from "react-router-dom";
import { cn, getRelativeTimeString } from "@/lib/utils.ts";
import { Label } from "@/components/ui/label";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowUpRightIcon } from "lucide-react";

export default function CourseInformation() {
	const params = useParams();
	const courseId = Number(params.id);

	const { data: course } = useGETcourseBasic(
		{
			courseId,
		},
		{
			suspense: true,
		},
	);

	const createSubjectDescriptionURL = new URL(
		`https://odin.sdu.dk/sitecore/index.php?a=searchfagbesk&bbcourseid=${course?.Code}`,
	).toString();

	return (
		<div className="my-2 mb-4 flex flex-col px-8 pt-6 pb-8">
			<div className="-mx-3 mb-6 md:flex">
				<div className="mb-6 px-3 md:mb-0 md:w-1/2">
					<Label
						className="mb-2 block text-xs font-bold uppercase tracking-wide text-grey-darker"
						htmlFor="course-name"
					>
						Course Name
					</Label>
					<p className="text-base text-grey-darker">{course?.Title}</p>
				</div>
				<div className="px-3 md:w-1/2">
					<Label
						className="mb-2 block text-xs font-bold uppercase tracking-wide text-grey-darker"
						htmlFor="course-code"
					>
						Course Code
					</Label>
					<p className="text-base text-grey-darker">{course?.Code}</p>
				</div>
			</div>
			<div className="-mx-3 mb-6 md:flex">
				<div className="mb-6 px-3 md:mb-0 md:w-1/2">
					<Label
						className="mb-2 block text-xs font-bold uppercase tracking-wide text-grey-darker"
						htmlFor="course-start-date"
					>
						Start Date
					</Label>
					<p className="text-base text-grey-darker">
						{new Date(course!.CreatedDateTimeUtc).toDateString()} (
						{getRelativeTimeString(new Date(course!.CreatedDateTimeUtc))})
					</p>
				</div>
				<div className="mb-6 px-3 md:mb-0 md:w-1/2">
					<Label
						className="mb-2 block text-xs font-bold uppercase tracking-wide text-grey-darker"
						htmlFor="course-subject-description"
					>
						Course Subject Description
					</Label>
					<a
						className="text-base text-grey-darker hover:underline inline-flex hover:cursor-pointer"
						onClick={() =>
							window.app.openExternal(createSubjectDescriptionURL, false)
						}
					>
						Open <ArrowUpRightIcon />
					</a>
				</div>
			</div>
			{/*<div className="-mx-3 mb-6 md:flex">
                <div className="mb-6 px-3 md:mb-0 md:w-1/2">
                    <Label className="mb-2 block text-xs font-bold uppercase tracking-wide text-grey-darker" htmlFor="course-teacher">
                        Teacher
                    </Label>
                    <p className="text-base text-grey-darker">{course?.teacher}</p>
                </div>
                <div className="px-3 md:w-1/2">
                    <Label className="mb-2 block text-xs font-bold uppercase tracking-wide text-grey-darker" htmlFor="course-description">
                        Description
                    </Label>
                    <p className="text-base text-grey-darker">{course?.description}</p>
                </div>
            </div>*/}
		</div>
	);
}
