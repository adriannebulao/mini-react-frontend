import { useModalStore } from '@/stores/useModalStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteEmployee } from '@/lib/api/employees'
import { toast } from 'sonner'
import { useEffect } from 'react'

export function DeleteEmployeeModal() {
  const { isOpen, modal, closeModal } = useModalStore()
  const queryClient = useQueryClient()

  const employee = modal?.type === 'deleteEmployee' ? modal.data : null
  const employeeId = employee?.PK?.replace('EMP#', '')

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: (id) => deleteEmployee(id),
    onSuccess: () => {
      toast.success('Employee deleted')
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      if (employeeId) {
        queryClient.invalidateQueries({
          queryKey: ['projects', 'employees'],
        })
      }
      closeModal()
    },
    onError: () => toast.error('Failed to delete employee'),
  })

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [closeModal])

  if (!isOpen || modal?.type !== 'deleteEmployee' || !employee) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4 text-red-600">Delete Employee</h2>
        <p className="mb-6 text-gray-700">
          Are you sure you want to delete{' '}
          <span className="font-semibold">{employee.name}</span>?
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => employeeId && deleteMutation.mutate(employeeId)}
            disabled={deleteMutation.isPending}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
