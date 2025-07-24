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

export const getEmployeeById = async (id: string): Promise<Employee> => {
  const response = await request<{ statusCode: number; body: string }>(
    `/employees/${id}`,
  )
  const parsed = JSON.parse(response.body) as Employee
  return parsed
}

export const createEmployee = async (
  data: CreateEmployeeInput,
): Promise<Employee> => {
  const response = await request<{ statusCode: number; body: string }>(
    '/employees',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  )
  const parsed = JSON.parse(response.body) as Employee
  return parsed
}

export const updateEmployee = async (
  id: string,
  data: UpdateEmployeeInput,
): Promise<Employee> => {
  const response = await request<{ statusCode: number; body: string }>(
    `/employees/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
  )
  const parsed = JSON.parse(response.body) as Employee
  return parsed
}

export const deleteEmployee = (id: string) =>
  request<void>(`/employees/${id}`, {
    method: 'DELETE',
  })

export const getEmployeeProjects = async (
  id: string,
): Promise<Assignment[]> => {
  const response = await request<{ statusCode: number; body: string }>(
    `/employees/${id}/projects`,
  )
  const parsed = JSON.parse(response.body) as Assignment[]
  return parsed
}
