import { exec, execFile } from 'child_process'
import { existsSync } from 'fs'
import { promisify } from 'util'
import { platform } from 'os'
import path from 'path'

const execAsync = promisify(exec)
const execFileAsync = promisify(execFile)

interface EspansoEnv {
	ESPANSO_CONFIG: string
	ESPANSO_PACKAGES: string
	ESPANSO_RUNTIME: string
}

export async function getEspansoEnvVars(): Promise<EspansoEnv | null> {
	try {
		const isWin = platform() === 'win32'

		// ---------------------------------------------------------
		// WINDOWS STRATEGY
		// ---------------------------------------------------------
		if (isWin) {
			const binPath = await resolveWindowsEspansoBinaryPath()
			if (!binPath) return null

			const { stdout: pathOutput } = await execFileAsync(binPath, ['path'], {
				encoding: 'utf-8',
			})

			if (!pathOutput.trim()) return null
			return parseEspansoOutput(pathOutput)
		}

		// ---------------------------------------------------------
		// LINUX / MACOS STRATEGY
		// ---------------------------------------------------------
		else {
			const { stdout: pathOutput } = await execAsync('espanso path', {
				encoding: 'utf-8',
			})

			if (!pathOutput.trim()) return null
			return parseEspansoOutput(pathOutput)
		}
	} catch (error) {
		console.error('Failed to get Espanso vars:', error)
		return null
	}
}

async function resolveWindowsEspansoBinaryPath(): Promise<string | null> {
	try {
		const { stdout } = await execAsync('where espansod.exe')
		const daemonPath = stdout.trim().split(/\r?\n/).find(Boolean)
		if (daemonPath) return daemonPath
	} catch {
		// Fall back to resolving the regular espanso command.
	}

	try {
		const { stdout } = await execAsync('where espanso')
		const candidates = stdout
			.split(/\r?\n/)
			.map((line) => line.trim())
			.filter(Boolean)

		for (const candidate of candidates) {
			const normalized = candidate.toLowerCase()
			if (normalized.endsWith('.exe')) {
				return candidate
			}

			if (normalized.endsWith('espanso.cmd')) {
				const siblingDaemon = path.join(path.dirname(candidate), 'espansod.exe')
				if (existsSync(siblingDaemon)) return siblingDaemon
				continue
			}

			if (path.extname(candidate) === '' && path.basename(normalized) === 'espanso') {
				const siblingDaemon = path.join(path.dirname(candidate), 'espansod.exe')
				if (existsSync(siblingDaemon)) return siblingDaemon
			}
		}
	} catch {
		return null
	}

	return null
}

function parseEspansoOutput(output: string): EspansoEnv {
	const result: Partial<EspansoEnv> = {}
	const lines = output.split(/\r?\n/)

	for (const line of lines) {
		const [key, ...values] = line.split(':')
		if (!key || values.length === 0) continue

		const normalizedKey = key.trim()
		const val = values.join(':').trim()

		switch (normalizedKey) {
			case 'Config':
				result.ESPANSO_CONFIG = val
				break
			case 'Packages':
				result.ESPANSO_PACKAGES = val
				break
			case 'Runtime':
				result.ESPANSO_RUNTIME = val
				break
		}
	}

	return result as EspansoEnv
}
