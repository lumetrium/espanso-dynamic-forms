import { app, BrowserWindow, ipcMain, clipboard } from 'electron'
import * as fs from 'node:fs'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import defaultYamlForm from '../public/forms/empty.yml?raw'

// @ts-ignore
import { load as loadYaml } from 'js-yaml'

// @ts-ignore
const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.jsthe logs for more information.
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const FORM_CONFIG = process.env['FORM_CONFIG'] || ''

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
	? path.join(process.env.APP_ROOT, 'public')
	: RENDERER_DIST

const args = process.argv.slice(2)
let formFileIndex = args.indexOf('--form-config')
let formFileContent = 'EMPTY'

let formFilePath =
	formFileIndex !== -1 && args.length > formFileIndex + 1
		? args[formFileIndex + 1]
		: FORM_CONFIG

if (formFilePath && fs.existsSync(formFilePath)) {
	formFileContent = fs.readFileSync(formFilePath, 'utf-8')
}

if (!formFilePath || !fs.existsSync(formFilePath)) {
	formFileContent = defaultYamlForm
}

if (
	formFileContent &&
	(
		!formFilePath ||
		formFilePath?.endsWith('.yaml') ||
		formFilePath?.endsWith('.yml')
	)
) {
	try {
		const doc = loadYaml(formFileContent)
		formFileContent = JSON.stringify(doc, null, 2)
	} catch (e) {
		console.error('Error parsing YAML file:', e)
	}
}


let win: BrowserWindow | null

async function createWindow() {
	win = new BrowserWindow({
		// width: 500,
		width: VITE_DEV_SERVER_URL ? 1500 : 800,
		height: 800,
		show: false,
		autoHideMenuBar: true,
		icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
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

	// Test active push message to Renderer-process.
	win.webContents.on('did-finish-load', () => {
		win?.webContents.send('main-process-message', formFileContent)
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

ipcMain.on('result', (_event, result: string) => {
	console.clear()
	console.log(result)

	process.nextTick(() => {
		app.quit()
	})
})

app.whenReady().then(createWindow)
