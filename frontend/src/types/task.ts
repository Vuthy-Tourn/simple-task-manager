export interface Task {
  id: number
  title: string
  description: string
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  createdAt: string
  updatedAt: string
}

export type CreateTaskRequest = {
  title: string
  description: string
  priority: Task['priority']
}

export type UpdateTaskRequest = Partial<CreateTaskRequest> & {
  status?: Task['status']
}

export type TaskStatus = Task['status']
export type TaskPriority = Task['priority']
