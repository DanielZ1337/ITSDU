import { ITSLEARNING_URL } from "../services/itslearning/itslearning";

/**
 * Development only: the Vite dev server origin is not allowed by itslearning's CORS policy, so the renderer
 * talks to http://localhost:8080, which forwards to the configured itslearning (or mock) site.
 */
export async function startProxyDevServer() {
	const express = await import("express").then((m) => m.default);
	const cors = await import("cors").then((m) => m.default);
	const { createProxyMiddleware } = await import("http-proxy-middleware");

	const proxy = express();
	proxy.use(cors());
	proxy.use(
		createProxyMiddleware({
			target: ITSLEARNING_URL(),
			changeOrigin: true,
			secure: false,
			on: {
				proxyReq: (_proxyReq, req) => {
					console.log("Sending Request to the Target:", req.method, req.url);
				},
			},
		}),
	);

	// Loopback only: never expose the proxy to the local network.
	const server = proxy.listen(8080, "127.0.0.1", () => {
		console.log("API Proxy Server with CORS enabled is listening on port 8080");
	});
	server.on("error", (error: NodeJS.ErrnoException) => {
		if (error.code !== "EADDRINUSE") throw error;
		console.warn("Port 8080 is already in use; reusing the running API proxy.");
	});
}
