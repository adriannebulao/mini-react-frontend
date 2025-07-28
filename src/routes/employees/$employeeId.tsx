import { getEmployeeById, getEmployeeProjects } from '@/lib/api/employees'
import type { Assignment, Employee } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useModalStore } from '@/stores/useModalStore'

export const Route = createFileRoute('/employees/$employeeId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { employeeId } = Route.useParams()

  const {
    data: employee,
    isLoading: employeeLoading,
    error: employeeError,
  } = useQuery<Employee>({
    queryKey: ['employees', employeeId],
    queryFn: () => getEmployeeById(employeeId),
  })

  const {
    data: projects,
    isLoading: projectsLoading,
    error: projectsError,
  } = useQuery<Assignment[]>({
    queryKey: ['employees', employeeId, 'projects'],
    queryFn: () => getEmployeeProjects(employeeId),
  })

  const { openModal } = useModalStore()

  if (employeeLoading || projectsLoading) {
    return <p className="p-4">Loading employee details...</p>
  }

  if (employeeError || projectsError) {
    return <p className="p-4 text-red-500">Error loading employee details.</p>
  }

  if (!employee) return <p className="p-4">Employee not found.</p>

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Link
          to="/employees"
          className="text-blue-500 hover:text-blue-600 mb-4 inline-block"
        >
          Back to Employees
        </Link>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{employee.name}</h1>
          <button
            onClick={() =>
              openModal({ type: 'assignEmployeeToProject', data: { employee } })
            }
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
          >
            <span>Assign to Project</span>
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2">Contact Information</h2>
            <p className="text-gray-600">{employee.email}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2">Employment Details</h2>
            <div className="space-y-2">
              <p className="text-gray-600">
                Started:{' '}
                {new Date(employee.start_date).toLocaleDateString('en-PH', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              {employee.end_date && (
                <p className="text-gray-600">
                  Ended:{' '}
                  {new Date(employee.end_date).toLocaleDateString('en-PH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              )}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2">Skills & Positions</h2>
            <div className="space-y-2">
              <div>
                <h3 className="text-sm text-gray-500">Positions</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {employee.positions.map((position) => (
                    <span
                      key={position}
                      className="px-2 py-1 bg-gray-100 rounded text-sm"
                    >
                      {position}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Tech Stack</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {employee.tech_stack.map((tech) => (
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
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2">Project Assignments</h2>
            {projects && projects.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {projects.map((assignment) => (
                  <li key={assignment.projectId} className="py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link
                          to="/projects/$projectId"
                          params={{
                            projectId: assignment.projectId,
                          }}
                          className="text-blue-500 hover:text-blue-600 flex items-center justify-between"
                        >
                          <span className="flex flex-col">
                            <span>{assignment.projectName}</span>
                            <span className="text-sm text-gray-600">
                              Role: {assignment.role}
                            </span>
                          </span>
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">
                          Since{' '}
                          {new Date(assignment.assigned_at).toLocaleDateString(
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
                            type: 'unassignEmployee',
                            data: { employee, assignment },
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
              <p className="text-gray-500">No project assignments found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
