import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron/simple'
import renderer from 'vite-plugin-electron-renderer'

// https://vitejs.dev/config/
export default defineConfig((env) => {
	const quiet = process.env.VITE_QUIET === '1'
	const logLevel = quiet ? 'silent' : 'info'
	const clearScreen = !quiet

	return {
		// optimizeDeps: {
		// Exclude vuetify since it has an issue with vite dev - TypeError: makeVExpansionPanelTextProps is not a function - the makeVExpansionPanelTextProps is used before it is defined
		// exclude: ['vuetify'],
		// },
		logLevel,
		clearScreen,
		publicDir: 'public',
		plugins: [
			vue(),
			electron({
				main: {
					// Shortcut of `build.lib.entry`.
					entry: 'electron/main.ts',
					vite: { logLevel, clearScreen },

					// https://github.com/electron/electron/issues/41614#issuecomment-2942630728
					onstart: async ({ startup }) => {
						const originalStderrWrite = process.stderr.write.bind(process.stderr)

						// Override stderr.write to filter the error
						process.stderr.write = function(
							chunk: any,
							encoding?: any,
							callback?: any,
						) {
							const message = chunk.toString()
							if (!/ERROR: The process "\d+" not found/.test(message)) {
								return originalStderrWrite(chunk, encoding, callback)
							}
							// Silently ignore the filtered message
							if (typeof callback === 'function') callback()
							return true
						} as any

						await startup(undefined, {
							stdio: ['inherit', 'inherit', 'pipe', 'ipc'],
						})
						const elec = (process as unknown as {
							electronApp: any
						}).electronApp
						elec.stderr.addListener('data', (data: Buffer) => {
							const message = data.toString()
							if (!/"code":-32601/.test(message)) {
								console.error(message)
							}
						})
					},
				},
				preload: {
					// Shortcut of `build.rollupOptions.input`.
					input: path.join(__dirname, 'electron/preload.ts'),
					vite: { logLevel, clearScreen },
				},
			}),
			renderer(),
		],
		// build: {
		// rollupOptions: { external: ['electron'] },
		// commonjsOptions: { transformMixedEsModules: true },
		// },
		resolve: {
			alias: {
				'vuetify/labs/VNumberInput': path.resolve(
					__dirname,
					'node_modules/vuetify/lib/components/VNumberInput/index.js',
				),
				'vuetify/labs/VTimePicker': path.resolve(
					__dirname,
					'node_modules/vuetify/lib/components/VTimePicker/index.js',
				),
			},
		},
	}
})
