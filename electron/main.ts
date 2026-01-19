import { app, BrowserWindow, clipboard, ipcMain } from 'electron'
import { readFile, stat } from 'fs/promises'
// @ts-ignore
import { load as loadYaml } from 'js-yaml'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import defaultYamlForm from '../public/forms/empty.yml?raw'
import { parseEnvParams } from './resolvers/env-resolver.ts'
import { getEspansoEnvVars } from './resolvers/espanso-resolver.ts'
import {
	getFormFilePath,
	getFormFilePathReal, getTimingOption,
	parseFormConfig,
} from './resolvers/form-resolver.ts'
import { jsonStringifySafe } from './utils'

// --- Constants & Path Setup ---
const __dirname = path.dirname(fileURLToPath(import.meta.url))
process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const FORM_CONFIG = process.env['FORM_CONFIG'] || ''

// Timing Options (--show-timing argument):
// 1. 'skip-flash' (Default)
// 2. 'immediate': Show instantly in constructor. Fastest, but high risk of white flash.
// 3. 'ready': Wait until meta data (size/pos) is loaded to show. Safest but slowest.
export const SHOW_TIMING = process.env['SHOW_TIMING'] || 'skip-flash'

const args = process.argv.slice(1)

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
	? path.join(process.env.APP_ROOT, 'public')
	: RENDERER_DIST

let win: BrowserWindow | null

/**
 * Handles all heavy data loading: Env parsing, File I/O, Templating.
 * This effectively runs in "parallel" (concurrently) with window creation.
 */
async function loadAppData() {
	// await new Promise((resolve) => setTimeout(resolve, 5000))

	const espansoPromise = getEspansoEnvVars().catch((err) => {
		console.warn('Failed to load Espanso env:', err)
		return null
	})

	const formFilePath = getFormFilePath(args, '') || FORM_CONFIG

	const needsTemplating = formFilePath.includes('{{')
	const templaterPromise = needsTemplating
		? import('../src/templater/useTemplater.ts')
		: Promise.resolve(null)

	let envParams = parseEnvParams(args, {
		...process.env,
		EDF_EXECUTABLE: app.getPath('exe'),
		EDF_INSTALLATION_DIR: path.dirname(app.getPath('exe')),
		EDF_RESOURCES: process.env.VITE_PUBLIC,
		EDF_FORMS: process.env.VITE_PUBLIC + '/forms',
	})

	const espansoEnv = await espansoPromise
	if (espansoEnv) {
		envParams = { ...envParams, ...espansoEnv }
	}

	let formFilePathRendered = formFilePath

	const templaterModule = await templaterPromise

	if (templaterModule) {
		const { useTemplater } = templaterModule
		const { render } = useTemplater()

		formFilePathRendered = render(formFilePath, {
			env: envParams,
			clipboard: clipboard.readText(),
		})
	}

	envParams = {
		...envParams,
		EDF_FORM_CONFIG_PATH: formFilePath,
		EDF_FORM_CONFIG_PATH_RENDERED: formFilePathRendered,
		EDF_FORM_CONFIG_PATH_REAL: getFormFilePathReal(formFilePathRendered, ''),
	}

	envParams = {
		...envParams,
		// deprecated, will be removed in future versions
		APP_EXECUTABLE: envParams.EDF_EXECUTABLE,
		APP_INSTALLATION_DIR: envParams.EDF_INSTALLATION_DIR,
		APP_PUBLIC: envParams.EDF_RESOURCES,
		FORM_CONFIG_PATH: envParams.EDF_FORM_CONFIG_PATH,
		FORM_CONFIG_PATH_REAL: envParams.EDF_FORM_CONFIG_PATH_REAL,
	}

	const formFileContent = parseFormConfig(
		formFilePathRendered,
		loadYaml(defaultYamlForm),
	)

	return {
		formFileContent,
		envParams,
		meta: formFileContent.meta,
	}
}

type AppData = Awaited<ReturnType<typeof loadAppData>>

async function createWindow(dataPromise: Promise<AppData>) {
	const showTiming = getTimingOption(args, SHOW_TIMING)

	win = new BrowserWindow({
		title: 'Loading...',
		width: VITE_DEV_SERVER_URL ? 1500 : 800,
		height: 800,
		opacity: 1.0,
		show: showTiming === 'immediate',
		backgroundColor: '#212121',
		autoHideMenuBar: true,
		icon: path.join(process.env.VITE_PUBLIC, 'logos/edf-bg-rounded.png'),
		webPreferences: {
			preload: path.join(__dirname, './preload.mjs'),
			contextIsolation: true,
			nodeIntegration: true,
			sandbox: false,
		},
	})

	win.setAlwaysOnTop(true)

	if (showTiming === 'skip-flash') {
		win.webContents.once('dom-ready', () => {
			if (win && !win.isVisible()) {
				win.show()
			}
		})
	}

	const loadPromise = VITE_DEV_SERVER_URL
		? win.loadURL(VITE_DEV_SERVER_URL)
		: win.loadFile(path.join(RENDERER_DIST, 'index.html'))

	if (VITE_DEV_SERVER_URL) {
		win.webContents.openDevTools()
	}

	try {
		const [_, appData] = await Promise.all([loadPromise, dataPromise])
		const { formFileContent, envParams, meta } = appData

		if (win && !win.isDestroyed()) {
			win.setTitle('Espanso Dynamic Forms')

			if (meta) {
				if (meta.title) win.setTitle(meta.title)

				const currentSize = win.getSize()
				const newWidth = meta.width ?? currentSize[0]
				const newHeight = meta.height ?? currentSize[1]

				if (newWidth !== currentSize[0] || newHeight !== currentSize[1]) {
					win.setSize(newWidth, newHeight, true)
				}

				if (meta.x || meta.y) {
					const currentPos = win.getPosition()
					win.setPosition(
						meta.x ?? currentPos[0],
						meta.y ?? currentPos[1],
						true,
					)
				}

				if (meta.opacity) win.setOpacity(meta.opacity)
			}

			if (showTiming === 'ready') {
				win.show()
			}

			// Send data to renderer
			win.webContents.send('main-process-message', {
				form: jsonStringifySafe(formFileContent),
				env: jsonStringifySafe(envParams),
			})

			win.focus()
		}
	} catch (error) {
		console.error('Failed to load application data', error)
		if (win && !win.isDestroyed() && !win.isVisible()) {
			win.show()
		}
	}
}

// --- Lifecycle Handlers ---

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
		win = null
	}
})

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		// Re-trigger load if re-opening from Dock (macOS)
		const dataPromise = loadAppData()
		createWindow(dataPromise)
	}
})

// --- Orchestration point ---
app.whenReady().then(() => {
	const dataPromise = loadAppData()
	createWindow(dataPromise)
})

// --- IPC Handlers ---

ipcMain.handle('get-clipboard-text', () => {
	return clipboard.readText()
})

ipcMain.handle('read-file-from-path', async (_event, filePath: string) => {
	try {
		const buffer = await readFile(filePath)
		const stats = await stat(filePath)
		const parsed = path.parse(filePath)

		const base64 = buffer.toString('base64')

		return {
			buffer: base64,
			name: parsed.name,
			ext: parsed.ext.slice(1),
			size: stats.size,
			path: filePath,
		}
	} catch (error) {
		console.error('Error reading file:', error)
		throw error
	}
})

ipcMain.on('result', (_event, result: string) => {
	console.clear()
	console.log(result)

	process.nextTick(() => {
		app.quit()
	})
})
