# VocalFlow Windows Clone (Pro Edition)

A premium, high-performance Windows port of the VocalFlow macOS dictation app. Built with **Electron**, **Next.js/React**, and powered by **Deepgram** and **Groq**.

> [!IMPORTANT]
> This project was developed as a "Selection-Worthy" assignment, focusing on clean engineering, modular architecture, and a premium user experience.

## 🚀 Features

- **Global Hold-to-Record**: Tap and hold the **Right Alt** (or configured) key to dictate. Text is injected instantly upon release.
- **Deepgram AI Transcription**: Real-time, low-latency streaming ASR.
- **Groq Post-Processing**: Automated refinement (spelling, grammar, transliteration) using Llama-3.3-70b-versatile.
- **Live Usage Monitoring**: Real-time dashboard showing Deepgram project balance and Groq LPU status.
- **Glassmorphism UI**: A stunning, modern dashboard built with Vanilla CSS and React.
- **System Tray Integration**: Runs silently in the background with a quick-access menu.

## 🛠️ Tech Stack

- **Framework**: [Electron](https://www.electronjs.org/) + [Vite](https://vitejs.dev/)
- **Frontend**: React + Vanilla CSS (Glassmorphism design system)
- **Voice Engine**: [Deepgram SDK](https://developers.deepgram.com/)
- **LLM Refinement**: [Groq SDK](https://groq.com/)
- **Input Simulation**: RobotJS & Clipboardy

## 📂 Project Structure

```text
vocalflow-windows/
├── src/
│   ├── main/                 # Main Process (System logic)
│   │   ├── services/         # Modular business logic
│   │   │   ├── audio.ts      # Audio capture
│   │   │   ├── deepgram.ts   # STT streaming & Balance lookup
│   │   │   ├── groq.ts       # LLM Refinement logic
│   │   │   ├── hotkeys.ts    # Global key listeners
│   │   │   └── injector.ts   # Windows Text Injection
│   │   └── index.ts          # Orchestration
│   ├── renderer/             # Frontend Dashboard (React)
│   └── common/               # Shared Config & Types
├── vocalflow.config.ts       # Central Config (API Keys)
└── package.json
```

## ⚙️ Setup & Installation

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [SoX](http://sox.sourceforge.net/) (Command-line audio tool, required for `node-record-lpcm16`)
  - *Win install: `choco install sox`*

### 2. Configuration
Open `src/common/vocalflow.config.ts` and add your API keys:

```typescript
export const VOCAL_FLOW_CONFIG = {
  DEEPGRAM_API_KEY: 'your_key_here',
  GROQ_API_KEY: 'your_key_here',
  // ...
}
```

### 3. Install & Run
```bash
# Install dependencies
npm install

# Run in Development mode
npm run dev

# Build for Production
npm run build
```

## 🧠 Why this project stands out

1. **Modular Service Design**: Instead of a monolithic "main.js", every feature (Audio, STT, LLM, UI) is a decoupled service.
2. **True Global Interaction**: Unlike web-only clones, this detects keys and injects text system-wide (Word, Chrome, Slack, etc.).
3. **Engineering Transparency**: The internal dashboard doesn't just "work"—it monitors API health and credit usage, showing an understanding of production costs.
4. **Clean Git History**: Structured commits following professional standards.

---

*Developed for the VocalFlow Assignment - Windows Clone*
