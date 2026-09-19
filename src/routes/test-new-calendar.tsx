import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import WeekHeaderDay from "@/components/calendar/week-header-day";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	CalendarProvider,
	useCalendarContext,
} from "@/contexts/calendar-context";
import { cn } from "@/lib/utils";

export default function TestNewCalender() {
	return (
		<CalendarProvider>
			<div className="p-8">
				<CalendarGrid />
				<CalendarHeader />
				<ViewDropdown />
				<DatePagination />
			</div>
		</CalendarProvider>
	);
}

function ViewDropdown() {
	const views = ["month", "week", "day"] as const;
	const [view, setView] = useState<(typeof views)[number]>(views[1]);
	return (
		<Select
			value={view}
			onValueChange={(value: (typeof views)[number]) => setView(value)}
		>
			<SelectTrigger className="w-36 capitalize">
				<SelectValue placeholder="Select a view" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{views.map((view) => (
						<SelectItem key={view} value={view} className="capitalize">
							{view} view
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}

function DatePagination() {
	const { selectedDate, setSelectedDate, changeDateByDays } =
		useCalendarContext();
	const handleDateChange = (newDate: Date) => {
		setSelectedDate(newDate);
	};
	const isToday = selectedDate.toDateString() === new Date().toDateString();
	const isSameYear = selectedDate.getFullYear() === new Date().getFullYear();

	return (
		<div
			// className={buttonVariants({ variant: "outline" })}
			className="flex items-center justify-center border border-border w-fit h-fit rounded-md"
		>
			<Button
				variant="outline"
				className="active:scale-100 flex items-center rounded-r-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 outline-none focus-visible:bg-foreground/10"
				onClick={() => changeDateByDays(-1)}
			>
				<ChevronLeft />
			</Button>
			<Button
				variant="outline"
				className="truncate w-40 active:scale-100 flex items-center rounded-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 outline-none focus-visible:bg-foreground/10"
				onClick={() => handleDateChange(new Date())}
			>
				<span>
					{isToday
						? "Today"
						: isSameYear
							? selectedDate.toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
								})
							: selectedDate.toLocaleDateString("en-US", {
									weekday: "short",
									month: "short",
									day: "numeric",
									year: "numeric",
								})}
				</span>
			</Button>
			<Button
				variant="outline"
				className="active:scale-100 flex items-center rounded-l-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 outline-none focus-visible:bg-foreground/10"
				onClick={() => changeDateByDays(1)}
			>
				<ChevronRight />
			</Button>
		</div>
	);
}

function CalendarHeader() {
	const { selectedDate, setSelectedDate } = useCalendarContext();

	const currentWeekDays = [];
	const firstDay = new Date(selectedDate);
	firstDay.setDate(selectedDate.getDate() - selectedDate.getDay());
	for (let i = 0; i < 7; i++) {
		const day = new Date(firstDay);
		day.setDate(firstDay.getDate() + i);
		currentWeekDays.push(day);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					{selectedDate.toLocaleDateString("en-US", {
						month: "long",
						year: "numeric",
					})}
				</CardTitle>
				<CardDescription>Card Description</CardDescription>
				<div className="flex bg-foreground/2 shadow-md justify-start md:justify-center rounded-lg overflow-x-scroll mx-auto py-4 px-2 md:mx-12">
					{currentWeekDays.map((day) => (
						<WeekHeaderDay
							onClick={() => setSelectedDate(day)}
							key={day.toDateString()}
							day={day.toLocaleDateString("en-US", {
								weekday: "short",
							})}
							date={day.toLocaleDateString("en-US", {
								day: "numeric",
							})}
							isActive={selectedDate.toDateString() === day.toDateString()}
						/>
					))}
				</div>
			</CardHeader>
			<CardContent>
				<p>Card Content</p>
			</CardContent>
			<CardFooter>
				<p>Card Footer</p>
			</CardFooter>
		</Card>
	);
}

const CalendarGrid = () => {
	const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
	const { selectedDate } = useCalendarContext();

	const getDaysInMonth = (date: Date) => {
		const year = date.getFullYear();
		const month = date.getMonth();
		const daysInMonth = new Date(year, month + 1, 0).getDate();
		return daysInMonth;
	};

	const getFirstDayOfMonth = (date: Date) => {
		const year = date.getFullYear();
		const month = date.getMonth();
		const firstDay = new Date(year, month, 1);
		return firstDay.getDay();
	};

	const daysInMonth = getDaysInMonth(selectedDate);
	const firstDayOfMonth = getFirstDayOfMonth(selectedDate);

	const renderDays = () => {
		const days = [];
		const totalCells = 42; // 6 rows x 7 columns

		// Add days from previous month
		const prevMonthDays = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
		const prevMonthLastDay = new Date(
			selectedDate.getFullYear(),
			selectedDate.getMonth(),
			0,
		).getDate();
		for (
			let i = prevMonthLastDay - prevMonthDays + 1;
			i <= prevMonthLastDay;
			i++
		) {
			days.push(
				<td key={`prev-${i}`} className="text-gray-400 p-2">
					{i}
				</td>,
			);
		}

		// Add days from current month
		for (let i = 1; i <= daysInMonth; i++) {
			days.push(
				<td key={`current-${i}`} className="bg-foreground/2 rounded-md p-2">
					{i}
				</td>,
			);
		}

		const remainingCells = totalCells - days.length;
		for (let i = 1; i <= remainingCells; i++) {
			days.push(
				<td key={`next-${i}`} className="text-gray-400 p-2">
					{i}
				</td>,
			);
		}

		// Create rows for weeks
		const weeks = [];
		for (let i = 0; i < days.length; i += 7) {
			weeks.push(
				<tr key={`week-${i}`} className="h-20">
					{days.slice(i, i + 7)}
				</tr>,
			);
		}

		return weeks;
	};

	return (
		<div className="rounded-md shadow w-full h-full p-3">
			<table className="w-full">
				<thead>
					<tr>
						{weekDays.map((day) => (
							<th
								key={day}
								className={cn(
									"p-2 border-r h-10 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 xl:text-sm text-xs",
									day === "Sun" && "border-l",
								)}
							>
								<span className="xl:block lg:block md:block sm:block hidden">
									{day}
								</span>
								<span className="xl:hidden lg:hidden md:hidden sm:hidden block">
									{day.slice(0, 2)}
								</span>
							</th>
						))}
					</tr>
				</thead>
				<tbody>{renderDays()}</tbody>
			</table>
		</div>
	);
};
