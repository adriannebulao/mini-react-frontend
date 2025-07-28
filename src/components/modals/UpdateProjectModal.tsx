import { useModalStore } from '@/stores/useModalStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProject } from '@/lib/api/projects'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import type { Project, UpdateProjectInput } from '@/types'

type UpdateProjectModalData = Project

export function UpdateProjectModal() {
  const { isOpen, modal, closeModal } = useModalStore()
  const queryClient = useQueryClient()
  const [form, setForm] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    tech_stack: '',
  })

  useEffect(() => {
    if (isOpen && modal?.type === 'updateProject' && modal.data) {
      const project = modal.data as UpdateProjectModalData
      setForm({
        name: project.name,
        description: project.description || '',
        start_date: project.start_date,
        end_date: project.end_date || '',
        tech_stack: project.tech_stack.join(', '),
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
    Project,
    Error,
    { id: string; data: UpdateProjectInput }
  >({
    mutationFn: ({ id, data }) => updateProject(id, data),
    onSuccess: (_updatedProject) => {
      toast.success('Project updated successfully')
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({
        queryKey: ['projects', projectId.replace('PROJ#', '')],
      })
      queryClient.invalidateQueries({
        queryKey: ['projects', projectId.replace('PROJ#', ''), 'employees'],
      })
      closeModal()
    },
    onError: () => toast.error('Failed to update project'),
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  if (!isOpen || modal?.type !== 'updateProject' || !modal.data) return null

  const projectId = modal.data.id

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Update Project</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault()

            const tech_stack = form.tech_stack
              ? form.tech_stack
                  .split(',')
                  .map((tech) => tech.trim())
                  .filter(Boolean)
              : []

            const payload: UpdateProjectInput = {
              name: form.name,
              start_date: form.start_date,
              tech_stack,
            }

            if (form.description && form.description.trim() !== '') {
              payload.description = form.description
            }

            if (form.end_date && form.end_date.trim() !== '') {
              payload.end_date = form.end_date
            }

            updateMutation.mutate({
              id: projectId.replace('PROJ#', ''),
              data: payload,
            })
          }}
          className="space-y-4"
        >
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Project Name"
            className="w-full px-3 py-2 border rounded"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Project Description (optional)"
            className="w-full px-3 py-2 border rounded h-24"
          ></textarea>

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
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
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
