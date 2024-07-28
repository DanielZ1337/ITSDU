import useGETcalendarEvents from "@/queries/calendar/useGETcalendarEvents";
import { Calendar } from "./calendar";

export default function Overview() {
	const fromDate = new Date();
	fromDate.setDate(fromDate.getDate() - 1);
	const { data, isLoading } = useGETcalendarEvents(
		{
			fromDate,
		},
		{
			keepPreviousData: true,
		},
	);

	if (data?.EntityArray) {
		data.EntityArray = data?.EntityArray.filter((event) => {
			const eventDate = new Date(event.ToDate);
			eventDate.setDate(eventDate.getDate() - 1);

			return eventDate.getDate() === fromDate.getDate();
		});
	}

	const events = data?.EntityArray.map((event) => {
		return {
			...event,
			FromDate: new Date(event.FromDate),
			ToDate: new Date(event.ToDate),
		};
	});

	return (
		<div className={"flex flex-1 h-full max-h-full overflow-hidden"}>
			<div className="p-4 flex flex-1 max-h-full overflow-hidden">
				<div
					className={"flex flex-col flex-1 gap-4 max-h-full overflow-hidden"}
				>
					{/* schedule for today */}
					<h1 className={"text-2xl font-bold"}>Your schedule for today</h1>
					<Calendar
						events={events}
						showHeader={false}
						showToolbar={false}
						isLoading={isLoading}
						defaultView="day"
						views={["day"]}
					/>
				</div>
				<div className={"flex flex-col flex-1 gap-4"}>
					{/* latest 3 announcements */}
					<h1 className={"text-2xl font-bold"}>Latest 3 announcements</h1>
					<div className={"flex flex-col gap-4"}>
						{/* <NotificationCards notifications={notifications} /> */}
					</div>
				</div>
			</div>
		</div>
	);
}
