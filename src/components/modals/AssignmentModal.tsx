import { useModalStore } from '@/stores/useModalStore'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getProjects } from '@/lib/api/projects'
import { getEmployees } from '@/lib/api/employees'
import { assignEmployeeToProject } from '@/lib/api/assignments'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import type { Project, Employee, AssignmentInput } from '@/types'

type AssignEmployeeToProjectData = {
  employee: Employee
}

type AssignProjectToEmployeeData = {
  project: Project
}

export function AssignmentModal() {
  const { isOpen, modal, closeModal } = useModalStore()
  const queryClient = useQueryClient()

  const isEmployeeToProject = modal?.type === 'assignEmployeeToProject'
  const isProjectToEmployee = modal?.type === 'assignProjectToEmployee'

  const employee = isEmployeeToProject
    ? (modal?.data as AssignEmployeeToProjectData)?.employee
    : null
  const project = isProjectToEmployee
    ? (modal?.data as AssignProjectToEmployeeData)?.project
    : null

  const [selectedEntityId, setSelectedEntityId] = useState('')
  const [role, setRole] = useState('')

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: getProjects,
    enabled: isOpen && isEmployeeToProject,
  })

  const { data: employees = [] } = useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: getEmployees,
    enabled: isOpen && isProjectToEmployee,
  })

  useEffect(() => {
    if (isOpen && (isEmployeeToProject || isProjectToEmployee)) {
      setSelectedEntityId('')
      setRole('')
    }
  }, [isOpen, modal])

  const assignMutation = useMutation({
    mutationFn: (data: AssignmentInput) => assignEmployeeToProject(data),
    onSuccess: () => {
      toast.success(
        isEmployeeToProject
          ? 'Employee assigned to project'
          : 'Employee added to project',
      )

      if (isEmployeeToProject) {
        const employeeId = employee?.id
        queryClient.invalidateQueries({
          queryKey: ['employees', employeeId, 'projects'],
        })
        queryClient.invalidateQueries({ queryKey: ['employees', employeeId] })
      }

      if (isProjectToEmployee) {
        const projectId = project?.id
        queryClient.invalidateQueries({
          queryKey: ['projects', projectId, 'employees'],
        })
        queryClient.invalidateQueries({ queryKey: ['projects', projectId] })
      }

      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['employees'] })

      closeModal()
    },
    onError: () => toast.error('Failed to create assignment'),
  })

  if (
    !isOpen ||
    !(isEmployeeToProject || isProjectToEmployee) ||
    (isEmployeeToProject && !employee) ||
    (isProjectToEmployee && !project)
  ) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4">
          {isEmployeeToProject
            ? `Assign ${employee?.name} to Project`
            : `Add Employee to ${project?.name}`}
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault()

            const payload: AssignmentInput = {
              employeeId: isEmployeeToProject ? employee!.id : selectedEntityId,
              projectId: isEmployeeToProject ? selectedEntityId : project!.id,
              role,
              assigned_date: new Date().toISOString(),
            }

            assignMutation.mutate(payload)
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">
              {isEmployeeToProject ? 'Project' : 'Employee'}
            </label>
            {isEmployeeToProject ? (
              <select
                value={selectedEntityId}
                onChange={(e) => setSelectedEntityId(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            ) : (
              <select
                value={selectedEntityId}
                onChange={(e) => setSelectedEntityId(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">Select an employee</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Developer"
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              disabled={assignMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {assignMutation.isPending ? 'Assigning...' : 'Assign'}
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
