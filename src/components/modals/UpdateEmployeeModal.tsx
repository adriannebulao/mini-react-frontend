import { useModalStore } from '@/stores/useModalStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateEmployee } from '@/lib/api/employees'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import type { Employee, UpdateEmployeeInput } from '@/types'

type UpdateEmployeeModalData = Employee

export function UpdateEmployeeModal() {
  const { isOpen, modal, closeModal } = useModalStore()
  const queryClient = useQueryClient()
  const [form, setForm] = useState({
    name: '',
    email: '',
    start_date: '',
    end_date: '',
    positions: '',
    tech_stack: '',
  })

  useEffect(() => {
    if (isOpen && modal?.type === 'updateEmployee' && modal.data) {
      const employee = modal.data as UpdateEmployeeModalData
      setForm({
        name: employee.name,
        email: employee.email,
        start_date: employee.start_date,
        end_date: employee.end_date || '',
        positions: employee.positions.join(', '),
        tech_stack: employee.tech_stack.join(', '),
      })
    }
  }, [isOpen, modal])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [closeModal])

  const updateMutation = useMutation<
    Employee,
    Error,
    { id: string; data: UpdateEmployeeInput }
  >({
    mutationFn: ({ id, data }) => updateEmployee(id, data),
    onSuccess: (_updatedEmployee) => {
      toast.success('Employee updated successfully')
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      queryClient.invalidateQueries({
        queryKey: ['employees', employeeId.replace('EMP#', '')],
      })
      queryClient.invalidateQueries({
        queryKey: ['employees', employeeId.replace('EMP#', ''), 'projects'],
      })
      closeModal()
    },
    onError: () => toast.error('Failed to update employee'),
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  if (!isOpen || modal?.type !== 'updateEmployee' || !modal.data) return null

  const employeeId = modal.data.id

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Update Employee</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault()

            const positions = form.positions
              ? form.positions
                  .split(',')
                  .map((pos) => pos.trim())
                  .filter(Boolean)
              : []

            const tech_stack = form.tech_stack
              ? form.tech_stack
                  .split(',')
                  .map((tech) => tech.trim())
                  .filter(Boolean)
              : []

            const payload: UpdateEmployeeInput = {
              name: form.name,
              email: form.email,
              start_date: form.start_date,
              positions,
              tech_stack,
            }

            if (form.end_date && form.end_date.trim() !== '') {
              payload.end_date = form.end_date
            }

            updateMutation.mutate({
              id: employeeId.replace('EMP#', ''),
              data: payload,
            })
          }}
          className="space-y-4"
        >
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full px-3 py-2 border rounded"
          />

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full px-3 py-2 border rounded"
          />

          <input
            name="start_date"
            type="date"
            value={form.start_date}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />

          <input
            name="end_date"
            type="date"
            value={form.end_date}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />

          <input
            name="positions"
            value={form.positions}
            onChange={handleChange}
            placeholder="Positions (e.g. Developer, Manager)"
            className="w-full px-3 py-2 border rounded"
          />

          <input
            name="tech_stack"
            value={form.tech_stack}
            onChange={handleChange}
            placeholder="Tech Stack (e.g. React, Node.js)"
            className="w-full px-3 py-2 border rounded"
          />

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="submit"
              disabled={updateMutation.status === 'pending'}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {updateMutation.status === 'pending' ? 'Updating...' : 'Update'}
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
