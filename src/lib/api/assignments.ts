import type { AssignmentInput, UnassignInput } from '@/types'
import { request } from './api'

export const assignEmployeeToProject = async (
  data: AssignmentInput,
): Promise<void> => {
  await request<{ statusCode: number; body: string }>('/assignments', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return
}

export const unassignEmployeeFromProject = async (
  data: UnassignInput,
): Promise<void> => {
  await request<{ statusCode: number; body: string }>('/assignments', {
    method: 'DELETE',
    body: JSON.stringify(data),
  })
  return
}
