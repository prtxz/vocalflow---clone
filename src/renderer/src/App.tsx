import React, { useState, useEffect } from 'react'
import { Layout, Settings as SettingsIcon, Activity, Mic, X, Minus, Square } from 'lucide-react'

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'settings'>('dashboard')

  useEffect(() => {
    // Listen for navigation from the tray
    const handleNavigate = (page: string) => {
      if (page === 'settings') setCurrentPage('settings')
      if (page === 'dashboard') setCurrentPage('dashboard')
    }

    // @ts-ignore
    window.api?.onNavigate(handleNavigate)
  }, [])

  return (
    <div className="container">
      <header className="titlebar">
        <div className="titlebar-logo">
          <Mic size={20} color="#3b82f6" />
          <span>VocalFlow</span>
        </div>
        <div className="titlebar-controls">
          <button className="control-btn" onClick={() => window.api?.windowMinimize()}>
            <Minus size={16} />
          </button>
          <button className="control-btn" onClick={() => window.api?.windowMaximize()}>
            <Square size={14} />
          </button>
          <button className="control-btn close" onClick={() => window.api?.windowClose()}>
            <X size={16} />
          </button>
        </div>
      </header>

      <nav style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          className={`glass-card ${currentPage === 'dashboard' ? 'active' : ''}`}
          onClick={() => setCurrentPage('dashboard')}
          style={{ padding: '10px 20px', cursor: 'pointer', border: currentPage === 'dashboard' ? '1px solid #3b82f6' : '' }}
        >
          <Activity size={18} style={{ marginRight: '8px' }} />
          Dashboard
        </button>
        <button 
          className={`glass-card ${currentPage === 'settings' ? 'active' : ''}`}
          onClick={() => setCurrentPage('settings')}
          style={{ padding: '10px 20px', cursor: 'pointer', border: currentPage === 'settings' ? '1px solid #3b82f6' : '' }}
        >
          <SettingsIcon size={18} style={{ marginRight: '8px' }} />
          Settings
        </button>
      </nav>

      <main className="content">
        {currentPage === 'dashboard' ? (
          <div className="dashboard-view">
            <div className="glass-card" style={{ marginBottom: '20px' }}>
              <h2 style={{ marginBottom: '15px' }}>API Status</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="status-item">
                  <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Deepgram Balance</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>$0.00</p>
                  <div style={{ width: '100%', height: '4px', background: '#374151', borderRadius: '2px', marginTop: '8px' }}>
                    <div style={{ width: '10%', height: '100%', background: '#3b82f6', borderRadius: '2px' }}></div>
                  </div>
                </div>
                <div className="status-item">
                  <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Groq Usage</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>0 Tokens</p>
                  <div style={{ width: '100%', height: '4px', background: '#374151', borderRadius: '2px', marginTop: '8px' }}>
                    <div style={{ width: '5%', height: '100%', background: '#10b981', borderRadius: '2px' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card">
              <h2 style={{ marginBottom: '15px' }}>Recent Transcripts</h2>
              <p style={{ color: '#9ca3af', textAlign: 'center', padding: '40px 0' }}>No transcripts yet. Hold 'Right Alt' to start recording.</p>
            </div>
          </div>
        ) : (
          <div className="settings-view glass-card">
            <h2 style={{ marginBottom: '15px' }}>App Settings</h2>
            <p style={{ color: '#9ca3af' }}>Configure your models and hotkeys here.</p>
            {/* Settings details will be added in Phase 3 */}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
