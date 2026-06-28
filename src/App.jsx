import { useEffect, useState, useCallback } from 'react'
import Login from './components/Login'
import StatusBar from './components/StatusBar'
import HostCard from './components/HostCard'
import Timeline from './components/Timeline'
import NewScanForm from './components/NewScanForm'
import { fetchScanDetail, fetchHistory, fetchScanCves } from './data/netwatchClient'
import './styles/app.css'

function App() {
  const [token, setToken] = useState(null)
  const [scanDetail, setScanDetail] = useState(null)
  const [cvesByService, setCvesByService] = useState({})
  const [history, setHistory] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const historyData = await fetchHistory(token, 1)
      if (!historyData.items?.length) {
        setHistory(historyData)
        setScanDetail(null)
        return
      }
      const latestId = historyData.items[0].id
      const detailData = await fetchScanDetail(token, latestId)
      const cvesData = await fetchScanCves(token, latestId).catch(() => ({ cves: {} }))
      setHistory(historyData)
      setScanDetail(detailData)
      setCvesByService(cvesData.cves ?? {})
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { load() }, [load])

  if (!token) return <Login onSuccess={setToken} />

  if (loading && !history) {
    return (
      <div className="app-state">
        <span className="loading-pulse mono">consultando sentinel-rs…</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app-state app-state--error">
        <p className="mono">scan_error: {error}</p>
        <button onClick={() => setToken(null)} style={btnStyle}>voltar ao login</button>
      </div>
    )
  }

  const results = scanDetail?.results ?? []
  const hostsUp = results.filter((r) => r.open_ports?.length > 0).length
  const hostsDown = results.filter((r) => !r.open_ports?.length).length
  const openPorts = results.reduce((sum, r) => sum + (r.open_ports?.length ?? 0), 0)
  const stats = { hostsUp, hostsDown, openPorts, totalHosts: results.length }
  const scanMeta = scanDetail ? { protocol: scanDetail.results?.[0]?.protocol ?? '—' } : null

  return (
    <div className="app-shell">
      <StatusBar stats={stats} scanMeta={scanMeta} />

      <main className="app-main">
        <section className="host-list" aria-label="targets detectados">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <h2 className="host-list__title" style={{ margin: 0 }}>
              targets detectados ({results.length})
            </h2>
            <NewScanForm token={token} onScanComplete={load} />
          </div>

          {results.length === 0 && (
            <p className="mono" style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
              Nenhum scan ainda. Use "+ novo scan" para começar.
            </p>
          )}

          {results.map((result) => (
            <HostCard
              key={result.target}
              result={result}
              scannedAt={scanDetail.created_at}
              cvesByService={cvesByService}
            />
          ))}
        </section>

        {history?.items?.length > 0 && <Timeline items={history.items} />}
      </main>

      <footer className="app-footer mono" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>netwatch-dashboard · api conectada</span>
        <button
          onClick={() => { setToken(null); setScanDetail(null); setHistory(null) }}
          style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '12px' }}
        >
          sair
        </button>
      </footer>
    </div>
  )
}

const btnStyle = {
  marginTop: '12px',
  background: 'none',
  border: '1px solid var(--line)',
  color: 'var(--text-secondary)',
  padding: '8px 16px',
  cursor: 'pointer',
  fontFamily: 'var(--font-mono)',
  borderRadius: 'var(--radius)',
}

export default App
