export type Employee = {
  id: string
  name: string
  email: string
  start_date: string
  end_date?: string
  positions: string[]
  tech_stack: string[]
  created_at: string
  updated_at: string
}

export type CreateEmployeeInput = Omit<
  Employee,
  'id' | 'created_at' | 'updated_at'
>
export type UpdateEmployeeInput = Partial<CreateEmployeeInput>

export type Project = {
  id: string
  name: string
  description?: string
  start_date: string
  end_date?: string
  tech_stack: string[]
  created_at: string
  updated_at: string
}

export type CreateProjectInput = Omit<
  Project,
  'id' | 'created_at' | 'updated_at'
>
export type UpdateProjectInput = Partial<CreateProjectInput>

export type Assignment = {
  employeeId: string
  projectId: string
  GSI1PK: string
  GSI1SK: string
  role: string
  assigned_at: string
  employeeName?: string | null
  projectName?: string | null
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
