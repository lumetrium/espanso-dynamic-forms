import mime from 'mime'
import type { FileMetadata } from './types'
import { useFileReaders } from './useFileReaders'

export function useFilePathLoader() {
	const { calculateHash } = useFileReaders()

	function getFilePath(value: any): string | null {
		if (!value) return null
		if (typeof value === 'object' && ('path' in value)) return value.path
		return typeof value === 'string' && value.length > 0 && !value.startsWith('data:')
			? value.trim()
			: null
	}

	function isTextFile(mimeType: string): boolean {
		return (
			mimeType.startsWith('text/') ||
			mimeType === 'application/json' ||
			mimeType === 'application/xml'
		)
	}

	// Load file from path using Electron API
	async function loadFileFromPath(filePath: string): Promise<FileMetadata> {
		try {
			const fileData = await window.electronAPI.readFileFromPath(filePath)
			const base64 = fileData.buffer
			const binaryString = atob(base64)
			const uint8Array = new Uint8Array(binaryString.length)
			for (let i = 0; i < binaryString.length; i++) {
				uint8Array[i] = binaryString.charCodeAt(i)
			}
			const arrayBuffer = uint8Array.buffer
			const fullFileName = `${fileData.name}.${fileData.ext}`
			const mimeType = mime.getType(fullFileName) ?? ''
			const dataUrl = `data:${mimeType};base64,${base64}`

			const text = isTextFile(mimeType)
				? new TextDecoder().decode(uint8Array)
				: ''

			const hash = await calculateHash(arrayBuffer)

			return {
				fullName: fullFileName,
				name: fileData.name,
				extension: fileData.ext,
				size: fileData.size,
				mime: mimeType,
				text,
				dataUrl,
				base64,
				hash,
			}
		} catch (error) {
			console.error('Error loading file from path:', filePath, error)
			throw error
		}
	}

	return {
		getFilePath,
		loadFileFromPath,
	}
}
