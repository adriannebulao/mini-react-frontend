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

export const getProjectById = async (id: string): Promise<Project> => {
  const response = await request<{ statusCode: number; body: string }>(
    `/projects/${id}`,
  )
  const parsed = JSON.parse(response.body) as Project
  return parsed
}

export const createProject = async (
  data: CreateProjectInput,
): Promise<Project> => {
  const response = await request<{ statusCode: number; body: string }>(
    '/projects',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  )
  const parsed = JSON.parse(response.body) as Project
  return parsed
}

export const updateProject = async (
  id: string,
  data: UpdateProjectInput,
): Promise<Project> => {
  const response = await request<{ statusCode: number; body: string }>(
    `/projects/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
  )
  const parsed = JSON.parse(response.body) as Project
  return parsed
}

export const deleteProject = (id: string) =>
  request<void>(`/projects/${id}`, {
    method: 'DELETE',
  })

export const getProjectEmployees = async (
  id: string,
): Promise<Assignment[]> => {
  const response = await request<{ statusCode: number; body: string }>(
    `/projects/${id}/employees`,
  )
  const parsed = JSON.parse(response.body) as Assignment[]
  return parsed
}
