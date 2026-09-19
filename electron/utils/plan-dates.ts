import { addDays, format, isBefore, isValid, parse } from "date-fns";

/** "24-10-2023" (as shown on course plan topics) -> Date, or null when missing/invalid. */
export function parseCoursePlanDate(value: string | undefined): Date | null {
	if (!value) return null;
	const parsed = parse(value, "dd-MM-yyyy", new Date());
	return isValid(parsed) ? parsed : null;
}

export function parseDateAndTime(dateString: string) {
	const dateRegex =
		/(\d{1,2}\. [a-zA-Z]+) (\d{1,2}:\d{2}) – (\d{1,2}\. [a-zA-Z]+) (\d{1,2}:\d{2})/;
	const timeRegex = /(\d{1,2}:\d{2}) – (\d{1,2}:\d{2})/;

	const dateMatch = dateString.match(dateRegex);
	const timeMatch = dateString.match(timeRegex);
	const parseAt = (value: string) => parse(value, "dd. MMM HH:mm", new Date());

	let from: Date | null = null;
	let to: Date | null = null;

	if (dateMatch) {
		from = parse(dateMatch[1], "dd. MMM", new Date());
		to = parse(dateMatch[3], "dd. MMM", new Date());
		if (!isValid(to)) to = addDays(to, 1);
	} else if (timeMatch) {
		const currentDay = format(new Date(), "dd. MMM");
		from = parseAt(`${currentDay} ${timeMatch[1]}`);
		to = parseAt(`${currentDay} ${timeMatch[2]}`);
		if (!isValid(to) || isBefore(to, from)) to = addDays(to, 1);
	}

	return { from, to };
}
