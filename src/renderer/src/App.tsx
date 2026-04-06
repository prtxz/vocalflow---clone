import React, { useState, useEffect } from 'react'
import { Activity, Settings as SettingsIcon, Mic, X, Minus, Square, Info } from 'lucide-react'

// --- Types ---
interface BalanceData {
  deepgram: { amount: number; units: string }
  groq: { tokens: number; status: string }
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'settings'>('dashboard')
  const [isRecording, setIsRecording] = useState(false)
  const [partialTranscript, setPartialTranscript] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [balance, setBalance] = useState<BalanceData>({
    deepgram: { amount: 0, units: 'USD' },
    groq: { tokens: 0, status: 'active' }
  })

  useEffect(() => {
    // @ts-ignore
    window.api?.onNavigate((page: string) => {
      setCurrentPage(page as any)
    })

    // Listen for balance updates from main process
    // @ts-ignore
    window.electron?.ipcRenderer.on('balance-update', (_: any, data: BalanceData) => {
      setBalance(data)
    })

    // @ts-ignore
    window.electron?.ipcRenderer.on('partial-transcript', (_: any, text: string) => {
      setPartialTranscript(prev => prev + ' ' + text)
    })

    // Listen for recording status
    // @ts-ignore
    window.electron?.ipcRenderer.on('recording-started', () => {
      setIsRecording(true)
      setPartialTranscript('') // Reset for new session
    })

    // @ts-ignore
    window.electron?.ipcRenderer.on('recording-stopped', () => {
      setIsRecording(false)
      // Transition from partial to history could be done here if desired
    })
  }, [])

  const togglePage = (page: 'dashboard' | 'settings') => setCurrentPage(page)

  return (
    <div className="container">
      {/* Titlebar */}
      <header className="titlebar">
        <div className="titlebar-logo">
          <div style={{ background: '#3b82f6', borderRadius: '50%', padding: '4px', display: 'flex' }}>
            <Mic size={14} color="white" />
          </div>
          <span>VocalFlow <span style={{ color: '#3b82f6', fontSize: '0.7rem' }}>WINDOWS</span></span>
        </div>
        <div className="titlebar-controls">
          {/* @ts-ignore */}
          <button className="control-btn" onClick={() => window.api?.windowMinimize()}><Minus size={16} /></button>
          {/* @ts-ignore */}
          <button className="control-btn" onClick={() => window.api?.windowMaximize()}><Square size={14} /></button>
          {/* @ts-ignore */}
          <button className="control-btn close" onClick={() => window.api?.windowClose()}><X size={16} /></button>
        </div>
      </header>

      {/* Tabs */}
      <nav style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          className={`glass-card tab-btn ${currentPage === 'dashboard' ? 'active' : ''}`}
          onClick={() => togglePage('dashboard')}
          style={{ 
            padding: '12px 24px', cursor: 'pointer', flex: 1, 
            background: currentPage === 'dashboard' ? 'rgba(59, 130, 246, 0.2)' : 'var(--glass-bg)',
            borderColor: currentPage === 'dashboard' ? '#3b82f6' : 'var(--glass-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s'
          }}
        >
          <Activity size={18} style={{ marginRight: '8px' }} />
          Dashboard
        </button>
        <button 
          className={`glass-card tab-btn ${currentPage === 'settings' ? 'active' : ''}`}
          onClick={() => togglePage('settings')}
          style={{ 
            padding: '12px 24px', cursor: 'pointer', flex: 1,
            background: currentPage === 'settings' ? 'rgba(59, 130, 246, 0.2)' : 'var(--glass-bg)',
            borderColor: currentPage === 'settings' ? '#3b82f6' : 'var(--glass-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s'
          }}
        >
          <SettingsIcon size={18} style={{ marginRight: '8px' }} />
          Settings
        </button>
      </nav>

      {/* View Content */}
      <main className="content">
        {currentPage === 'dashboard' ? (
          <div className="view-dashboard" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* API Balance Section */}
            <div className="glass-card" style={{ borderLeft: '4px solid #3b82f6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>API Usage Monitoring</h3>
                <Info size={16} color="#9ca3af" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="balance-item">
                  <p style={{ color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Deepgram Project Balance</p>
                  <p style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '4px' }}>
                    {balance.deepgram.units === 'USD' ? '$' : ''}{balance.deepgram.amount.toFixed(2)}
                  </p>
                  <div className="progress-bar" style={{ height: '4px', width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '10px' }}>
                    <div style={{ width: `${Math.min(balance.deepgram.amount * 10, 100)}%`, height: '100%', background: '#3b82f6', borderRadius: '2px' }}></div>
                  </div>
                </div>
                <div className="balance-item">
                  <p style={{ color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Groq Refinement Status</p>
                  <p style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '4px', color: '#10b981' }}>
                    {balance.groq.status.toUpperCase()}
                  </p>
                  <p style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '4px' }}>Real-time LPU tracking active</p>
                </div>
              </div>
            </div>

            {/* Recording / History Section */}
            <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Session Log</h3>
                {isRecording && <span className="recording-dot">RECORDING</span>}
              </div>
              
              <div style={{ flex: 1, maxHeight: '250px', overflowY: 'auto', paddingRight: '10px' }}>
                {partialTranscript ? (
                  <div className="transcript-live" style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59,130,246,0.3)', padding: '15px', borderRadius: '8px', fontStyle: 'italic' }}>
                    {partialTranscript}...
                  </div>
                ) : history.length > 0 ? (
                  history.map((t, i) => (
                    <div key={i} style={{ padding: '10px', borderBottom: '1px solid var(--glass-border)', fontSize: '0.9rem' }}>{t}</div>
                  ))
                ) : (
                  <div style={{ padding: '40px 0', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Mic size={24} color="#374151" />
                    </div>
                    <p style={{ color: '#6b7280', maxWidth: '300px' }}>
                      Hold the project's hotkey (R-Alt) to dictate. Release to auto-paste your transcript.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        ) : (
          <div className="view-settings glass-card" style={{ flex: 1 }}>
            <h2 style={{ marginBottom: '20px' }}>Configuration</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="setting-row">
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.8rem', marginBottom: '8px' }}>Dictation Model</label>
                <div className="glass-card" style={{ padding: '10px' }}>Deepgram Nova-2 (Optimized)</div>
              </div>
              <div className="setting-row">
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.8rem', marginBottom: '8px' }}>Refinement Model</label>
                <div className="glass-card" style={{ padding: '10px' }}>Groq llama-3.3-70b-versatile</div>
              </div>
              <div className="setting-row" style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.8rem', marginBottom: '8px' }}>Fix Spelling</label>
                  <div className="glass-card" style={{ padding: '10px', color: '#10b981' }}>Enabled</div>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.8rem', marginBottom: '8px' }}>Fix Grammar</label>
                  <div className="glass-card" style={{ padding: '10px', color: '#10b981' }}>Enabled</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer / Status Bar */}
      <footer style={{ marginTop: '20px', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#6b7280', borderTop: '1px solid var(--glass-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
          CONNECTED TO DEEPGRAM
        </div>
        <div>V1.0.0 PRO EDITION</div>
      </footer>

      <style>{`
        .recording-dot {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #ef4444;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }

        .tab-btn:hover {
          filter: brightness(1.2);
        }

        .tab-btn.active {
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
        }
      `}</style>
    </div>
  )
}

export default App
