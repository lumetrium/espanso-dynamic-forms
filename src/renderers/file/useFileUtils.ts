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

	return {
		formatFileSize,
		downloadFile,
	}
}
