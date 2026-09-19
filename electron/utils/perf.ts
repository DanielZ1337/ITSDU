/** Startup timing marks, printed when ITSDU_PERF=1 (ms since the main process started). */
const enabled = process.env.ITSDU_PERF === "1";

export function mark(name: string) {
	if (!enabled) return;
	console.log(`[perf] ${name} +${Math.round(process.uptime() * 1000)}ms`);
}
