import { ChildProcess, spawn } from 'child_process'
import { EventEmitter } from 'events'
import { app } from 'electron'
import { join } from 'path'


let soxPath = require('sox-bin');
if (!soxPath || soxPath === 'sox') {
  soxPath = join(app.getAppPath(), 'node_modules', 'sox-bin', 'vendor', 'windows', 'sox.exe');
}

export class AudioService extends EventEmitter {
  private recorder: ChildProcess | null = null

  start() {
    console.log('Using sox path:', soxPath);

    // On Windows, Sox only supports the 'waveaudio' driver.
    // We read from the default waveaudio device ("") and convert to
    // 16-bit, 16kHz, mono WAV piped to stdout for Deepgram streaming.
    this.recorder = spawn(soxPath, [
      '-t', 'waveaudio', // Windows audio driver
      '',               // empty string = default recording device
      '-r', '16000',
      '-c', '1',
      '-b', '16',
      '-e', 'signed-integer',
      '-t', 'wav',
      '-'
    ])

    this.recorder.stdout?.on('data', (chunk) => {
      this.emit('data', chunk)
    })

    this.recorder.stderr?.on('data', (data) => {
      const msg = data.toString().trim()
      if (msg) console.log(`[sox]: ${msg}`)
    })

    this.recorder.on('exit', (code) => {
      if (code !== null && code !== 0) {
        console.error(`[sox] Exited with code ${code}. Is a microphone plugged in?`)
        this.emit('error', new Error(`sox exited with code ${code}`))
      }
    })

    this.recorder.on('error', (err) => {
      console.error('[sox] Spawn error:', err)
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
