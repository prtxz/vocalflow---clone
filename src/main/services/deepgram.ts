import { createClient, LiveClient, LiveTranscriptionEvents } from '@deepgram/sdk'
import { VOCAL_FLOW_CONFIG } from '../../common/vocalflow.config'
import { EventEmitter } from 'events'

export class DeepgramService extends EventEmitter {
  private client: LiveClient | null = null
  private dgClient = createClient(VOCAL_FLOW_CONFIG.DEEPGRAM_API_KEY)

  async connect() {
    this.client = this.dgClient.listen.live({
      model: VOCAL_FLOW_CONFIG.DEEPGRAM_MODEL,
      language: VOCAL_FLOW_CONFIG.DEEPGRAM_LANGUAGE,
      smart_format: true,
      interim_results: true,
      encoding: 'linear16',
      sample_rate: 16000,
    })

    this.client.on(LiveTranscriptionEvents.Open, () => {
      this.emit('open')
    })

    this.client.on(LiveTranscriptionEvents.Transcript, (data) => {
      const transcript = data.channel.alternatives[0].transcript
      if (transcript && data.is_final) {
        this.emit('transcript', transcript)
      }
    })

    this.client.on(LiveTranscriptionEvents.Error, (err) => {
      this.emit('error', err)
    })
  }

  sendAudio(chunk: Buffer) {
    if (this.client) {
      this.client.send(chunk)
    }
  }

  async close() {
    if (this.client) {
      this.client.finish()
      this.client = null
    }
  }

  // --- BALANCE FEATURE ---
  async getBalance() {
    try {
      // Per Deepgram docs: GET /v1/projects
      // We assume the first project for this assignment
      const { result, error } = await this.dgClient.manage.getProjects()
      if (error) throw error
      
      const projectId = result.projects[0].project_id
      const { result: balances, error: bError } = await this.dgClient.manage.getProjectBalances(projectId)
      if (bError) throw bError
      
      // Usually returns an array of balances
      return balances.balances[0] || { amount: 0, units: 'USD' }
    } catch (err) {
      console.error('Failed to fetch Deepgram balance:', err)
      return { amount: 0, units: 'USD' }
    }
  }
}
