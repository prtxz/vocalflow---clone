# VocalFlow — Windows Clone

A full-featured Windows port of [VocalFlow](https://github.com/Vocallabsai/vocalflow), built with **Electron + Vite + React**.  
Hold a hotkey → speak → transcript is auto-pasted into any active window. Powered by **Deepgram** (real-time ASR) and **Groq** (LLM refinement).

---

## Features

| Feature | Detail |
|---|---|
| **Hold-to-Record** | Hold **Right Alt** to dictate. Release to inject text instantly |
| **Deepgram ASR** | Real-time streaming transcription via Nova-2 model |
| **Groq Refinement** | Spelling & grammar auto-fixed via Llama-3.3-70b-versatile |
| **Balance Monitoring** | Live Deepgram project balance displayed on the dashboard |
| **Groq Status** | Real-time Groq LPU activity indicator |
| **System-wide Injection** | Text pasted into any app — Word, Chrome, Slack, Notepad, etc. |
| **Glassmorphism UI** | Premium dark-mode dashboard with animated elements |
| **System Tray** | Runs silently in background with quick-access tray menu |

---

## Tech Stack

- **Runtime**: [Electron v41](https://www.electronjs.org/) + [electron-vite](https://electron-vite.org/)
- **Frontend**: React 19 + Vanilla CSS (Glassmorphism design system)
- **Speech-to-Text**: [@deepgram/sdk](https://developers.deepgram.com/) — WebSocket streaming
- **LLM Refinement**: [groq-sdk](https://groq.com/) — Llama-3.3-70b-versatile
- **Audio Capture**: [sox-bin](https://npmjs.com/package/sox-bin) — Bundled SoX binary for Windows, no external install needed
- **Hotkeys**: [uiohook-napi](https://npmjs.com/package/uiohook-napi) — System-wide key listener
- **Text Injection**: [robotjs](https://npmjs.com/package/robotjs) + [clipboardy](https://npmjs.com/package/clipboardy)

---

## Project Structure

```text
vocalflow---clone/
├── src/
│   ├── common/
│   │   └── vocalflow.config.ts    ← ⭐ Central config: API keys & settings
│   ├── main/
│   │   ├── index.ts               ← Electron main process orchestration
│   │   └── services/
│   │       ├── audio.ts           ← Audio capture (SoX waveaudio driver)
│   │       ├── deepgram.ts        ← STT streaming + balance API
│   │       ├── groq.ts            ← LLM text refinement
│   │       ├── hotkeys.ts         ← Global hotkey listener (uiohook-napi)
│   │       └── injector.ts        ← Windows text injection (clipboard + paste)
│   ├── preload/
│   │   └── index.ts               ← IPC bridge (main ↔ renderer)
│   └── renderer/
│       ├── index.html             ← App entry HTML
│       └── src/
│           ├── App.tsx            ← Dashboard UI (React)
│           ├── main.tsx           ← Renderer entry point
│           └── styles/
│               └── globals.css    ← Glassmorphism design system
├── sox_bin/                       ← Bundled SoX binary for Windows audio
├── electron.vite.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## Setup & Installation

### Prerequisites
- **Node.js v18+** — [nodejs.org](https://nodejs.org/)
- **Windows 10/11** — tested on Windows 11
- A **microphone** set as the default recording device in Windows Sound Settings

> **No external SoX install required** — a pre-built Windows binary is bundled via `sox-bin`.

### 1. Clone & Install

```bash
git clone https://github.com/prtxz/vocalflow---clone
cd vocalflow---clone
npm install
```

### 2. Configuration

API keys are pre-configured in `src/common/vocalflow.config.ts`.  
To use your own keys, open the file and replace:

```typescript
export const VOCAL_FLOW_CONFIG = {
  // API Keys
  DEEPGRAM_API_KEY: 'your_deepgram_key',  // deepgram.com
  GROQ_API_KEY: 'your_groq_key',          // console.groq.com

  // Models
  DEEPGRAM_MODEL: 'nova-2',
  GROQ_MODEL: 'llama-3.3-70b-versatile',

  // Hotkey: 'alt' | 'control' | 'shift'
  RECORD_HOTKEY: 'alt',

  // Post-processing
  FIX_SPELLING: true,
  FIX_GRAMMAR: true,
  CODE_MIX: null,        // e.g. 'Hinglish'
  TARGET_LANGUAGE: null, // e.g. 'French'
}
```

### 3. Run

```bash
# Development mode (with hot reload)
npm run dev

# Production build
npm run build
```

---

## How to Use

1. Launch with `npm run dev`
2. The dashboard shows connection status and Deepgram balance
3. Click into any text input (Word, browser, Notepad, etc.)
4. **Hold Right Alt** → speak your text
5. **Release Right Alt** → transcript is refined and auto-pasted

---

## Extra Features (Beyond Assignment)

1. **Deepgram Balance Display** — Live project credit balance fetched from the Deepgram REST API every 30 seconds
2. **Groq Token Usage Tracking** — Estimates tokens used per session in real-time, displayed in the dashboard
3. **Graceful Error Handling** — API key scope errors are caught and displayed as "N/A" instead of crashing
4. **Modular Service Architecture** — Clean separation: Audio → STT → LLM → Injection, each as an independent class
5. **System Tray** — App minimizes to tray; never blocks your taskbar

---

## Why This Stands Out

- **No `-d` (default device) Sox bug** — Windows Sox only supports `waveaudio`; this is correctly handled
- **Streaming ASR** — Audio is piped live to Deepgram WebSocket, not recorded-then-uploaded
- **True global hotkey** — Works when the Electron window is not focused (uiohook-napi)
- **Clipboard-safe injection** — Original clipboard content is restored after paste

---

*Assignment: Clone VocalFlow for Windows — VocalLabs AI*
