import { Skeleton } from "@/components/ui/skeleton";
import { BsChatSquareTextFill, BsFileEarmarkFill } from "react-icons/bs";
import { Badge } from "../ui/badge";
import { LightbulletinBadgeButton } from "./lightbulletin-card";

export default function LightbulletinsForCourseLoader() {
	return (
		<div className={"gap-4 flex flex-col p-4"}>
			{[...Array(4).keys()]
				.map((i) => i + 1)
				.map((i) => (
					<div
						key={i}
						className="overflow-hidden rounded-md p-4 shadow-md bg-foreground/10 hover:shadow-lg"
					>
						<div className="flex items-center space-x-2">
							<Skeleton className="h-10 w-10 shrink-0 rounded-full bg-foreground/10" />
							<Skeleton className="h-6 w-2/4 rounded bg-foreground/20" />
						</div>
						<div className="mt-2 flex py-4 space-x-4">
							<div className="flex-1 py-1 space-y-4">
								<div className="space-y-2">
									<Skeleton className="h-4 w-3/4 rounded bg-foreground/20" />
									<div className="space-y-2">
										<Skeleton className="h-4 rounded bg-foreground/20" />
										<Skeleton className="h-4 w-5/6 rounded bg-foreground/20" />
										<Skeleton className="h-4 w-3/4 rounded bg-foreground/20" />
									</div>
								</div>
							</div>
						</div>
						<div className="mt-2 flex gap-4 truncate text-lg">
							<Skeleton>
								<LightbulletinBadgeButton>
									0 <BsChatSquareTextFill className={"mt-1"} />
								</LightbulletinBadgeButton>
							</Skeleton>
							<Skeleton>
								<LightbulletinBadgeButton>
									0 <BsFileEarmarkFill />
								</LightbulletinBadgeButton>
							</Skeleton>
						</div>
					</div>
				))}
		</div>
	);
}
