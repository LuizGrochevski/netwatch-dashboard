function StatusBar({ stats, scanMeta }) {
  return (
    <header className="status-bar">
      <div className="status-bar__brand">
        <span className="status-bar__pulse" aria-hidden="true" />
        <div>
          <span className="status-bar__title mono">
            NETWATCH // <span style={{ color: 'var(--signal-up)' }}>SENTINEL_RS</span>
          </span>
          <p className="status-bar__subtitle">STATUS DE OPERAÇÃO DA REDE LOCAL</p>
        </div>
      </div>

      <div className="status-bar__metrics">
        <Metric label="hosts ativos" value={stats.hostsUp} tone="up" />
        <Metric label="hosts down" value={stats.hostsDown} tone="down" />
        <Metric label="portas abertas" value={stats.openPorts} tone="up" />
        <Metric label="protocolo" value={scanMeta?.protocol?.toUpperCase() ?? '—'} tone="neutral" />
      </div>
    </header>
  )
}

function Metric({ label, value, tone }) {
  return (
    <div className="metric">
      <span className={`metric__value mono metric__value--${tone}`}>{value}</span>
      <span className="metric__label">{label}</span>
    </div>
  )
}

export default StatusBar
