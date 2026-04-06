/**
 * VocalFlow Configuration
 * 
 * IMPORTANT: Hardcode your API keys here for the assignment.
 */

export const VOCAL_FLOW_CONFIG = {
  // --- API KEYS ---
  DEEPGRAM_API_KEY: 'YOUR_DEEPGRAM_API_KEY_HERE', 
  GROQ_API_KEY: 'YOUR_GROQ_API_KEY_HERE',

  // --- MODELS ---
  DEEPGRAM_MODEL: 'nova-2',
  DEEPGRAM_LANGUAGE: 'en-US',
  
  GROQ_MODEL: 'llama-3.3-70b-versatile', // Original repo uses Groq for post-processing

  // --- HOTKEYS ---
  // On Windows, these are common modifers. 
  // 'alt' corresponds to Right Alt (AltGr) or Left Alt.
  // 'control' corresponds to Ctrl.
  RECORD_HOTKEY: 'alt', 

  // --- SETTINGS ---
  FIX_SPELLING: true,
  FIX_GRAMMAR: true,
  CODE_MIX: null, // e.g., 'Hinglish'
  TARGET_LANGUAGE: null, // e.g., 'French'
}

export default VOCAL_FLOW_CONFIG;
