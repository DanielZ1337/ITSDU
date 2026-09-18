/**
 * Mock mode points the whole app at a local itslearning mock (see the itslearning-mock-api repo)
 * instead of the real site. Enable it by setting ITSLEARNING_MOCK_URL, e.g. via `npm run dev:mock`.
 */
export const MOCK_URL: string | undefined =
	process.env.ITSLEARNING_MOCK_URL?.replace(/\/+$/, "") || undefined;

export const isMockMode = () => MOCK_URL !== undefined;

/** Mock sessions use separate stores so they never overwrite real (dev) tokens or site settings. */
export const storeName = (base: string) =>
	isMockMode() ? `${base}-mock` : base;
