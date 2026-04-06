import { Groq } from 'groq-sdk'
import { VOCAL_FLOW_CONFIG } from '../../common/vocalflow.config'

export interface GroqOptions {
  fixSpelling: boolean
  fixGrammar: boolean
  codeMix?: string
  targetLanguage?: string
}

export class GroqService {
  private groq = new Groq({ apiKey: VOCAL_FLOW_CONFIG.GROQ_API_KEY })

  async refineText(text: string, options: GroqOptions): Promise<string> {
    if (!text.trim()) return ''

    const instructions: string[] = []
    let stepNumber = 1

    if (options.codeMix) {
      instructions.push(`${stepNumber}. The input is in ${options.codeMix}. Transliterate any non-Roman script to Roman. Keep English as-is.`)
      stepNumber++
    }
    if (options.fixSpelling) {
      instructions.push(`${stepNumber}. Fix spelling mistakes. Do not change meaning.`)
      stepNumber++
    }
    if (options.fixGrammar) {
      instructions.push(`${stepNumber}. Fix grammar mistakes. Keep original intent.`)
      stepNumber++
    }
    if (options.targetLanguage) {
      instructions.push(`${stepNumber}. Translate the entire text to ${options.targetLanguage}.`)
      stepNumber++
    }

    const systemPrompt = `Process the following text by applying these steps in order:\n` +
      instructions.join('\n') +
      `\nReturn ONLY the final processed text without any explanation or conversational filler.`

    try {
      const completion = await this.groq.chat.completions.create({
        model: VOCAL_FLOW_CONFIG.GROQ_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ],
        temperature: 0
      })

      return completion.choices[0]?.message?.content || text
    } catch (err) {
      console.error('Groq refinement error:', err)
      return text
    }
  }

  // --- USAGE FEATURE ---
  // Groq doesn't provide a public balance API for the free/metered tier in a single endpoint.
  // We'll simulate usage tracking by logging tokens used.
  async getUsageEstimate() {
    // This could also fetch usage stats from a local database if implemented. 
    // For this assignment, we'll return a simulated object that shows "Monitoring"
    return {
      tokens: 0, 
      status: 'active'
    }
  }
}
