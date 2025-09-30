import { ipcRenderer, contextBridge } from 'electron'

const electronAPI = {
	on(...args: Parameters<typeof ipcRenderer.on>) {
		const [channel, listener] = args
		return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
	},
	off(...args: Parameters<typeof ipcRenderer.off>) {
		const [channel, ...omit] = args
		return ipcRenderer.off(channel, ...omit)
	},
	send(...args: Parameters<typeof ipcRenderer.send>) {
		const [channel, ...omit] = args
		return ipcRenderer.send(channel, ...omit)
	},
	invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
		const [channel, ...omit] = args
		return ipcRenderer.invoke(channel, ...omit)
	},

	// CUSTOM METHODS
	sendResult: (result: string) => {
		ipcRenderer.send('result', result)
	},
	getClipboardText: () => {
		return ipcRenderer.invoke('get-clipboard-text')
	}
}

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('electronAPI', electronAPI)

export type ElectronAPI = typeof electronAPI
