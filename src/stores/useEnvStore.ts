import { defineStore } from 'pinia'
import { ref } from 'vue'

type Env = Record<string, string>

export const useEnvStore = defineStore('env', () => {

	const env = ref<Env>({})

	function setEnv(newEnv: string) {
		try {
			env.value = JSON.parse(newEnv)
			console.log('Env updated', env.value)
		} catch (error) {
			console.error('Invalid JSON env:', error)
			console.log('Failed env:', newEnv)
			env.value = {}
		}
	}

	return {
		env,
		setEnv,
	}
})
