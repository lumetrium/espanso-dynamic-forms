import type { StorageLike } from 'pinia-plugin-persistedstate'

/**
 * Custom storage adapter for pinia-plugin-persistedstate.
 *
 * Backed by an in-memory cache that is pre-populated from the main process
 * (which reads a shared JSON file in userData). Writes update the cache
 * synchronously and fire-and-forget an IPC call so the main process can
 * persist the change to disk.
 *
 * This decouples Pinia persistence from Chromium's localStorage, allowing
 * each EDF instance to run with an isolated Chromium session directory
 * while still sharing persisted state across launches.
 */

const cache: Record<string, string> = {}

export function initElectronFileStorage(
	state: Record<string, string>,
): void {
	Object.assign(cache, state)
}

export const electronFileStorage: StorageLike = {
	getItem(key: string): string | null {
		return cache[key] ?? null
	},
	setItem(key: string, value: string): void {
		cache[key] = value
		if (window.electronAPI) {
			window.electronAPI.setPersistedState(key, value)
		}
	},
}
