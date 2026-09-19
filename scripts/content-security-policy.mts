// Production-only CSP (dev needs inline scripts for HMR). connect/img stay on https: because course content
// and API calls go to itslearning-owned hosts that vary per customer; tighten once measured.
// Only builds made with ITSLEARNING_MOCK_URL set (mock/e2e builds) also allow that origin.
export function buildContentSecurityPolicy(mockOrigin: string): string {
	return [
		"default-src 'self'",
		"script-src 'self' 'wasm-unsafe-eval'",
		"style-src 'self' 'unsafe-inline' https://rsms.me",
		`img-src 'self' data: blob: https: itsl-itslearning-file: ${mockOrigin}`.trim(),
		"font-src 'self' data: https://rsms.me",
		`connect-src 'self' blob: https: ${mockOrigin}`.trim(),
		"media-src 'self' blob: https:",
		"worker-src 'self' blob:",
		"frame-src https: blob:",
		"object-src 'none'",
		"base-uri 'self'",
		// Office documents load through a POST-to-iframe (see office-documents.tsx) whose target is
		// scraped straight out of Microsoft's own WOPI viewer markup (form.action) — a Microsoft/
		// itslearning-tenant host that varies per institution, so it can't be pinned to a fixed list.
		"form-action 'self' https:",
	].join("; ");
}
