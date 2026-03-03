import axios from 'axios'
import { Task, CreateTaskRequest, UpdateTaskRequest } from '@/types/task'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
})

export const taskApi = {
  getAll: () => api.get<Task[]>('/api/tasks').then(r => r.data),
  getById: (id: number) => api.get<Task>(`/api/tasks/${id}`).then(r => r.data),
  create: (data: CreateTaskRequest) => api.post<Task>('/api/tasks', data).then(r => r.data),
  update: (id: number, data: UpdateTaskRequest) => api.patch<Task>(`/api/tasks/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/api/tasks/${id}`),
}

export default api
