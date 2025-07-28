import { getEmployees } from '@/lib/api/employees'
import type { Employee } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useModalStore } from '@/stores/useModalStore'

export const Route = createFileRoute('/employees/')({
  component: RouteComponent,
})

function RouteComponent() {
  const {
    data: employees,
    isLoading,
    error,
  } = useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: getEmployees,
  })

  const { openModal } = useModalStore()

  if (isLoading) return <p className="p-4">Loading employees...</p>
  if (error) return <p className="p-4 text-red-500">Error loading employees.</p>

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employees</h1>
        <button
          onClick={() => openModal({ type: 'createEmployee' })}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Employee
        </button>
      </div>

      {(employees?.length ?? 0) === 0 ? (
        <p className="text-gray-500">No employees found.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {employees?.map((emp) => (
            <li key={emp.id} className="py-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h2 className="font-semibold text-lg">{emp.name}</h2>
                  <p className="text-gray-600">{emp.email}</p>
                  <p className="text-sm text-gray-500">
                    Started{' '}
                    {new Date(emp.start_date).toLocaleDateString('en-PH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Link
                    to="/employees/$employeeId"
                    params={{ employeeId: emp.id }}
                    className="px-3 py-1 text-blue-600 hover:text-blue-700"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() =>
                      openModal({ type: 'updateEmployee', data: emp })
                    }
                    className="px-3 py-1 text-blue-600 hover:text-blue-700"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      openModal({ type: 'deleteEmployee', data: emp })
                    }
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
