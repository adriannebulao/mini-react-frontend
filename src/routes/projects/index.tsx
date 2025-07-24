import { getProjects } from '@/lib/api/projects'
import type { Project } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useModalStore } from '@/stores/useModalStore' // Add this import

export const Route = createFileRoute('/projects/')({
  component: RouteComponent,
})

function RouteComponent() {
  const {
    data: projects,
    isLoading,
    error,
  } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: getProjects,
    staleTime: Infinity,
  })

  const { openModal } = useModalStore()

  if (isLoading) return <p className="p-4">Loading projects...</p>
  if (error) return <p className="p-4 text-red-500">Error loading projects.</p>

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button
          onClick={() => openModal({ type: 'createProject' })}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Project
        </button>
      </div>

      {(projects?.length ?? 0) === 0 ? (
        <p className="text-gray-500">No projects found.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {projects?.map((project) => (
            <li key={project.PK} className="py-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h2 className="font-semibold text-lg">{project.name}</h2>
                  {project.description && (
                    <p className="text-gray-600">{project.description}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    Started{' '}
                    {new Date(project.start_date).toLocaleDateString('en-PH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      openModal({ type: 'updateProject', data: project })
                    }
                    className="px-3 py-1 text-green-600 hover:text-green-700"
                  >
                    Edit
                  </button>
                  <Link
                    to="/projects/$projectId"
                    params={{ projectId: project.PK.replace('PROJ#', '') }}
                    className="px-3 py-1 text-green-600 hover:text-green-700"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
