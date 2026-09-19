import { describe, expect, it } from "vitest";
import { parseCoursePlanDate, parseDateAndTime } from "../electron/utils/plan-dates";

describe("parseCoursePlanDate", () => {
	it("parses dd-MM-yyyy", () => {
		const d = parseCoursePlanDate("24-10-2023");
		expect(d?.getFullYear()).toBe(2023);
		expect(d?.getMonth()).toBe(9);
		expect(d?.getDate()).toBe(24);
	});
	it("returns null for missing or invalid input", () => {
		expect(parseCoursePlanDate(undefined)).toBeNull();
		expect(parseCoursePlanDate("not a date")).toBeNull();
	});
});

describe("parseDateAndTime", () => {
	it("parses a same-day time range", () => {
		const { from, to } = parseDateAndTime("10:00 – 12:00");
		expect(from?.getHours()).toBe(10);
		expect(to?.getHours()).toBe(12);
	});
	it("rolls an end time before the start to the next day", () => {
		const { from, to } = parseDateAndTime("23:00 – 01:00");
		expect(to!.getTime()).toBeGreaterThan(from!.getTime());
	});
	it("parses a multi-day range", () => {
		const { from, to } = parseDateAndTime("24. Oct 10:00 – 25. Oct 12:00");
		expect(from?.getDate()).toBe(24);
		expect(to?.getDate()).toBe(25);
	});
	it("returns nulls for unrecognised text", () => {
		expect(parseDateAndTime("whenever")).toEqual({ from: null, to: null });
	});
});
