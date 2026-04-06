/**
 * VocalFlow Configuration
 * 
 */

export const VOCAL_FLOW_CONFIG = {
  // --- API KEYS ---
  DEEPGRAM_API_KEY: '3e24e17fd8ee0735556576d3d00bbe529272eb83', 
  GROQ_API_KEY: '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',

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
