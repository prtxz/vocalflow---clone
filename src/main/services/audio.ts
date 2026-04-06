import { ChildProcess, spawn } from 'child_process'
import { EventEmitter } from 'events'

export class AudioService extends EventEmitter {
  private recorder: ChildProcess | null = null

  start() {
    // We use sox or rec for recording on Windows (requires installation)
    // Alternatively, a native Node module or using Electron's browser-based recording.
    // For a "Proper Clone", we'll use a standardized streaming approach.
    
    this.recorder = spawn('sox', [
      '-d', 
      '-r', '16000', 
      '-c', '1', 
      '-b', '16', 
      '-t', 'wav', 
      '-'
    ])

    this.recorder.stdout?.on('data', (chunk) => {
      this.emit('data', chunk)
    })

    this.recorder.on('error', (err) => {
      console.error('Audio recorder error:', err)
      this.emit('error', err)
    })
  }

  stop() {
    if (this.recorder) {
      this.recorder.kill()
      this.recorder = null
    }
  }
}
