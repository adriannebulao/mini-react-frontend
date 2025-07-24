import { useModalStore } from '@/stores/useModalStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { unassignEmployeeFromProject } from '@/lib/api/assignments'
import { toast } from 'sonner'
import { useEffect } from 'react'
import type { Assignment, Employee, Project, UnassignInput } from '@/types'

type UnassignEmployeeData = {
  employee: Employee
  assignment: Assignment
}

type UnassignProjectData = {
  project: Project
  assignment: Assignment
}

export function UnassignModal() {
  const { isOpen, modal, closeModal } = useModalStore()
  const queryClient = useQueryClient()

  const isUnassignEmployee = modal?.type === 'unassignEmployee'
  const isUnassignProject = modal?.type === 'unassignProject'

  const employeeData = isUnassignEmployee
    ? (modal?.data as UnassignEmployeeData)
    : null
  const projectData = isUnassignProject
    ? (modal?.data as UnassignProjectData)
    : null

  const assignment = employeeData?.assignment || projectData?.assignment

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [closeModal])

  const unassignMutation = useMutation<void, Error, UnassignInput>({
    mutationFn: (data) => unassignEmployeeFromProject(data),
    onSuccess: () => {
      toast.success('Assignment removed successfully')

      if (isUnassignEmployee) {
        const employeeId = employeeData?.employee.PK.replace('EMP#', '')
        queryClient.invalidateQueries({
          queryKey: ['employees', employeeId, 'projects'],
        })
        queryClient.invalidateQueries({ queryKey: ['employees', employeeId] })
      }

      if (isUnassignProject) {
        const projectId = projectData?.project.PK.replace('PROJ#', '')
        queryClient.invalidateQueries({
          queryKey: ['projects', projectId, 'employees'],
        })
        queryClient.invalidateQueries({ queryKey: ['projects', projectId] })
      }

      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['employees'] })

      closeModal()
    },
    onError: () => toast.error('Failed to remove assignment'),
  })

  if (!isOpen || !(isUnassignEmployee || isUnassignProject) || !assignment) {
    return null
  }

  const employeeId = isUnassignEmployee
    ? employeeData!.employee.PK.replace('EMP#', '')
    : assignment.PK.replace('EMP#', '')

  const projectId = isUnassignEmployee
    ? assignment.GSI1PK.replace('PROJ#', '')
    : projectData!.project.PK.replace('PROJ#', '')

  const employeeName = isUnassignEmployee
    ? employeeData!.employee.name
    : `Employee ${assignment.PK.replace('EMP#', '')}`

  const projectName = isUnassignEmployee
    ? `Project ${assignment.GSI1PK.replace('PROJ#', '')}`
    : projectData!.project.name

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4 text-red-600">
          Remove Assignment
        </h2>
        <p className="mb-6 text-gray-700">
          Are you sure you want to remove{' '}
          <span className="font-semibold">{employeeName}</span> from{' '}
          <span className="font-semibold">{projectName}</span>?
        </p>

        <div className="flex gap-2 justify-end">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              const payload: UnassignInput = {
                employeeId,
                projectId,
              }
              unassignMutation.mutate(payload)
            }}
            disabled={unassignMutation.isPending}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-75"
          >
            {unassignMutation.isPending ? 'Removing...' : 'Remove'}
          </button>
        </div>
      </div>
    </div>
  )
}
