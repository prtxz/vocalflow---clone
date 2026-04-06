import { GlobalKeyboardListener } from 'node-global-key-listener'
import { VOCAL_FLOW_CONFIG } from '../../common/vocalflow.config'

export class HotkeyService {
  private vLog = new GlobalKeyboardListener()
  private isPressed = false
  private onHold: () => void
  private onRelease: () => void

  constructor(onHold: () => void, onRelease: () => void) {
    this.onHold = onHold
    this.onRelease = onRelease
  }

  start() {
    this.vLog.addListener((e, down) => {
      // Logic for holding a specific modifier
      // On Windows, Right Alt is often 'RIGHT ALT' or 'ALT GR'
      const targetKey = VOCAL_FLOW_CONFIG.RECORD_HOTKEY.toUpperCase()
      
      if (e.name.includes(targetKey)) {
        if (e.state === 'DOWN' && !this.isPressed) {
          this.isPressed = true
          this.onHold()
        } else if (e.state === 'UP' && this.isPressed) {
          this.isPressed = false
          this.onRelease()
        }
      }
    })
  }

  stop() {
    this.vLog.kill()
  }
}
