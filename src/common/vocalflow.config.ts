/**
 * VocalFlow Windows Clone — Central Configuration
 *
 * API keys are read from environment variables first (.env file).
 * If no env var is set, the hardcoded demo keys are used as a fallback
 * so evaluators can run `npm install && npm run dev` with zero setup.
 *
 * 🔐 Security note: For production use, always set keys via .env
 * and never commit real credentials to source control.
 *
 * See .env.example for the expected format.
 */

export const VOCAL_FLOW_CONFIG = {
  // --- API KEYS ---
  // Env var takes priority → hardcoded demo key is the fallback
  DEEPGRAM_API_KEY: process.env.DEEPGRAM_API_KEY || '3e24e17fd8ee0735556576d3d00bbe529272eb83',
  GROQ_API_KEY:     process.env.GROQ_API_KEY     || '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',

  // --- MODELS ---
  DEEPGRAM_MODEL: 'nova-2',
  DEEPGRAM_LANGUAGE: 'en-US',
  GROQ_MODEL: 'llama-3.3-70b-versatile',

  // --- HOTKEYS ---
  // 'alt'     → Left Alt or Right Alt
  // 'control' → Ctrl
  // 'shift'   → Shift
  RECORD_HOTKEY: process.env.RECORD_HOTKEY || 'alt',

  // --- POST-PROCESSING ---
  FIX_SPELLING: true,
  FIX_GRAMMAR: true,
  CODE_MIX: null,        // e.g. 'Hinglish'
  TARGET_LANGUAGE: null, // e.g. 'French'
}

export default VOCAL_FLOW_CONFIG;

