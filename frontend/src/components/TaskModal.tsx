'use client'
import { useState, useEffect } from 'react'
import { Task, CreateTaskRequest, TaskPriority, TaskStatus } from '@/types/task'

interface Props {
  task: Task | null
  onClose: () => void
  onCreate: (data: CreateTaskRequest) => void
  onUpdate: (data: Partial<Task>) => void
}

const inputStyle = {
  width: '100%', background: '#0a0e1a',
  border: '1px solid #243058', borderRadius: 8,
  padding: '10px 12px', color: '#dce6f5',
  fontFamily: 'IBM Plex Mono, monospace', fontSize: '.82rem',
  outline: 'none', boxSizing: 'border-box' as const
}

export default function TaskModal({ task, onClose, onCreate, onUpdate }: Props) {
  const [title, setTitle]         = useState('')
  const [description, setDesc]    = useState('')
  const [priority, setPriority]   = useState<TaskPriority>('MEDIUM')
  const [status, setStatus]       = useState<TaskStatus>('TODO')
  const [saving, setSaving]       = useState(false)

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDesc(task.description || '')
      setPriority(task.priority)
      setStatus(task.status)
    }
  }, [task])

  const handleSubmit = async () => {
    if (!title.trim()) return
    setSaving(true)
    try {
      if (task) {
        await onUpdate({ title, description, priority, status })
      } else {
        await onCreate({ title, description, priority })
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20
    }} onClick={onClose}>
      <div style={{
        background: '#0e1220', border: '1px solid #243058',
        borderRadius: 14, padding: 28, width: '100%', maxWidth: 480,
        boxShadow: '0 24px 60px rgba(0,0,0,.5)'
      }} onClick={e => e.stopPropagation()}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <h2 style={{ fontWeight: 800, fontSize: '1.1rem' }}>
            {task ? 'Edit Task' : 'New Task'}
          </h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: '#4a5f7a',
            cursor: 'pointer', fontSize: '1.1rem', padding: '2px 6px'
          }}>✕</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: '.75rem', color: '#5a7099', marginBottom: 6, fontFamily: 'IBM Plex Mono, monospace' }}>
              TITLE *
            </label>
            <input
              style={inputStyle}
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Task title..."
              autoFocus
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '.75rem', color: '#5a7099', marginBottom: 6, fontFamily: 'IBM Plex Mono, monospace' }}>
              DESCRIPTION
            </label>
            <textarea
              style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }}
              value={description}
              onChange={e => setDesc(e.target.value)}
              placeholder="Optional description..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: '.75rem', color: '#5a7099', marginBottom: 6, fontFamily: 'IBM Plex Mono, monospace' }}>
                PRIORITY
              </label>
              <select style={inputStyle} value={priority} onChange={e => setPriority(e.target.value as TaskPriority)}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            {task && (
              <div>
                <label style={{ display: 'block', fontSize: '.75rem', color: '#5a7099', marginBottom: 6, fontFamily: 'IBM Plex Mono, monospace' }}>
                  STATUS
                </label>
                <select style={inputStyle} value={status} onChange={e => setStatus(e.target.value as TaskStatus)}>
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button onClick={onClose} style={{
            flex: 1, background: 'none', border: '1px solid #243058',
            borderRadius: 8, padding: '10px', color: '#5a7099',
            cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '.85rem'
          }}>Cancel</button>
          <button onClick={handleSubmit} disabled={saving || !title.trim()} style={{
            flex: 2, background: saving ? '#2a3f6f' : '#4f8ef7',
            border: 'none', borderRadius: 8, padding: '10px', color: 'white',
            cursor: saving ? 'not-allowed' : 'pointer',
            fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '.85rem',
            transition: 'background .15s'
          }}>
            {saving ? 'Saving...' : task ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  )
}
