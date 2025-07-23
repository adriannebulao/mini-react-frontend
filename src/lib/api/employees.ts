import { request } from './api'
import type {
  Assignment,
  CreateEmployeeInput,
  Employee,
  UpdateEmployeeInput,
} from '@/types'

export const getEmployees = async (): Promise<Employee[]> => {
  const response = await request<{ statusCode: number; body: string }>(
    '/employees',
  )
  const parsed = JSON.parse(response.body) as Employee[]
  return parsed
}

export const getEmployeeById = (id: string) =>
  request<Employee>(`/employees/${id}`)

export const createEmployee = (data: CreateEmployeeInput) =>
  request<Employee>('/employees', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const updateEmployee = (id: string, data: UpdateEmployeeInput) =>
  request<Employee>(`/employees/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

export const deleteEmployee = (id: string) =>
  request<void>(`/employees/${id}`, {
    method: 'DELETE',
  })

export const getEmployeeProjects = (id: string) =>
  request<Assignment[]>(`/employees/${id}/projects`)
