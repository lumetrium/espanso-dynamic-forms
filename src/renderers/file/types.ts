export interface FileMetadata {
	/** name + dot + extension */
	fullName: string
	/** name without extension */
	name: string
	/** file extension without dot */
	extension: string
	/** size in bytes */
	size: number
	/** mime type */
	mime: string

	/** text contents of the file, if applicable */
	text: string
	/** data URL of the file, if applicable */
	dataUrl: string
	/** binary contents of the file as base64 string */
	base64: string
	/** SHA-256 hash of the file contents as hex string */
	hash: string
}
