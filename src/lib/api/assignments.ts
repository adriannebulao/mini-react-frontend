import type { AssignmentInput, UnassignInput } from '@/types'
import { request } from './api'

export const assignEmployeeToProject = (data: AssignmentInput) =>
  request<void>('/assignments', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const unassignEmployeeFromProject = (data: UnassignInput) =>
  request<void>('/assignments', {
    method: 'DELETE',
    body: JSON.stringify(data),
  })
