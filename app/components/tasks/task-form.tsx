'use client'
import { useState } from 'react'
import { Button } from '../ui/button'
import { TaskFormData, addTask } from '../../lib/actions'
import { ScheduleType } from '@prisma/client'

function TaskForm({ onSuccess }: { onSuccess?: () => void }) {
    const [name, setName] = useState('')
    const [scheduleType, setScheduleType] = useState<ScheduleType>(ScheduleType.DAILY)
    const [error, setError] = useState('')

    const getDefaultCronAndScheduleData = (type: ScheduleType) => {
        switch (type) {
            case 'DAILY':
                return {
                    cron: '0 0 * * *',
                    data: { hour: 0, minute: 0 }
                }
            case 'HOURLY':
                return {
                    cron: '0 * * * *',
                    data: { minute: 0 }
                }
            case 'WEEKLY':
                return {
                    cron: '0 0 * * 1',
                    data: { dayOfWeek: 1, hour: 0, minute: 0 }
                }
            case 'MONTHLY':
                return {
                    cron: '0 0 1 * *',
                    data: { dayOfMonth: 1, hour: 0, minute: 0 }
                }
            default:
                return {
                    cron: '0 0 * * *',
                    data: {}
                }
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        const { cron, data } = getDefaultCronAndScheduleData(scheduleType)

        const formData: TaskFormData = {
            name,
            scheduleType,
            cronExpression: cron,
            scheduleData: data,
        }

        const result = await addTask(formData)

        if (result.success) {
            setName('')
            setScheduleType(ScheduleType.DAILY)
            onSuccess?.()
        } else {
            setError(result.error || 'Failed to add task')
        }
    }

    return (
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

            <Button type="submit">
                Add Task
            </Button>
        </form>
    )
}

export default TaskForm 