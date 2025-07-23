import { request } from './api'
import type {
  CreateEmployeeInput,
  Employee,
  UpdateEmployeeInput,
} from '@/types'

export const getEmployees = () => request<Employee[]>('/employees')

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
