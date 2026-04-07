import { app } from 'electron'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { needsMigration } from './persistence.ts'

const SESSION_DIR_PREFIX = 'edf-session-'
const instanceSessionDir = path.join(
	os.tmpdir(),
	`${SESSION_DIR_PREFIX}${process.pid}`,
)

/**
 * Isolates this instance's Chromium session directory to prevent
 * cache/lock contention when multiple EDF instances run concurrently.
 * Must be called before app.whenReady().
 *
 * On the first launch after the update, isolation is skipped so the
 * renderer can still read the old localStorage and migrate it to
 * file-based storage. Subsequent launches use isolated sessions.
 */
export function initSessionIsolation(): void {
	if (!needsMigration()) {
		fs.mkdirSync(instanceSessionDir, { recursive: true })
		app.setPath('sessionData', instanceSessionDir)
	}
	scheduleStaleCleanup()
}

/**
 * Best-effort removal of this instance's session directory.
 * Call from the `will-quit` handler.
 */
export function cleanupSessionDir(): void {
	try {
		fs.rmSync(instanceSessionDir, { recursive: true, force: true })
	} catch {
		// Best effort — next launch will clean it up
	}
}

/**
 * Deferred cleanup of session dirs left by crashed/killed instances.
 * Dirs still locked by running instances are silently skipped.
 */
function scheduleStaleCleanup(): void {
	setTimeout(() => {
		try {
			const ownDir = `${SESSION_DIR_PREFIX}${process.pid}`
			for (const entry of fs.readdirSync(os.tmpdir())) {
				if (entry.startsWith(SESSION_DIR_PREFIX) && entry !== ownDir) {
					try {
						fs.rmSync(path.join(os.tmpdir(), entry), {
							recursive: true,
							force: true,
						})
					} catch {
						// Still locked by a running instance — leave it
					}
				}
			}
		} catch {
			// Best effort
		}
	}, 0)
}
