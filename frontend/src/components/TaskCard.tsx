'use client'
import { Task, TaskStatus } from '@/types/task'

const PRIORITY_COLOR: Record<string, string> = {
  LOW: '#22d3a5', MEDIUM: '#f59e0b', HIGH: '#f43f5e'
}
const STATUS_NEXT: Record<TaskStatus, TaskStatus> = {
  TODO: 'IN_PROGRESS', IN_PROGRESS: 'DONE', DONE: 'TODO'
}
const STATUS_LABEL: Record<TaskStatus, string> = {
  TODO: 'To Do', IN_PROGRESS: 'In Progress', DONE: 'Done'
}

interface Props {
  task: Task
  onEdit: () => void
  onDelete: () => void
  onStatusChange: (s: TaskStatus) => void
}

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }: Props) {
  const pColor = PRIORITY_COLOR[task.priority]
  const date = new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return (
    <div style={{
      background: '#0e1220',
      border: '1px solid #1c2540',
      borderRadius: 10,
      padding: '16px',
      transition: 'border .15s',
      position: 'relative',
      overflow: 'hidden'
    }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = '#243058')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = '#1c2540')}
    >
      {/* Priority stripe */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: pColor, opacity: .7
      }} />

      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{
          fontFamily: 'IBM Plex Mono, monospace', fontSize: '.6rem',
          color: pColor, background: `${pColor}18`,
          border: `1px solid ${pColor}30`, borderRadius: 4,
          padding: '2px 7px', letterSpacing: '.06em'
        }}>
          {task.priority}
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={onEdit} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#4a5f7a', fontSize: '.8rem', padding: '2px 6px',
            borderRadius: 4, transition: 'color .15s'
          }}
            onMouseEnter={e => (e.currentTarget.style.color = '#dce6f5')}
            onMouseLeave={e => (e.currentTarget.style.color = '#4a5f7a')}
          >✎</button>
          <button onClick={onDelete} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#4a5f7a', fontSize: '.8rem', padding: '2px 6px',
            borderRadius: 4, transition: 'color .15s'
          }}
            onMouseEnter={e => (e.currentTarget.style.color = '#f43f5e')}
            onMouseLeave={e => (e.currentTarget.style.color = '#4a5f7a')}
          >✕</button>
        </div>
      </div>

      <div style={{ fontWeight: 700, fontSize: '.92rem', marginBottom: 6, lineHeight: 1.3 }}>
        {task.title}
      </div>

      {task.description && (
        <div style={{
          fontSize: '.78rem', color: '#5a7099',
          lineHeight: 1.5, marginBottom: 12,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden'
        }}>
          {task.description}
        </div>
      )}

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
        <span style={{
          fontFamily: 'IBM Plex Mono, monospace', fontSize: '.65rem', color: '#3d5070'
        }}>{date}</span>
        <button
          onClick={() => onStatusChange(STATUS_NEXT[task.status])}
          style={{
            fontFamily: 'IBM Plex Mono, monospace', fontSize: '.65rem',
            background: '#1c2540', color: '#5a7099',
            border: '1px solid #243058', borderRadius: 5,
            padding: '3px 8px', cursor: 'pointer', transition: 'all .15s'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#243058'; e.currentTarget.style.color = '#dce6f5' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#1c2540'; e.currentTarget.style.color = '#5a7099' }}
          title={`Move to ${STATUS_LABEL[STATUS_NEXT[task.status]]}`}
        >
          → {STATUS_LABEL[STATUS_NEXT[task.status]]}
        </button>
      </div>
    </div>
  )
}
