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
	/** Full file system path */
	path: string
}

/**
 * Lightweight file entry for recent files history.
 */
export interface RecentFileEntry {
	/** Unique identifier (based on file hash) */
	id: string
	/** Display name including extension */
	fullName: string
	/** File name without extension */
	name: string
	/** File extension */
	extension: string
	/** File size in bytes */
	size: number
	/** MIME type */
	mime: string
	/** Full file path for reloading */
	path: string
	/** SHA-256 hash of file contents */
	hash: string
	/** Last access timestamp */
	lastAccessed: number
}

/**
 * Configuration for the recent files feature.
 */
export interface RecentFilesConfig {
	/** Enable the recent files feature */
	enabled: boolean
	/** Maximum number of files to store (default: 10) */
	maxItems?: number
	/** Explicit storage key for complete control */
	historyKey?: string
	/** Namespace for sharing history between fields */
	namespace?: string
}

/**
 * A saved preset of recent files.
 */
export interface RecentFilePreset {
	/** Unique identifier for the preset */
	id: string
	/** User-defined name for the preset */
	name: string
	/** The list of file entries saved in this preset */
	entries: RecentFileEntry[]
	/** Timestamp when the preset was created */
	createdAt: number
}

/**
 * Stashed history to restore after loading a preset.
 */
export interface PresetsStash {
	/** The stashed file entries */
	entries: RecentFileEntry[]
	/** Timestamp when the stash was created */
	stashedAt: number
}
