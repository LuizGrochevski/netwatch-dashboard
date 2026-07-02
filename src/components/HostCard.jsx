import { useState } from 'react'
import { relativeTime } from '../data/utils'
import { downloadReport } from '../data/netwatchClient'

function portColor(status) {
  if (!status) return 'var(--text-dim)'
  const s = status.toLowerCase()
  if (s.includes('aberta') || s.includes('open')) return 'var(--signal-up)'
  if (s.includes('filtrada') || s.includes('filtered')) return 'var(--signal-warn)'
  return 'var(--text-dim)'
}

const SEVERITY_COLOR = {
  CRITICAL: '#ff4d4d',
  HIGH: '#ff8c42',
  MEDIUM: '#e8c547',
  LOW: '#6fcf97',
  'N/A': 'var(--text-dim)',
}

function findCves(cvesByService, port) {
  if (!cvesByService) return []

  // Tenta pelo produto+versao primeiro (ex: "OpenSSH 6.6.1p1")
  if (port.produto) {
    const keyword = port.versao
      ? `${port.produto} ${port.versao}`
      : port.produto
    const key = Object.keys(cvesByService).find(
      (k) => k.toLowerCase() === keyword.toLowerCase()
    )
    if (key) return cvesByService[key]
  }

  // Fallback pelo nome do serviço genérico (ex: "HTTP")
  if (port.service) {
    const key = Object.keys(cvesByService).find(
      (k) => k.toLowerCase() === port.service.toLowerCase()
    )
    if (key) return cvesByService[key]
  }

  return []
}

function parsePortsScanned(str) {
  if (!str) return []
  return str.split(',').map((p) => p.trim()).filter(Boolean)
}

function HostCard({ result, scannedAt, cvesByService = {}, token, scanId }) {
  const [expanded, setExpanded] = useState(false)
  const openPorts = result.open_ports ?? []
  const isAlive = openPorts.length > 0
  const scannedPorts = parsePortsScanned(result.ports_scanned)
  const openPortNumbers = new Set(openPorts.map((p) => String(p.port)))
  const closedPorts = scannedPorts.filter((p) => !openPortNumbers.has(p))

  return (
    <article className={`host-card ${isAlive ? 'host-card--up' : 'host-card--down'}`}>
      <button
        className="host-card__header"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
      >
        <div className="host-card__identity">
          <span
            className={`host-card__dot ${isAlive ? 'host-card__dot--up' : 'host-card__dot--down'}`}
            aria-hidden="true"
          />
          <span className="host-card__ip mono">{result.target}</span>
        </div>

        <div className="host-card__summary">
          {isAlive ? (
            <span className="host-card__port-count mono">{openPorts.length} abertas</span>
          ) : (
            <span className="host-card__no-response">sem portas abertas</span>
          )}
          <span className="host-card__time mono">{relativeTime(scannedAt)}</span>
          <span className={`host-card__chevron ${expanded ? 'host-card__chevron--open' : ''}`}>
            ▾
          </span>
        </div>
      </button>

      {expanded && (
        <>
          {scanId && (
            <div className="host-card__export" style={{ display: 'flex', gap: '8px', padding: '8px 12px 0' }}>
              <button
                onClick={() => downloadReport(token, scanId, 'csv')}
                className="mono"
                style={{ background: 'none', border: '1px solid var(--line)', color: 'var(--text-secondary)', padding: '4px 10px', borderRadius: 'var(--radius)', cursor: 'pointer', fontSize: '11px' }}
              >
                ⬇ CSV
              </button>
              <button
                onClick={() => downloadReport(token, scanId, 'markdown')}
                className="mono"
                style={{ background: 'none', border: '1px solid var(--line)', color: 'var(--text-secondary)', padding: '4px 10px', borderRadius: 'var(--radius)', cursor: 'pointer', fontSize: '11px' }}
              >
                ⬇ Markdown
              </button>
            </div>
          )}

          <ul className="host-card__ports">
            {openPorts.map((p) => {
              const cves = findCves(cvesByService, p)
              return (
                <li key={`open-${p.port}`} className="port-row-group">
                  <div className="port-row">
                    <span className="port-row__indicator" style={{ background: portColor(p.status) }} aria-hidden="true" />
                    <span className="port-row__number mono">{p.port}</span>
                    <span className="port-row__service">{p.service}</span>
                    <span className="port-row__version">{p.status}</span>
                    <span className="port-row__status mono" style={{ color: portColor(p.status) }}>aberta</span>
                  </div>

                  {cves.length > 0 && (
                    <ul className="cve-list">
                      {cves.map((cve) => (
                        <li key={cve.id} className="cve-row mono">
                          <span
                            className="cve-row__severity"
                            style={{ color: SEVERITY_COLOR[cve.severity] ?? 'var(--text-dim)' }}
                          >
                            {cve.severity}
                          </span>
                          <span className="cve-row__id">{cve.id}</span>
                          <span className="cve-row__published">{cve.published}</span>
                          <span className="cve-row__desc">{cve.description}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}

            {closedPorts.map((port) => (
              <li key={`closed-${port}`} className="port-row" style={{ opacity: 0.5 }}>
                <span className="port-row__indicator" style={{ background: 'var(--text-dim)' }} aria-hidden="true" />
                <span className="port-row__number mono">{port}</span>
                <span className="port-row__service">—</span>
                <span className="port-row__version">escaneada, sem resposta</span>
                <span className="port-row__status mono" style={{ color: 'var(--text-dim)' }}>fechada</span>
              </li>
            ))}

            {openPorts.length === 0 && closedPorts.length === 0 && (
              <div className="host-card__empty">
                Nenhum dado de porta disponível para este target.
              </div>
            )}
          </ul>
        </>
      )}
    </article>
  )
}

export default HostCard
