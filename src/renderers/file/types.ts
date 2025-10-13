export interface FileMetadata {
	fullName: string
	name: string
	extension: string
	size: number
	mime: string

	text: string
	dataUrl: string
	base64: string
	hash: string
}
