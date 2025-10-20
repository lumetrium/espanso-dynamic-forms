import { app, BrowserWindow, clipboard, ipcMain } from 'electron'
import { readFile, stat } from 'fs/promises'
// @ts-ignore
import { load as loadYaml } from 'js-yaml'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import defaultYamlForm from '../public/forms/empty.yml?raw'
import { useTemplater } from '../src/templater/useTemplater.ts'
import { parseEnvParams } from './resolvers/env-resolver.ts'
import {
	getFormFilePath,
	getFormFilePathReal,
	parseFormConfig,
} from './resolvers/form-resolver.ts'
import { jsonStringifySafe } from './utils'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const FORM_CONFIG = process.env['FORM_CONFIG'] || ''

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
	? path.join(process.env.APP_ROOT, 'public')
	: RENDERER_DIST

const args = process.argv.slice(1)

const { render } = useTemplater()

let envParams = parseEnvParams(args, {
	...process.env,
	EDF_EXECUTABLE: app.getPath('exe'),
	EDF_INSTALLATION_DIR: path.dirname(app.getPath('exe')),
	EDF_RESOURCES: process.env.VITE_PUBLIC,
	EDF_FORMS: process.env.VITE_PUBLIC + '/forms',
})

const formFilePath = getFormFilePath(args, '') || FORM_CONFIG
const formFilePathRendered = render(formFilePath, { env: envParams })

const formFileContent = parseFormConfig(
	formFilePathRendered,
	loadYaml(defaultYamlForm),
)

envParams = {
	...envParams,
	EDF_FORM_CONFIG_PATH: formFilePath,
	EDF_FORM_CONFIG_PATH_RENDERED: formFilePath,
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

const { meta } = formFileContent

let win: BrowserWindow | null

async function createWindow() {
	win = new BrowserWindow({
		title: meta?.title ?? 'Espanso Dynamic Forms',
		width: meta?.width ?? (VITE_DEV_SERVER_URL ? 1500 : 800),
		height: meta?.height ?? 800,
		x: meta?.x,
		y: meta?.y,
		opacity: meta?.opacity ?? 1.0,
		show: false,
		autoHideMenuBar: true,
		icon: path.join(process.env.VITE_PUBLIC, 'logos/edf-bg-rounded.png'),
		webPreferences: {
			preload: path.join(__dirname, './preload.mjs'),
			contextIsolation: true,
			nodeIntegration: true,
			sandbox: false,
			// webSecurity: false,
			// experimentalFeatures: false
		},
	})

	win.setAlwaysOnTop(true)

	win.webContents.on('did-finish-load', () => {
		win?.webContents.send('main-process-message', {
			form: jsonStringifySafe(formFileContent),
			env: jsonStringifySafe(envParams),
		})
	})

	if (VITE_DEV_SERVER_URL) {
		await win.loadURL(VITE_DEV_SERVER_URL)
		win.webContents.openDevTools()
	} else {
		// win.loadFile('dist/index.html')
		await win.loadFile(path.join(RENDERER_DIST, 'index.html'))
	}

	win.show()
	win.focus()
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
		win = null
	}
})

app.on('before-quit', () => {
	// console.clear()
	// console.log('')
})

app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
})

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

app.whenReady().then(createWindow)
