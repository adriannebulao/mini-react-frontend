import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects/$projectId/employees')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/projects/$projectId/employees"!</div>
}
