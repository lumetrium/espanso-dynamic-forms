import { exec, execFile } from 'child_process'
import { promisify } from 'util'
import { platform } from 'os'

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
		const setCmd = isWin ? 'where espanso' : 'which espanso'

		const { stdout: whereOutput } = await execAsync(setCmd)
		let binPath = whereOutput.trim().split(/\r?\n/)[0]

		if (!binPath) return null

		if (isWin && binPath.toLowerCase().endsWith('.cmd')) {
			binPath = binPath.replace(/\.cmd$/i, 'd.exe')
		}

		const { stdout: pathOutput } = await execFileAsync(binPath, ['path'], {
			encoding: 'utf-8',
		})

		if (!pathOutput.trim()) return null

		return parseEspansoOutput(pathOutput)
	} catch (error) {
		return null
	}
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
