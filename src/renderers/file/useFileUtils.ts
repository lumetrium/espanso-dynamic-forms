export function useFileUtils() {
	const formatFileSize = (bytes: number): string => {
		if (bytes === 0) return '0 Bytes'
		const k = 1024
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
	}

	function downloadFile(src: string, name: string) {
		const link = document.createElement('a')
		link.href = src
		link.download = name || 'file'
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	}

	function getFileIcon(fileName: string | undefined | null, mimeType?: string): string {
		const name = fileName ? fileName.toLowerCase() : ''
		const ext = name.split('.').pop() || ''

		// Code / Config
		if (ext === 'ts' || ext === 'tsx') return 'mdi-language-typescript'
		if (ext === 'js' || ext === 'jsx' || ext === 'mjs' || ext === 'cjs')
			return 'mdi-language-javascript'
		if (ext === 'vue') return 'mdi-vuejs'
		if (ext === 'html' || ext === 'htm') return 'mdi-language-html5'
		if (ext === 'css' || ext === 'scss' || ext === 'sass' || ext === 'less')
			return 'mdi-language-css3'
		if (ext === 'json' || ext === 'json5' || ext === 'jsonc') return 'mdi-code-json'
		if (ext === 'xml') return 'mdi-xml'
		if (ext === 'yaml' || ext === 'yml') return 'mdi-format-list-bulleted'
		if (ext === 'md' || ext === 'markdown') return 'mdi-language-markdown'
		if (ext === 'py') return 'mdi-language-python'
		if (ext === 'go') return 'mdi-language-go'
		if (ext === 'rs') return 'mdi-language-rust'
		if (ext === 'java') return 'mdi-language-java'
		if (ext === 'c' || ext === 'cpp' || ext === 'h') return 'mdi-language-cpp'
		if (ext === 'php') return 'mdi-language-php'
		if (ext === 'rb') return 'mdi-language-ruby'
		if (ext === 'sh' || ext === 'bash' || ext === 'zsh') return 'mdi-bash'
		if (ext === 'bat' || ext === 'cmd' || ext === 'ps1')
			return 'mdi-microsoft-windows'

		// Documents
		if (ext === 'pdf' || mimeType === 'application/pdf') return 'mdi-file-pdf-box'
		if (
			['doc', 'docx', 'odt', 'rtf'].includes(ext) ||
			mimeType?.includes('word') ||
			mimeType?.includes('document')
		)
			return 'mdi-file-word'
		if (
			['xls', 'xlsx', 'ods', 'csv'].includes(ext) ||
			mimeType?.includes('excel') ||
			mimeType?.includes('spreadsheet') ||
			mimeType?.includes('csv')
		)
			return 'mdi-file-excel'
		if (
			['ppt', 'pptx', 'odp'].includes(ext) ||
			mimeType?.includes('powerpoint') ||
			mimeType?.includes('presentation')
		)
			return 'mdi-file-powerpoint'
		if (ext === 'txt' || mimeType?.startsWith('text/'))
			return 'mdi-file-document-outline'

		// Media
		if (
			['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico', 'bmp', 'tiff'].includes(
				ext,
			) ||
			mimeType?.startsWith('image/')
		)
			return 'mdi-file-image'

		if (
			[
				'mp4',
				'webm',
				'ogg',
				'avi',
				'mov',
				'wmv',
				'mkv',
				'flv',
				'mpg',
				'mpeg',
			].includes(ext) ||
			mimeType?.startsWith('video/')
		)
			return 'mdi-file-video'

		if (
			['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac', 'wma'].includes(ext) ||
			mimeType?.startsWith('audio/')
		)
			return 'mdi-file-music'

		// Archives
		if (
			[
				'zip',
				'tar',
				'gz',
				'rar',
				'7z',
				'bz2',
				'xz',
				'tgz',
				'iso',
				'dmg',
			].includes(ext) ||
			mimeType?.includes('zip') ||
			mimeType?.includes('compressed') ||
			mimeType?.includes('tar')
		)
			return 'mdi-folder-zip'

		// Executables / System
		if (['exe', 'msi', 'dll', 'sys'].includes(ext)) return 'mdi-application-cog'
		if (['deb', 'rpm'].includes(ext)) return 'mdi-package-variant'
		if (ext === 'apk') return 'mdi-android'

		// Default
		return 'mdi-file-outline'
	}

	return {
		formatFileSize,
		downloadFile,
		getFileIcon,
	}
}
