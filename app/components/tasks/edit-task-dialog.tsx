import { useState } from 'react'
import { Button } from '../ui/button'
import { Task, ScheduleType } from '@prisma/client'
import { TaskFormData, updateTask } from '../../lib/actions'

interface EditTaskDialogProps {
    task: Task
    onClose: () => void
    onSuccess: () => void
}

function EditTaskDialog({ task, onClose, onSuccess }: EditTaskDialogProps) {
    const [name, setName] = useState(task.name)
    const [scheduleType, setScheduleType] = useState<ScheduleType>(task.scheduleType)
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // ... existing code ...
    const getDefaultCronAndScheduleData = (type: ScheduleType) => {
        switch (type) {
            case 'DAILY':
                return {
                    cron: '0 0 * * *',
                    data: { hour: 0, minute: 0 } as const
                }
            case 'HOURLY':
                return {
                    cron: '0 * * * *',
                    data: { minute: 0 } as const
                }
            case 'WEEKLY':
                return {
                    cron: '0 0 * * 1',
                    data: { dayOfWeek: 1, hour: 0, minute: 0 } as const
                }
            case 'MONTHLY':
                return {
                    cron: '0 0 1 * *',
                    data: { dayOfMonth: 1, hour: 0, minute: 0 } as const
                }
            default:
                return {
                    cron: task.cronExpression,
                    data: task.scheduleData || {}
                }
        }
    }
    // ... existing code ...
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsSubmitting(true)

        const { cron, data } = getDefaultCronAndScheduleData(scheduleType)

        const formData: TaskFormData = {
            name,
            scheduleType,
            cronExpression: cron,
            scheduleData: data as Record<string, unknown>,
        }

        try {
            const result = await updateTask(task.id, formData)
            if (result.success) {
                onSuccess()
                onClose()
            } else {
                setError(result.error || 'Failed to update task')
            }
        } catch (error) {
            console.error(error)
            setError('Failed to update task')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Edit Task</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Task Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            maxLength={250}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Schedule Type
                        </label>
                        <select
                            value={scheduleType}
                            onChange={(e) => setScheduleType(e.target.value as ScheduleType)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            {Object.values(ScheduleType).map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Updating...' : 'Update Task'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditTaskDialog 