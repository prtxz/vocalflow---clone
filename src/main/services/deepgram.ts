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
      this.client.send(chunk as any)
    }
  }

  async close() {
    if (this.client) {
      this.client.finish()
      this.client = null
    }
  }

  // --- BALANCE FEATURE ---
  async getBalance(): Promise<{ amount: number | null; units: string; unavailable?: boolean }> {
    try {
      const apiKey = VOCAL_FLOW_CONFIG.DEEPGRAM_API_KEY;
      if (!apiKey) return { amount: null, units: 'USD', unavailable: true };

      const headers = {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json'
      };

      // Fetch projects first
      const projRes = await fetch('https://api.deepgram.com/v1/projects', { headers });
      if (!projRes.ok) {
        throw new Error(`Projects API returned ${projRes.status} ${projRes.statusText}`);
      }
      const projData = await projRes.json();
      if (!projData.projects || projData.projects.length === 0) {
        return { amount: null, units: 'USD', unavailable: true };
      }

      const projectId = projData.projects[0].project_id;

      // Fetch balances for the project
      const balRes = await fetch(`https://api.deepgram.com/v1/projects/${projectId}/balances`, { headers });
      if (!balRes.ok) {
        throw new Error(`Balances API returned ${balRes.status} ${balRes.statusText}`);
      }
      const balData = await balRes.json();

      // Usually returns an array of balances
      const first = balData.balances?.[0];
      if (!first) return { amount: null, units: 'USD', unavailable: true };
      return { amount: first.amount ?? 0, units: first.units ?? 'USD' };
    } catch (err: any) {
      // This is expected when the API key doesn't have balance:read scope.
      // Log the real reason so it shows in Electron's terminal for debugging.
      console.log(`[Deepgram] Balance fetch unavailable: ${err?.message ?? err}`);
      return { amount: null, units: 'USD', unavailable: true };
    }
  }
}
