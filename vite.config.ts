import { defineConfig } from 'vite'
import path from 'node:path'
// import electron from 'vite-plugin-electron/simple'
import electron from 'vite-plugin-electron'
import react from '@vitejs/plugin-react'
import jotaiDebugLabel from 'jotai/babel/plugin-debug-label'
import jotaiReactRefresh from 'jotai/babel/plugin-react-refresh'
import babelReactPlugin from 'babel-plugin-react-compiler'

const excludedPaths = [
	//'src/main.tsx',
	'src/lib',
	//'src/queries',
	'src/types',
	//'src/components/scroll-shadow.tsx',
	//'src/components/titlebar/titlebar-search.tsx',
	// 'node_modules/react-loading',
	// 'node_modules/.vite/deps/react-loading.js',
	// 'react-loading',
]

function isExcluded(filename: string) {
	const resolvedFilename = path.resolve(__dirname, filename)
	return excludedPaths.some((excludedPath) => {
		const resolvedExcludedPath = path.resolve(excludedPath)
		return resolvedFilename.includes(resolvedExcludedPath)
	})
}

const ReactCompilerConfig = {
	compilationMode: 'all',
	sources: (filename: string) => {
		// return (
		// 	filename.indexOf('src') !== -1 &&
		// 	filename !== path.resolve(__dirname, 'src/main.tsx') &&
		// 	filename !== path.resolve(__dirname, 'src/lib/routes.tsx') &&
		// 	!filename.includes('src\\lib') &&
		// 	!filename.includes('src\\queries') &&
		// 	!filename.includes('src\\types') &&
		// 	!filename.includes('src\\components\\scroll-shadow.tsx') &&
		// 	!filename.includes('src\\components\\titlebar\\titlebar-search.tsx')
		// )

		return filename.indexOf('src') !== -1 && !isExcluded(filename)
	},
}

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		outDir: 'dist',
		emptyOutDir: true,
		sourcemap: true,
		target: 'esnext',
		minify: 'esbuild',
		rollupOptions: {
			input: {
				main: path.resolve(__dirname, 'index.html'),
				login: path.resolve(__dirname, 'login.html'),
			},
		},
	},
	plugins: [
		react({
			babel: {
				plugins: [[babelReactPlugin, ReactCompilerConfig], jotaiDebugLabel, jotaiReactRefresh],
			},
		}),
		electron([
			{
				entry: 'electron/main.ts',
			},
			{
				entry: 'electron/preload.ts',
				onstart({ reload }) {
					// Notify the Renderer process to reload the page when the Preload scripts build is complete,
					// instead of restarting the entire Electron App.
					reload()
				},
			},
			{
				entry: 'electron/login_preload.ts',
				onstart({ reload }) {
					// Notify the Renderer process to reload the page when the Preload scripts build is complete,
					// instead of restarting the entire Electron App.
					reload()
				},
			},
		]),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
})
