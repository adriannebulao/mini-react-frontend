export type Employee = {
  PK: string
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
  'PK' | 'created_at' | 'updated_at'
>
export type UpdateEmployeeInput = Partial<CreateEmployeeInput>

export type Project = {
  PK: string
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
  'PK' | 'created_at' | 'updated_at'
>
export type UpdateProjectInput = Partial<CreateProjectInput>

export type Assignment = {
  GSI1PK: string
  PK: string
  role: string
  assignedAt: string
  SK: string
  GSI1SK: string
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
