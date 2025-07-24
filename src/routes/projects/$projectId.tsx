import { getProjectById, getProjectEmployees } from '@/lib/api/projects'
import type { Assignment, Project } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useModalStore } from '@/stores/useModalStore'

export const Route = createFileRoute('/projects/$projectId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { projectId } = Route.useParams()

  const {
    data: project,
    isLoading: projectLoading,
    error: projectError,
  } = useQuery<Project>({
    queryKey: ['projects', projectId],
    queryFn: () => getProjectById(projectId),
  })

  const {
    data: employees,
    isLoading: employeesLoading,
    error: employeesError,
  } = useQuery<Assignment[]>({
    queryKey: ['projects', projectId, 'employees'],
    queryFn: () => getProjectEmployees(projectId),
  })

  const { openModal } = useModalStore()

  if (projectLoading || employeesLoading) {
    return <p className="p-4">Loading project details...</p>
  }

  if (projectError || employeesError) {
    return <p className="p-4 text-red-500">Error loading project details.</p>
  }

  if (!project) return <p className="p-4">Project not found.</p>

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Link
          to="/projects"
          className="text-blue-500 hover:text-blue-600 mb-4 inline-block"
        >
          Back to Projects
        </Link>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <button
            onClick={() =>
              openModal({ type: 'assignProjectToEmployee', data: { project } })
            }
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-1"
          >
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2">Project Details</h2>
            {project.description && (
              <p className="text-gray-600 mb-2">{project.description}</p>
            )}
            <div className="space-y-2">
              <p className="text-gray-600">
                Started:{' '}
                {new Date(project.start_date).toLocaleDateString('en-PH', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              {project.end_date && (
                <p className="text-gray-600">
                  Ended:{' '}
                  {new Date(project.end_date).toLocaleDateString('en-PH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              )}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2">Tech Stack</h2>
            <div className="flex flex-wrap gap-2 mt-1">
              {project.tech_stack.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 bg-gray-100 rounded text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2">Assigned Employees</h2>
            {employees && employees.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {employees.map((assignment) => (
                  <li key={assignment.PK} className="py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link
                          to="/employees/$employeeId"
                          params={{
                            employeeId: assignment.PK.replace('EMP#', ''),
                          }}
                          className="text-blue-500 hover:text-blue-600 flex items-center justify-between"
                        >
                          <span className="flex flex-col">
                            <span>
                              Employee: {assignment.PK.replace('EMP#', '')}
                            </span>
                            <span className="text-sm text-gray-600">
                              Role: {assignment.role}
                            </span>
                          </span>
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">
                          Since{' '}
                          {new Date(assignment.assignedAt).toLocaleDateString(
                            'en-PH',
                            {
                              year: 'numeric',
                              month: 'long',
                            },
                          )}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          openModal({
                            type: 'unassignProject',
                            data: { project, assignment },
                          })
                        }
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">
                No employees assigned to this project.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
