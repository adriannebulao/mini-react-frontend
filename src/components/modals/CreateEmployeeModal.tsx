import { useModalStore } from '@/stores/useModalStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createEmployee } from '@/lib/api/employees'
import { toast } from 'sonner'
import { useEffect } from 'react'
import type { CreateEmployeeInput, Employee } from '@/types'

export function CreateEmployeeModal() {
  const { isOpen, modal, closeModal } = useModalStore()
  const queryClient = useQueryClient()

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [closeModal])

  const createMutation = useMutation<Employee, Error, CreateEmployeeInput>({
    mutationFn: createEmployee,
    onSuccess: () => {
      toast.success('Employee created successfully')
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      closeModal()
    },
    onError: () => toast.error('Failed to create employee'),
  })

  if (!isOpen || modal?.type !== 'createEmployee') return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Create Employee</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            const input = Object.fromEntries(formData.entries())

            const positions = input.positions
              ? (input.positions as string)
                  .split(',')
                  .map((pos) => pos.trim())
                  .filter(Boolean)
              : []

            const tech_stack = input.tech_stack
              ? (input.tech_stack as string)
                  .split(',')
                  .map((tech) => tech.trim())
                  .filter(Boolean)
              : []

            const payload: CreateEmployeeInput = {
              name: input.name as string,
              email: input.email as string,
              start_date: input.start_date as string,
              end_date: (input.end_date as string) || undefined,
              positions,
              tech_stack,
            }

            createMutation.mutate(payload)
          }}
          className="space-y-4"
        >
          <input
            name="name"
            required
            placeholder="Full Name"
            className="w-full px-3 py-2 border rounded"
          />

          <input
            name="email"
            type="email"
            required
            placeholder="Email Address"
            className="w-full px-3 py-2 border rounded"
          />

          <input
            name="start_date"
            type="date"
            defaultValue={new Date().toISOString().split('T')[0]}
            required
            className="w-full px-3 py-2 border rounded"
          />

          <input
            name="end_date"
            type="date"
            className="w-full px-3 py-2 border rounded"
          />

          <input
            name="positions"
            placeholder="Positions (e.g. Developer, Manager)"
            className="w-full px-3 py-2 border rounded"
          />

          <input
            name="tech_stack"
            placeholder="Tech Stack (e.g. React, Node.js)"
            className="w-full px-3 py-2 border rounded"
          />

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="submit"
              disabled={createMutation.status === 'pending'}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {createMutation.status === 'pending' ? 'Creating...' : 'Create'}
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
