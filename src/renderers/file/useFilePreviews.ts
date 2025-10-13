import { ref, onBeforeUnmount } from 'vue'

export function useFilePreviews() {
	const localPreviews = ref<(string | undefined)[]>([])
	let objectUrls: string[] = []

	function revokeObjectUrls() {
		objectUrls.forEach((url) => URL.revokeObjectURL(url))
		objectUrls = []
	}

	onBeforeUnmount(revokeObjectUrls)

	function buildPreviews(selected: File[]) {
		revokeObjectUrls()
		localPreviews.value = selected.map((f) => {
			const url = URL.createObjectURL(f)
			objectUrls.push(url)
			return url
		})
	}

	return {
		localPreviews,
		buildPreviews,
		revokeObjectUrls,
	}
}
