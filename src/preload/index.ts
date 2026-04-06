import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom API for the renderer process
const api = {
  windowMinimize: () => ipcRenderer.send('window-minimize'),
  windowMaximize: () => ipcRenderer.send('window-maximize'),
  windowClose: () => ipcRenderer.send('window-close'),
  
  // Navigation listener
  onNavigate: (callback: (page: string) => void) => 
    ipcRenderer.on('navigate', (_event, page) => callback(page))
}

// Use `contextBridge` to expose specialized APIs to the renderer
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (for development)
  window.electron = electronAPI
  // @ts-ignore (for development)
  window.api = api
}
