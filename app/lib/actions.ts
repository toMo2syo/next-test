"use server"
import { Task, ScheduleType } from "@prisma/client"
import { db } from "./db"
import { z } from "zod"
import parser from "cron-parser"

const TaskSchema = z.object({
    name: z.string().min(1).max(250),
    scheduleType: z.enum(['DAILY', 'HOURLY', 'WEEKLY', 'MONTHLY', 'CUSTOM']),
    cronExpression: z.string(),
    scheduleData: z.object({}).passthrough(),
})

export type TaskFormData = z.infer<typeof TaskSchema>

export async function addTask(data: TaskFormData) {
    try {
        // Validate input data
        const validatedData = TaskSchema.parse(data)

        // Parse cron expression to get next run time
        const interval = parser.parseExpression(validatedData.cronExpression)
        const nextRunTime = interval.next().toDate()

        // Create task in database
        const task = await db.task.create({
            data: {
                name: validatedData.name,
                scheduleType: validatedData.scheduleType as ScheduleType,
                cronExpression: validatedData.cronExpression,
                scheduleData: validatedData.scheduleData,
                nextRunTime,
            },
        })
        return { success: true, task }
    } catch (error) {
        console.error('Failed to add task:', error)
        return { success: false, error: 'Failed to add task' }
    }

    // revalidatePath('/)
}

export type TasksResponse = {
    tasks: Task[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

export async function fetchTasks(
    page: number = 1,
    pageSize: number = 10,
    userId = 1
) {
    if (!userId) return null
    const skip = (page - 1) * pageSize
    try {
        const [tasks, total] = await Promise.all([
            db.task.findMany({
                where: {
                    isDeleted: false,
                },
                skip,
                take: pageSize,
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            db.task.count({
                where: {
                    isDeleted: false,
                },
            }),
        ])

        return {
            tasks,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        }
    } catch (error) {
        console.error(error)
    }
}

export async function deleteTask(taskId: string) {
    try {
        // Perform logical deletion
        const task = await db.task.update({
            where: { id: taskId },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
            },
        })
        return { success: true, task }
    } catch (error) {
        console.error('Failed to delete task:', error)
        return { success: false, error: 'Failed to delete task' }
    }
}

export async function updateTask(taskId: string, data: TaskFormData) {
    try {
        // Validate input data
        const validatedData = TaskSchema.parse(data)

        // Parse cron expression to get next run time
        const interval = parser.parseExpression(validatedData.cronExpression)
        const nextRunTime = interval.next().toDate()

        // Update task in database
        const task = await db.task.update({
            where: { id: taskId },
            data: {
                name: validatedData.name,
                scheduleType: validatedData.scheduleType as ScheduleType,
                cronExpression: validatedData.cronExpression,
                scheduleData: validatedData.scheduleData,
                nextRunTime,
                updatedAt: new Date(),
            },
        })

        return { success: true, task }
    } catch (error) {
        console.error('Failed to update task:', error)
        return { success: false, error: 'Failed to update task' }
    }
}