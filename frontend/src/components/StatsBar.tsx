'use client'
import { Task } from '@/types/task'

export default function StatsBar({ tasks }: { tasks: Task[] }) {
  const total = tasks.length
  const todo  = tasks.filter(t => t.status === 'TODO').length
  const inprog = tasks.filter(t => t.status === 'IN_PROGRESS').length
  const done  = tasks.filter(t => t.status === 'DONE').length
  const high  = tasks.filter(t => t.priority === 'HIGH').length
  const pct   = total ? Math.round((done / total) * 100) : 0

  const stats = [
    { label: 'Total',       value: total,  color: '#dce6f5' },
    { label: 'To Do',       value: todo,   color: '#4f8ef7' },
    { label: 'In Progress', value: inprog, color: '#f59e0b' },
    { label: 'Done',        value: done,   color: '#22d3a5' },
    { label: 'High Priority', value: high, color: '#f43f5e' },
  ]

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        {stats.map(s => (
          <div key={s.label} style={{
            background: '#0e1220', border: '1px solid #1c2540',
            borderRadius: 10, padding: '12px 18px',
            display: 'flex', flexDirection: 'column', gap: 2, minWidth: 100
          }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: s.color }}>{s.value}</span>
            <span style={{ fontSize: '.72rem', color: '#4a5f7a', fontFamily: 'IBM Plex Mono, monospace' }}>{s.label}</span>
          </div>
        ))}
      </div>
      {/* Progress bar */}
      {total > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            flex: 1, height: 4, background: '#1c2540', borderRadius: 4, overflow: 'hidden'
          }}>
            <div style={{
              width: `${pct}%`, height: '100%',
              background: 'linear-gradient(90deg, #4f8ef7, #22d3a5)',
              transition: 'width .4s ease', borderRadius: 4
            }} />
          </div>
          <span style={{
            fontFamily: 'IBM Plex Mono, monospace', fontSize: '.7rem', color: '#5a7099',
            minWidth: 40, textAlign: 'right'
          }}>{pct}%</span>
        </div>
      )}
    </div>
  )
}
