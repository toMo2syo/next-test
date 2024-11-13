# Task Management System

A modern task scheduling system built with Next.js 14, Server Actions, and PostgreSQL. The system provides a robust interface for managing scheduled tasks with various recurrence patterns.

> **Note:** This implementation uses a traditional approach to form handling and data synchronization. While React 19 introduces powerful features like `useFormState` for form submissions to work with `revalidatePath`in Next.js for data synchronization, these features are not utilized in this version. Manual page refresh may be required to see the most recent data updates. Future iterations will incorporate these modern React features for enhanced user experience.

## Installaction
Install packages
```bash
pnpm i
```
Run a dev server
```bash
npm run dev
```

## 🚀 Features

### Task Management
- ✨ Create, read, update, and delete tasks (CRUD operations)
- 🗑️ Soft deletion for data preservation
- ✅ Input validation with Zod
- 📝 Task names up to 250 characters

### Scheduling Options
- 📅 Multiple schedule types:
  - Daily (fixed time)
  - Hourly (every N hours at X minutes)
  - Weekly (specific day and time)
  - Monthly (specific date and time)
  - Custom (using Cron expressions)
- ⏰ Automatic next run time calculation
- 🌍 Both UTC and local time display

### User Interface
- 📱 Responsive design with Tailwind CSS
- 📊 Server-side pagination
- 🔄 Dynamic page size adjustment (5/10/20 items)
- ✔️ Confirmation dialogs for destructive actions
- ⚡ Optimistic updates for better UX

## 🛠️ Tech Stack

### Frontend
- Next.js 14
- React with TypeScript
- Tailwind CSS
- shadcn/ui components

### Backend
- React Server Actions
- Prisma ORM
- PostgreSQL
- Zod validation
