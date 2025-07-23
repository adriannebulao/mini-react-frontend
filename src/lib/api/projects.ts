import { request } from './api'
import type { CreateProjectInput, Project, UpdateProjectInput } from '@/types'

export const getProjects = () => request<Project[]>('/projects')

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
