/**
 * Mock mode points the whole app at a local itslearning mock (see the itslearning-mock-api repo)
 * instead of the real site. Enable it with `npm run dev:mock`, or by setting
 * ITSLEARNING_MOCK_URL (process env) / VITE_ITSLEARNING_MOCK_URL (.env) to e.g. http://localhost:4873.
 */
export const MOCK_URL: string | undefined =
	(
		process.env.ITSLEARNING_MOCK_URL ||
		import.meta.env.VITE_ITSLEARNING_MOCK_URL
	)?.replace(/\/+$/, "") || undefined;

export const isMockMode = () => MOCK_URL !== undefined;

console.log(
	isMockMode()
		? `[mock-mode] ON, using ${MOCK_URL}`
		: "[mock-mode] off, using the real itslearning site",
);

/** Mock sessions use separate stores so they never overwrite real (dev) tokens or site settings. */
export const storeName = (base: string) =>
	isMockMode() ? `${base}-mock` : base;
