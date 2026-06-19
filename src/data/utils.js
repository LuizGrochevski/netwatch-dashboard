export function relativeTime(isoString) {
  if (!isoString) return '—'

  // A API retorna "YYYY-MM-DD HH:MM:SS" em UTC, sem timezone explícito.
  // Forçamos a interpretação como UTC trocando o espaço por "T" e adicionando "Z".
  let normalized = isoString
  if (!isoString.includes('T') && !isoString.endsWith('Z')) {
    normalized = isoString.replace(' ', 'T') + 'Z'
  }

  const now = new Date().getTime()
  const then = new Date(normalized).getTime()

  const diffSec = Math.round((now - then) / 1000)
  if (diffSec <= 0) return 'agora mesmo'
  if (diffSec < 60) return `${diffSec}s atrás`

  const diffMin = Math.round(diffSec / 60)
  if (diffMin < 60) return `${diffMin}min atrás`

  const diffHr = Math.round(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h atrás`

  const diffDay = Math.round(diffHr / 24)
  return `${diffDay}d atrás`
}

export function portStateColor(state) {
  if (!state) return 'var(--text-dim)'
  const s = state.toLowerCase()
  if (s.includes('aberta') || s.includes('open')) return 'var(--signal-up)'
  if (s.includes('filtrada') || s.includes('filtered')) return 'var(--signal-warn)'
  return 'var(--text-dim)'
}
