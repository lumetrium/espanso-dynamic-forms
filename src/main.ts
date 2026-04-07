import { createPinia } from 'pinia'
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import index from './i18n'
import { vuetify } from './plugins/vuetify.ts'
import { useEnvStore } from './stores/useEnvStore.ts'
import { useFormSchemaStore } from './stores/useFormSchemaStore.ts'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import {
	electronFileStorage,
	initElectronFileStorage,
} from './storage/electronFileStorage.ts'

// for backward-compatibility with <1.6.11
if (window.electronAPI) {
	const initial = window.electronAPI.getInitialPersistedState()
	if (Object.keys(initial).length === 0) {
		for (const key of ['jsonforms-recent-files', 'jsonforms-file-presets']) {
			const value = localStorage.getItem(key)
			if (value) {
				initial[key] = value
				window.electronAPI.setPersistedState(key, value)
			}
		}
	}
	initElectronFileStorage(initial)
}

const pinia = createPinia().use(
	createPersistedState({
		storage: window.electronAPI ? electronFileStorage : localStorage,
	}),
)
const app = createApp(App).use(pinia).use(vuetify).use(index)

if (window.electronAPI) {
	window.electronAPI.on(
		'main-process-message',
		(_event, data: { form: string; env: string }) => {
			useEnvStore().setEnv(data.env)
			useFormSchemaStore().setFullSchema(data.form)
		},
	)
}

function mountApp() {
	app.mount('#app')
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', mountApp)
} else {
	mountApp()
}
