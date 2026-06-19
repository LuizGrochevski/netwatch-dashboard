import { useState } from 'react'
import { createScan } from '../data/netwatchClient'

function NewScanForm({ token, onScanComplete }) {
  const [targets, setTargets] = useState('')
  const [ports, setPorts] = useState('22,80,443')
  const [protocol, setProtocol] = useState('tcp')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [open, setOpen] = useState(false)

  async function handleSubmit() {
    if (!targets.trim()) {
      setError('Informe ao menos um target')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const targetList = targets.split(',').map((t) => t.trim()).filter(Boolean)
      await createScan(token, { targets: targetList, ports, protocol })
      setOpen(false)
      setTargets('')
      onScanComplete()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={triggerStyle}>
        + novo scan
      </button>
    )
  }

  return (
    <div style={panelStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
          novo scan
        </span>
        <button onClick={() => setOpen(false)} style={closeStyle}>✕</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Field label="targets (separados por vírgula)">
          <input
            type="text"
            value={targets}
            onChange={(e) => setTargets(e.target.value)}
            placeholder="192.168.1.1, google.com"
            style={inputStyle}
          />
        </Field>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1 }}>
            <Field label="portas">
              <input
                type="text"
                value={ports}
                onChange={(e) => setPorts(e.target.value)}
                placeholder="22,80,443"
                style={inputStyle}
              />
            </Field>
          </div>
          <div style={{ width: '110px' }}>
            <Field label="protocolo">
              <select
                value={protocol}
                onChange={(e) => setProtocol(e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="tcp">TCP</option>
                <option value="udp">UDP</option>
              </select>
            </Field>
          </div>
        </div>

        {error && (
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--signal-down)', fontFamily: 'var(--font-mono)' }}>
            ✗ {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            padding: '10px',
            background: loading ? 'var(--signal-up-dim)' : 'var(--signal-up)',
            border: 'none',
            borderRadius: 'var(--radius)',
            color: '#0a0e0f',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: '12px',
            cursor: loading ? 'not-allowed' : 'pointer',
            letterSpacing: '0.04em',
          }}
        >
          {loading ? 'escaneando…' : 'EXECUTAR SCAN'}
        </button>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{
        display: 'block',
        fontSize: '10px',
        color: 'var(--text-secondary)',
        marginBottom: '5px',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
      }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const triggerStyle = {
  background: 'var(--bg-panel)',
  border: '1px solid var(--line-bright)',
  borderRadius: 'var(--radius)',
  color: 'var(--signal-up)',
  fontFamily: 'var(--font-mono)',
  fontSize: '12px',
  padding: '8px 14px',
  cursor: 'pointer',
  fontWeight: 600,
}

const panelStyle = {
  background: 'var(--bg-panel)',
  border: '1px solid var(--line)',
  borderRadius: 'var(--radius)',
  padding: '16px',
  marginBottom: '16px',
}

const closeStyle = {
  background: 'none',
  border: 'none',
  color: 'var(--text-dim)',
  cursor: 'pointer',
  fontSize: '14px',
}

const inputStyle = {
  width: '100%',
  background: 'var(--bg-void)',
  border: '1px solid var(--line-bright)',
  borderRadius: 'var(--radius)',
  padding: '9px 10px',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-mono)',
  fontSize: '13px',
  outline: 'none',
  boxSizing: 'border-box',
}

export default NewScanForm
