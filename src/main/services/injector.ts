import robot from 'robotjs'
import clipboardy from 'clipboardy'

export class TextInjector {
  async inject(text: string) {
    if (!text.trim()) return

    try {
      // 1. Save current clipboard
      const originalClipboard = await clipboardy.read()
      
      // 2. Set transcript to clipboard
      await clipboardy.write(text)
      
      // 3. Simulate Ctrl+V (Windows paste)
      // Small delay to ensure the active window is ready
      setTimeout(() => {
        robot.keyTap('v', 'control')
        
        // 4. (Optional) Restore original clipboard after a delay
        setTimeout(async () => {
          await clipboardy.write(originalClipboard)
        }, 1000)
      }, 100)
      
    } catch (err) {
      console.error('Text injection failed:', err)
      // Fallback: just alert or log
    }
  }
}
