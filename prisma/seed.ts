import { PrismaClient, ScheduleType } from '@prisma/client'
import { addDays } from 'date-fns'

const prisma = new PrismaClient()

async function main() {
    // Clean up existing records
    await prisma.task.deleteMany({})

    // Create sample tasks
    const tasks = [
        {
            name: "Daily Backup",
            scheduleType: ScheduleType.DAILY,
            cronExpression: "0 0 * * *", // Every day at midnight
            scheduleData: { hour: 0, minute: 0 },
            nextRunTime: addDays(new Date(), 1),
        },
        {
            name: "Hourly Health Check",
            scheduleType: ScheduleType.HOURLY,
            cronExpression: "0 * * * *", // Every hour
            scheduleData: { minute: 0 },
            nextRunTime: new Date(new Date().setHours(new Date().getHours() + 1, 0, 0, 0)),
        },
        {
            name: "Weekly Report",
            scheduleType: ScheduleType.WEEKLY,
            cronExpression: "0 9 * * 1", // Every Monday at 9 AM
            scheduleData: { dayOfWeek: 1, hour: 9, minute: 0 },
            nextRunTime: addDays(new Date(), 7),
        }
    ]

    for (const task of tasks) {
        await prisma.task.create({
            data: task
        })
    }

    // Log the created tasks
    const allTasks = await prisma.task.findMany()
    console.log('Created tasks:', allTasks)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    }) 