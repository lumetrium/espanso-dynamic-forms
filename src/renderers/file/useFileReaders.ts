import type { FileMetadata } from './types'

export function useFileReaders() {
	// Read file as text
	function fileToText(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.onerror = () => reject(reader.error)
			reader.onload = () => resolve(String(reader.result ?? ''))
			reader.readAsText(file)
		})
	}

	// Read file as data URL (base64)
	function fileToDataUrl(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.onerror = () => reject(reader.error)
			reader.onload = () => resolve(String(reader.result ?? ''))
			reader.readAsDataURL(file)
		})
	}

	// Read file as ArrayBuffer for hashing
	function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.onerror = () => reject(reader.error)
			reader.onload = () => resolve(reader.result as ArrayBuffer)
			reader.readAsArrayBuffer(file)
		})
	}

	// Extract base64 from data URL
	function extractBase64FromDataUrl(dataUrl: string): string {
		const base64Index = dataUrl.indexOf(',')
		return base64Index !== -1 ? dataUrl.substring(base64Index + 1) : ''
	}

	// Calculate SHA-256 hash from ArrayBuffer
	async function calculateHash(arrayBuffer: ArrayBuffer): Promise<string> {
		try {
			const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer)
			const hashArray = Array.from(new Uint8Array(hashBuffer))
			return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
		} catch (error) {
			console.warn('Hash calculation failed:', error)
			return ''
		}
	}

	function getFileExtension(fileName: string): string {
		const parts = fileName.split('.')
		return parts.length > 1 ? parts.pop()!.toLowerCase() : ''
	}

	function getBaseName(fileName: string): string {
		const lastDotIndex = fileName.lastIndexOf('.')
		return lastDotIndex > 0 ? fileName.substring(0, lastDotIndex) : fileName
	}

	// Convert file to complete metadata object
	async function fileToMetadata(file: File): Promise<FileMetadata> {
		try {
			// Read file in all required formats simultaneously
			const [text, dataUrl, arrayBuffer] = await Promise.all([
				fileToText(file),
				fileToDataUrl(file),
				fileToArrayBuffer(file),
			])

			// Extract base64 from data URL
			const base64 = extractBase64FromDataUrl(dataUrl)

			// Calculate hash
			const hash = await calculateHash(arrayBuffer)

			const extname = getFileExtension(file.name)

			return {
				fullName: file.name,
				name: getBaseName(file.name),
				extension: extname,
				size: file.size,
				mime: file.type,
				text,
				dataUrl,
				base64,
				hash,
			}
		} catch (error) {
			console.error('Error reading file:', error)
			// Return minimal metadata on error
			const extname = getFileExtension(file.name)
			return {
				fullName: file.name,
				name: getBaseName(file.name),
				extension: extname,
				size: file.size,
				mime: file.type,
				text: '',
				dataUrl: '',
				base64: '',
				hash: '',
			}
		}
	}

	return {
		fileToText,
		fileToDataUrl,
		fileToArrayBuffer,
		extractBase64FromDataUrl,
		calculateHash,
		fileToMetadata,
		getFileExtension,
		getBaseName,
	}
}
