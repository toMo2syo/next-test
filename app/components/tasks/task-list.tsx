'use client'
import { Task } from "@prisma/client"
import { Button } from "../ui/button"
import { useEffect, useState } from "react"
import { fetchTasks } from "../../lib/actions"
import type { TasksResponse } from "../../lib/actions"
import DeleteTaskButton from './delete-task-button'
import EditTaskDialog from './edit-task-dialog'

function TaskList() {
    const [taskData, setTaskData] = useState<TasksResponse>({
        tasks: [],
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0
    })
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [editingTask, setEditingTask] = useState<Task | null>(null)

    useEffect(() => {
        const loadTasks = async () => {
            try {
                const result = await fetchTasks(currentPage, pageSize)
                if (result) {
                    setTaskData(result)
                }
            } catch (error) {
                console.error('Failed to fetch tasks:', error)
            }
        }

        loadTasks()
    }, [currentPage, pageSize])

    const handlePageChange = async (newPage: number) => {
        setCurrentPage(newPage)
    }

    const handlePageSizeChange = async (newSize: number) => {
        setPageSize(newSize)
        setCurrentPage(1) // Reset to first page when changing page size
    }

    const refreshTasks = async () => {
        try {
            const result = await fetchTasks(currentPage, pageSize)
            if (result) {
                setTaskData(result)
            }
        } catch (error) {
            console.error('Failed to refresh tasks:', error)
        }
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Task Management</h1>
                <Button>Create New Task</Button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Task Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Schedule
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Next Run (Local)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Next Run (UTC)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {taskData.tasks.map((task: Task) => (
                            <tr key={task.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {task.name}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">
                                        {task.scheduleType}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">
                                        {new Date(task.nextRunTime).toLocaleString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">
                                        {new Date(task.nextRunTime).toUTCString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <Button
                                        variant="ghost"
                                        className="mr-2"
                                        onClick={() => setEditingTask(task)}
                                    >
                                        Edit
                                    </Button>
                                    <DeleteTaskButton
                                        taskId={task.id}
                                        onDelete={refreshTasks}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex justify-between items-center">
                <select
                    className="border rounded p-2"
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                </select>

                <div className="flex gap-2">
                    <Button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <span className="mx-4 flex items-center">
                        Page {currentPage} of {taskData.totalPages}
                    </span>
                    <Button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= taskData.totalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>

            {editingTask && (
                <EditTaskDialog
                    task={editingTask}
                    onClose={() => setEditingTask(null)}
                    onSuccess={refreshTasks}
                />
            )}
        </div>
    )
}

export default TaskList 