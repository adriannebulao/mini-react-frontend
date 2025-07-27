import { request } from './api'
import type {
  Assignment,
  CreateProjectInput,
  Project,
  UpdateProjectInput,
} from '@/types'

export const getProjects = async (): Promise<Project[]> => {
  const response = await request<Project[]>('/projects')
  return response
}

export const getProjectById = async (id: string): Promise<Project> => {
  const response = await request<Project>(`/projects/${id}`)
  return response
}

export const createProject = async (
  data: CreateProjectInput,
): Promise<Project> => {
  const response = await request<Project>('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response
}

export const updateProject = async (
  id: string,
  data: UpdateProjectInput,
): Promise<Project> => {
  const response = await request<Project>(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response
}

export const deleteProject = (id: string) =>
  request<void>(`/projects/${id}`, {
    method: 'DELETE',
  })

export const getProjectEmployees = async (
  id: string,
): Promise<Assignment[]> => {
  const response = await request<Assignment[]>(`/projects/${id}/employees`)
  return response
}
