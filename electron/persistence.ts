import { app, ipcMain } from 'electron'
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'

const STATE_FILENAME = 'edf-persisted-state.json'

function getStatePath(): string {
	return path.join(app.getPath('userData'), STATE_FILENAME)
}

export function loadPersistedState(): Record<string, string> {
	const filePath = getStatePath()
	if (!existsSync(filePath)) return {}
	try {
		return JSON.parse(readFileSync(filePath, 'utf-8'))
	} catch {
		return {}
	}
}

export function savePersistedStateEntry(key: string, value: string): void {
	const filePath = getStatePath()
	const dir = path.dirname(filePath)
	if (!existsSync(dir)) {
		mkdirSync(dir, { recursive: true })
	}

	let state: Record<string, string> = {}
	try {
		if (existsSync(filePath)) {
			state = JSON.parse(readFileSync(filePath, 'utf-8'))
		}
	} catch {
		// start fresh if file is corrupted
	}

	state[key] = value
	writeFileSync(filePath, JSON.stringify(state, null, 2), 'utf-8')
}

/**
 * Returns true when the file-based state has not been created yet,
 * meaning existing users still have their data in Chromium's localStorage.
 */
export function needsMigration(): boolean {
	return !existsSync(getStatePath())
}

/**
 * Register IPC handlers for renderer ↔ main persistence bridge.
 */
export function registerPersistenceHandlers(): void {
	ipcMain.on('get-persisted-state-sync', (event) => {
		event.returnValue = loadPersistedState()
	})

	ipcMain.on('set-persisted-state', (_event, key: string, value: string) => {
		try {
			savePersistedStateEntry(key, value)
		} catch {
			// best effort
		}
	})
}
