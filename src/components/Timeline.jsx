import { relativeTime } from '../data/utils'

const TRACK_HEIGHT = 80

function Timeline({ items }) {
  const maxTargets = Math.max(...items.map((h) => h.targets?.length ?? 1), 1)

  return (
    <section style={{
      background: 'var(--bg-panel)',
      border: '1px solid var(--line)',
      borderRadius: 'var(--radius)',
      padding: '18px',
    }}>
      <h2 style={{
        fontSize: '12px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: 'var(--text-secondary)',
        margin: '0 0 16px',
        fontWeight: 500,
      }}>
        histórico de execuções
      </h2>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        {items.map((item) => (
          <div key={item.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 10px',
            background: 'var(--bg-void)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--line)',
          }}>
            <span style={{
              width: '7px', height: '7px', borderRadius: '50%',
              background: item.status === 'completed' ? 'var(--signal-up)' : 'var(--signal-warn)',
              flexShrink: 0,
            }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', flexShrink: 0 }}>
              #{item.id}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-primary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.targets?.join(', ')}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-dim)', flexShrink: 0 }}>
              {relativeTime(item.created_at)}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Timeline
