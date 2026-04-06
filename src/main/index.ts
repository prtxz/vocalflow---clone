import { app, shell, BrowserWindow, ipcMain, Tray, Menu, nativeImage } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-vite/utils'
import { VOCAL_FLOW_CONFIG } from '../common/vocalflow.config'

// Services
import { HotkeyService } from './services/hotkeys'
import { AudioService } from './services/audio'
import { DeepgramService } from './services/deepgram'
import { GroqService } from './services/groq'
import { TextInjector } from './services/injector'

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null

// Initialize Services
const audio = new AudioService()
const deepgram = new DeepgramService()
const groq = new GroqService()
const injector = new TextInjector()
let hotkeys: HotkeyService | null = null

let accumulatedTranscript = ''

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false
    },
    title: 'VocalFlow - Windows Clone',
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function createTray() {
  const icon = nativeImage.createEmpty() 
  tray = new Tray(icon)
  const contextMenu = Menu.buildFromTemplate([
    { label: 'VocalFlow Windows', enabled: false },
    { type: 'separator' },
    { label: 'Show Dashboard', click: () => mainWindow?.show() },
    { label: 'Quit', click: () => app.quit() }
  ])
  tray.setToolTip('VocalFlow - Voice Dictation')
  tray.setContextMenu(contextMenu)
}

// Logic Coordination
async function handleHold() {
  console.log('Recording started...')
  accumulatedTranscript = ''
  
  mainWindow?.webContents.send('recording-started')
  
  await deepgram.connect()
  audio.start()
  
  // Forward audio to deepgram
  audio.on('data', (chunk) => {
    deepgram.sendAudio(chunk)
  })

  deepgram.on('transcript', (text) => {
    accumulatedTranscript += ' ' + text
    mainWindow?.webContents.send('partial-transcript', text)
  })
}

async function handleRelease() {
  console.log('Recording stopped. Processing...')
  mainWindow?.webContents.send('recording-stopped')
  audio.stop()
  await deepgram.close()
  
  const text = accumulatedTranscript.trim()
  if (!text) return

  // Apply Groq refinement if enabled
  const refined = await groq.refineText(text, {
    fixSpelling: VOCAL_FLOW_CONFIG.FIX_SPELLING,
    fixGrammar: VOCAL_FLOW_CONFIG.FIX_GRAMMAR,
    codeMix: VOCAL_FLOW_CONFIG.CODE_MIX || undefined,
    targetLanguage: VOCAL_FLOW_CONFIG.TARGET_LANGUAGE || undefined
  })

  console.log('Injecting:', refined)
  await injector.inject(refined)
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.vocalflow.clone')

  createWindow()
  createTray()

  // Start Hotkey Monitoring
  hotkeys = new HotkeyService(handleHold, handleRelease)
  hotkeys.start()

  // Initial and Periodic Balance Update
  const updateStats = async () => {
    const balance = await deepgram.getBalance()
    const usage = await groq.getUsageEstimate()
    mainWindow?.webContents.send('balance-update', { deepgram: balance, groq: usage })
  }

  updateStats()
  setInterval(updateStats, 30000)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC Handlers
ipcMain.on('window-minimize', () => mainWindow?.minimize())
ipcMain.on('window-maximize', () => mainWindow?.isMaximized() ? mainWindow.unmaximize() : mainWindow?.maximize())
ipcMain.on('window-close', () => mainWindow?.hide())
