import { describe, expect, it } from "vitest";
import { buildContentSecurityPolicy } from "../scripts/content-security-policy.mts";

// pdf.js fetches PDF bytes from the blob: URL created for cached/downloaded resources; that fetch is
// governed by connect-src, not img-src. Without blob: there, Chromium blocks it in production builds
// (dev has no CSP at all) and pdf.js reports "Unexpected server response (0)".
describe("buildContentSecurityPolicy", () => {
	it("allows connecting to blob: URLs (PDF viewing)", () => {
		const csp = buildContentSecurityPolicy("");
		const connectSrc = csp.split("; ").find((d) => d.startsWith("connect-src"));
		expect(connectSrc?.split(" ")).toContain("blob:");
	});

	it("includes the mock origin when provided, for e2e/mock builds", () => {
		const csp = buildContentSecurityPolicy("http://localhost:4899");
		expect(csp).toContain("http://localhost:4899");
	});

	it("omits a trailing space in directives when no mock origin is set", () => {
		const csp = buildContentSecurityPolicy("");
		for (const directive of csp.split("; ")) {
			expect(directive).not.toMatch(/\s$/);
		}
	});

	// office-documents.tsx submits a <form> to a Microsoft/itslearning WOPI URL scraped from their own
	// viewer markup (varies per institution). form-action 'none' blocks that outright.
	it("allows form submissions to https hosts (Office document viewing)", () => {
		const csp = buildContentSecurityPolicy("");
		const formAction = csp.split("; ").find((d) => d.startsWith("form-action"));
		expect(formAction?.split(" ")).toContain("https:");
	});
});
