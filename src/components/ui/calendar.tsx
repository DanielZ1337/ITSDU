import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import * as React from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	...props
}: CalendarProps) {
	const defaults = getDefaultClassNames();

	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			className={cn("p-3", className)}
			classNames={{
				root: cn("w-fit", defaults.root),
				months: cn("relative flex flex-col gap-4 sm:flex-row", defaults.months),
				month: cn("flex w-full flex-col gap-4", defaults.month),
				month_caption: cn(
					"flex h-7 w-full items-center justify-center",
					defaults.month_caption,
				),
				caption_label: cn("text-sm font-medium", defaults.caption_label),
				nav: cn(
					"absolute inset-x-0 top-0 flex w-full items-center justify-between",
					defaults.nav,
				),
				button_previous: cn(
					buttonVariants({ variant: "outline" }),
					"h-7 w-7 select-none bg-transparent p-0 opacity-50 hover:opacity-100",
					defaults.button_previous,
				),
				button_next: cn(
					buttonVariants({ variant: "outline" }),
					"h-7 w-7 select-none bg-transparent p-0 opacity-50 hover:opacity-100",
					defaults.button_next,
				),
				month_grid: cn("w-full border-collapse", defaults.month_grid),
				weekdays: cn("flex", defaults.weekdays),
				weekday: cn(
					"w-8 rounded-md text-[0.8rem] font-normal text-muted-foreground",
					defaults.weekday,
				),
				week: cn("mt-2 flex w-full", defaults.week),
				day: cn(
					"relative p-0 text-center text-sm focus-within:relative focus-within:z-20 has-aria-[selected]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
					props.mode === "range"
						? "has-[.day-range-end]:rounded-r-md has-[.day-range-start]:rounded-l-md first:has-aria-[selected]:rounded-l-md last:has-aria-[selected]:rounded-r-md"
						: "has-aria-[selected]:rounded-md",
					defaults.day,
				),
				day_button: cn(
					buttonVariants({ variant: "ghost" }),
					"h-8 w-8 p-0 font-normal aria-selected:opacity-100",
					defaults.day_button,
				),
				range_start: cn("day-range-start", defaults.range_start),
				range_end: cn("day-range-end", defaults.range_end),
				range_middle: cn(
					"aria-selected:bg-accent aria-selected:text-accent-foreground",
					defaults.range_middle,
				),
				selected: cn(
					"bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
					defaults.selected,
				),
				today: cn("bg-accent text-accent-foreground", defaults.today),
				outside: cn(
					"day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
					defaults.outside,
				),
				disabled: cn("text-muted-foreground opacity-50", defaults.disabled),
				hidden: cn("invisible", defaults.hidden),
				...classNames,
			}}
			components={{
				Chevron: ({ orientation }) =>
					orientation === "left" ? (
						<ChevronLeftIcon className="h-4 w-4" />
					) : (
						<ChevronRightIcon className="h-4 w-4" />
					),
			}}
			{...props}
		/>
	);
}
Calendar.displayName = "Calendar";

export { Calendar };
