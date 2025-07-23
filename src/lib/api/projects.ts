import { request } from './api'
import type {
  Assignment,
  CreateProjectInput,
  Project,
  UpdateProjectInput,
} from '@/types'

export const getProjects = async (): Promise<Project[]> => {
  const response = await request<{ statusCode: number; body: string }>(
    '/projects',
  )
  const parsed = JSON.parse(response.body) as Project[]
  return parsed
}

export const getProjectById = (id: string) =>
  request<Project>(`/projects/${id}`)

export const createProject = (data: CreateProjectInput) =>
  request<Project>('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const updateProject = (id: string, data: UpdateProjectInput) =>
  request<Project>(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

export const deleteProject = (id: string) =>
  request<void>(`/projects/${id}`, {
    method: 'DELETE',
  })

export const getProjectEmployees = (id: string) =>
  request<Assignment[]>(`/projects/${id}/employees`)
