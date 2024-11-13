import TaskList from "./components/tasks/task-list"
import TaskForm from "./components/tasks/task-form"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Add New Task</h2>
          <TaskForm />
        </div>
        <TaskList />
      </div>
    </main>
  )
}
