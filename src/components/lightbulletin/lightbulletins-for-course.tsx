import LightbulletinCard from "@/components/lightbulletin/lightbulletin-card.tsx";
import useGETlightbulletinsForCourse from "@/queries/lightbulletin-course/useGETlightbulletinsForCourse.ts";
import { addDays } from "date-fns";
import * as linkify from "linkifyjs";
import { useState } from "react";
import { DatePickerWithRange } from "../ui/date-range-picker";

export default function LightbulletinsForCourse({
	courseId,
}: {
	courseId: number;
}) {
	const { data } = useGETlightbulletinsForCourse(
		{
			courseId: courseId,
		},
		{
			suspense: true,
		},
	);

	const sortedLightbulletins = data!.EntityArray.sort((a, b) => {
		return (
			new Date(b.PublishedDate).getTime() - new Date(a.PublishedDate).getTime()
		);
	});

	// const [dateRange, setDateRange] = useState<
	//   | {
	//       from: Date | undefined;
	//       to: Date | undefined;
	//     }
	//   | undefined
	// >(undefined);

	// const dateRangedLightbulletins = sortedLightbulletins.filter((bulletin) => {
	//   if (dateRange) {
	//     const date = new Date(bulletin.PublishedDate);
	//     return (
	//       date >= dateRange?.from &&
	//       date <= dateRange?.to &&
	//       dateRange.from !== dateRange.to
	//     );
	//   }
	//   return true;
	// });

	return (
		<div className={"grid grid-cols-1 gap-6 p-4"}>
			{/* <DatePickerWithRange
        onDateChange={(date) => {
          setDateRange({
            from: date.from,
            to: date.to,
          });
        }}
        className={"w-full"}
      /> */}
			{sortedLightbulletins?.map((bulletin, idx) => {
				// find the date of the previous bulletin and compare it to the current one. When the month is different make a new header
				const previousBulletin = sortedLightbulletins[idx - 1];
				const hasNextBulletin = previousBulletin !== undefined;
				const previousBulletinDate = hasNextBulletin
					? new Date(previousBulletin.PublishedDate)
					: null;
				const currentBulletinDate = new Date(bulletin.PublishedDate);
				const shouldMakeNewHeader =
					previousBulletinDate === null ||
					previousBulletinDate.getMonth() !== currentBulletinDate.getMonth();
				const showYear =
					currentBulletinDate.getFullYear() !== new Date().getFullYear();

				return (
					<div key={bulletin.LightBulletinId}>
						{shouldMakeNewHeader && hasNextBulletin && (
							<div className={"flex items-center justify-center pb-6"}>
								<div
									className={"h-[1px] w-full bg-foreground/20 rounded-full"}
								/>
								<div className={"bg-foreground/5 rounded-md px-4 py-1 mx-4"}>
									<div
										className={
											"text-xs font-medium text-foreground/50 text-nowrap"
										}
									>
										{currentBulletinDate.toLocaleString("default", {
											month: "long",
											year: showYear ? "numeric" : undefined,
										})}
									</div>
								</div>
								<div
									className={"h-[1px] w-full bg-foreground/20 rounded-full"}
								/>
							</div>
						)}
						<LightbulletinCard
							links={linkify.find(bulletin.Text)}
							bulletin={bulletin}
						/>
					</div>
				);
			})}
		</div>
	);
}
