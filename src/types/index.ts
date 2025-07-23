export type Employee = {
  id: string
  name: string
  email: string
  start_date: string
  end_date?: string
  positions: string[]
  tech_stack: string[]
}

export type CreateEmployeeInput = Omit<Employee, 'id'>
export type UpdateEmployeeInput = Partial<CreateEmployeeInput>

export type Project = {
  id: string
  name: string
  description?: string
  start_date: string
  end_date?: string
  tech_stack: string[]
}

export type CreateProjectInput = Omit<Project, 'id'>
export type UpdateProjectInput = Partial<CreateProjectInput>

export type Assignment = {
  employeeId: string
  projectId: string
  role: string
  assigned_date: string
}

export type AssignmentInput = {
  employeeId: string
  projectId: string
  role: string
  assigned_date: string
}

export type UnassignInput = {
  employeeId: string
  projectId: string
}
