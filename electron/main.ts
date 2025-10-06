import { app, BrowserWindow, ipcMain, clipboard } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { parseEnvParams } from './resolvers/env-resolver.ts'
import { getFormFilePath, parseFormConfig } from './resolvers/form-resolver.ts'
import defaultYamlForm from '../public/forms/empty.yml?raw'
import fs from 'node:fs'

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

const formFilePath = getFormFilePath(args, '')
const formFileContent = parseFormConfig(args, defaultYamlForm)

const envContent = parseEnvParams(args, {
	...process.env,
	APP_EXECUTABLE: app.getPath('exe'),
	APP_INSTALLATION_DIR: path.dirname(app.getPath('exe')),
	FORM_CONFIG_PATH: formFilePath,
	FORM_CONFIG_PATH_REAL: fs.realpathSync(formFilePath)
})


let win: BrowserWindow | null

async function createWindow() {
	win = new BrowserWindow({
		// width: 500,
		width: VITE_DEV_SERVER_URL ? 1500 : 800,
		height: 800,
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

	// Test active push message to Renderer-process.
	win.webContents.on('did-finish-load', () => {
		win?.webContents.send('main-process-message', {
			form: formFileContent,
			env: envContent,
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

ipcMain.on('result', (_event, result: string) => {
	console.clear()
	console.log(result)

	process.nextTick(() => {
		app.quit()
	})
})

app.whenReady().then(createWindow)
