import { uIOhook, UiohookKey } from 'uiohook-napi'
import { VOCAL_FLOW_CONFIG } from '../../common/vocalflow.config'

export class HotkeyService {
  private isPressed = false
  private onHold: () => void
  private onRelease: () => void

  constructor(onHold: () => void, onRelease: () => void) {
    this.onHold = onHold
    this.onRelease = onRelease
  }

  private isTargetKey(keycode: number): boolean {
    const target = VOCAL_FLOW_CONFIG.RECORD_HOTKEY.toLowerCase()
    if (target === 'alt') return keycode === UiohookKey.Alt || keycode === UiohookKey.AltRight
    if (target === 'control' || target === 'ctrl') return keycode === UiohookKey.Ctrl || keycode === UiohookKey.CtrlRight
    if (target === 'shift') return keycode === UiohookKey.Shift || keycode === UiohookKey.ShiftRight
    return false
  }

  start() {
    uIOhook.on('keydown', (e) => {
      if (this.isTargetKey(e.keycode)) {
        if (!this.isPressed) {
          this.isPressed = true
          this.onHold()
        }
      }
    })

    uIOhook.on('keyup', (e) => {
      if (this.isTargetKey(e.keycode)) {
        if (this.isPressed) {
          this.isPressed = false
          this.onRelease()
        }
      }
    })

    uIOhook.start()
  }

  stop() {
    uIOhook.stop()
  }
}
