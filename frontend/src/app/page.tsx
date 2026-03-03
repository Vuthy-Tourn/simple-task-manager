'use client'

import { useState, useEffect, useCallback } from 'react'
import { Task, CreateTaskRequest, TaskStatus } from '@/types/task'
import { taskApi } from '@/lib/api'
import TaskCard from '@/components/TaskCard'
import TaskModal from '@/components/TaskModal'
import StatsBar from '@/components/StatsBar'

const COLUMNS: { key: TaskStatus; label: string; color: string }[] = [
  { key: 'TODO',        label: 'To Do',       color: '#4f8ef7' },
  { key: 'IN_PROGRESS', label: 'In Progress',  color: '#f59e0b' },
  { key: 'DONE',        label: 'Done',         color: '#22d3a5' },
]

export default function Home() {
  const [tasks, setTasks]       = useState<Task[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editTask, setEditTask]   = useState<Task | null>(null)

  const load = useCallback(async () => {
    try {
      setError(null)
      const data = await taskApi.getAll()
      setTasks(data)
    } catch {
      setError('Cannot connect to backend. Is Spring Boot running?')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleCreate = async (req: CreateTaskRequest) => {
    await taskApi.create(req)
    await load()
    setShowModal(false)
  }

  const handleUpdate = async (id: number, data: Partial<Task>) => {
    await taskApi.update(id, data)
    await load()
    setEditTask(null)
  }

  const handleDelete = async (id: number) => {
    await taskApi.delete(id)
    await load()
  }

  const handleStatusChange = async (task: Task, status: TaskStatus) => {
    await taskApi.update(task.id, { status })
    await load()
  }

  const byStatus = (status: TaskStatus) => tasks.filter(t => t.status === status)

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e1a' }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid #1c2540',
        background: 'rgba(10,14,26,.9)',
        backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 50,
        padding: '0 32px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '1.3rem' }}>⚡</span>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-.02em' }}>
            Task<span style={{ color: '#4f8ef7' }}>Manager</span>
          </span>
          <span style={{
            fontFamily: 'IBM Plex Mono, monospace', fontSize: '.6rem',
            background: 'rgba(79,142,247,.12)', color: '#4f8ef7',
            border: '1px solid rgba(79,142,247,.25)', borderRadius: 4,
            padding: '2px 7px', letterSpacing: '.06em'
          }}>BETA</span>
        </div>
        <button
          onClick={() => { setEditTask(null); setShowModal(true) }}
          style={{
            background: '#4f8ef7', color: 'white',
            border: 'none', borderRadius: 8,
            padding: '8px 18px', fontFamily: 'Syne, sans-serif',
            fontWeight: 700, fontSize: '.85rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6
          }}
        >
          + New Task
        </button>
      </header>

      <main style={{ padding: '28px 32px', maxWidth: 1400, margin: '0 auto' }}>
        <StatsBar tasks={tasks} />

        {error && (
          <div style={{
            background: 'rgba(244,63,94,.1)', border: '1px solid rgba(244,63,94,.3)',
            borderRadius: 10, padding: '14px 18px', marginBottom: 24,
            color: '#fb7185', fontFamily: 'IBM Plex Mono, monospace', fontSize: '.82rem'
          }}>
            ⚠ {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', paddingTop: 80, color: '#4a5f7a' }}>
            Loading tasks...
          </div>
        ) : (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 20, marginTop: 24
          }}>
            {COLUMNS.map(col => (
              <div key={col.key}>
                {/* Column header */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  marginBottom: 14
                }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: col.color, boxShadow: `0 0 8px ${col.color}`
                  }} />
                  <span style={{ fontWeight: 700, fontSize: '.95rem' }}>{col.label}</span>
                  <span style={{
                    marginLeft: 'auto',
                    fontFamily: 'IBM Plex Mono, monospace', fontSize: '.72rem',
                    background: '#1c2540', color: '#5a7099',
                    borderRadius: 4, padding: '2px 8px'
                  }}>{byStatus(col.key).length}</span>
                </div>

                {/* Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {byStatus(col.key).length === 0 ? (
                    <div style={{
                      border: '1px dashed #1c2540', borderRadius: 10,
                      padding: '28px 16px', textAlign: 'center',
                      color: '#3d5070', fontSize: '.82rem'
                    }}>
                      No tasks here
                    </div>
                  ) : (
                    byStatus(col.key).map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={() => { setEditTask(task); setShowModal(true) }}
                        onDelete={() => handleDelete(task.id)}
                        onStatusChange={(s) => handleStatusChange(task, s)}
                      />
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <TaskModal
          task={editTask}
          onClose={() => { setShowModal(false); setEditTask(null) }}
          onCreate={handleCreate}
          onUpdate={(data) => editTask && handleUpdate(editTask.id, data)}
        />
      )}
    </div>
  )
}
