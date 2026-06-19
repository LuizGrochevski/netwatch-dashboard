import { useState } from 'react'
import { login } from '../data/netwatchClient'

function Login({ onSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!username || !password) return
    setLoading(true)
    setError(null)
    try {
      const token = await login(username, password)
      onSuccess(token)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: 'var(--bg-panel)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius)',
        padding: '32px',
        width: '100%',
        maxWidth: '360px',
      }}>
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: 'var(--signal-up)',
              boxShadow: '0 0 8px rgba(61,220,132,0.5)',
              flexShrink: 0,
            }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '16px' }}>
              NETWATCH // <span style={{ color: 'var(--signal-up)' }}>SENTINEL_RS</span>
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
            AUTENTICAÇÃO REQUERIDA
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Usuário
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="username"
              style={{
                width: '100%',
                background: 'var(--bg-void)',
                border: '1px solid var(--line-bright)',
                borderRadius: 'var(--radius)',
                padding: '10px 12px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="current-password"
              style={{
                width: '100%',
                background: 'var(--bg-void)',
                border: '1px solid var(--line-bright)',
                borderRadius: 'var(--radius)',
                padding: '10px 12px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--signal-down)', fontFamily: 'var(--font-mono)' }}>
              ✗ {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              marginTop: '6px',
              padding: '11px',
              background: loading ? 'var(--signal-up-dim)' : 'var(--signal-up)',
              border: 'none',
              borderRadius: 'var(--radius)',
              color: '#0a0e0f',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '13px',
              cursor: loading ? 'not-allowed' : 'pointer',
              letterSpacing: '0.04em',
            }}
          >
            {loading ? 'autenticando…' : 'ENTRAR'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
