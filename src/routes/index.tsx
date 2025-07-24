import { createFileRoute, Link } from '@tanstack/react-router'
import logo from '../logo.svg'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="text-center">
      <header className="min-h-screen flex flex-col items-center justify-center bg-[#282c34] text-white text-[calc(10px+2vmin)]">
        <img
          src={logo}
          className="h-[40vmin] pointer-events-none animate-[spin_20s_linear_infinite]"
          alt="logo"
        />
        <h1 className="text-3xl font-bold mb-8">Mini React Frontend</h1>
        <div className="flex gap-6 mb-8">
          <Link
            to="/employees"
            className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Employees
          </Link>
          <Link
            to="/projects"
            className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Projects
          </Link>
        </div>
      </header>
    </div>
  )
}
