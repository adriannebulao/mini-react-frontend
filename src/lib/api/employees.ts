import { request } from './api'
import type {
  Assignment,
  CreateEmployeeInput,
  Employee,
  UpdateEmployeeInput,
} from '@/types'

export const getEmployees = async (): Promise<Employee[]> => {
  const response = await request<Employee[]>('/employees')
  return response
}

export const getEmployeeById = async (id: string): Promise<Employee> => {
  const response = await request<Employee>(`/employees/${id}`)
  return response
}

export const createEmployee = async (
  data: CreateEmployeeInput,
): Promise<Employee> => {
  const response = await request<Employee>('/employees', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response
}

export const updateEmployee = async (
  id: string,
  data: UpdateEmployeeInput,
): Promise<Employee> => {
  const response = await request<Employee>(`/employees/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response
}

export const deleteEmployee = (id: string) =>
  request<void>(`/employees/${id}`, {
    method: 'DELETE',
  })

export const getEmployeeProjects = async (
  id: string,
): Promise<Assignment[]> => {
  const response = await request<Assignment[]>(`/employees/${id}/projects`)
  return response
}
