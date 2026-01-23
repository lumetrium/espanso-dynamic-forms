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
	getClipboardText: () => ipcRenderer.invoke('get-clipboard-text'),
	readFileFromPath: (filePath: string) =>
		ipcRenderer.invoke('read-file-from-path', filePath),

	// Shell operations
	shellOpenPath: (filePath: string) =>
		ipcRenderer.invoke('shell-open-path', filePath),
	shellOpenExternal: (url: string) =>
		ipcRenderer.invoke('shell-open-external', url),
	shellShowItemInFolder: (filePath: string) =>
		ipcRenderer.invoke('shell-show-item-in-folder', filePath),
	createDemoConfig: (filePath: string, content: string) =>
		ipcRenderer.invoke('create-demo-config', { filePath, content }),
}

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('electronAPI', electronAPI)

export type ElectronAPI = typeof electronAPI
