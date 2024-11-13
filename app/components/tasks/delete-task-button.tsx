import { useState } from 'react'
import { Button } from '../ui/button'
import { deleteTask } from '../../lib/actions'

interface DeleteTaskButtonProps {
    taskId: string
    onDelete: () => void
}

function DeleteTaskButton({ taskId, onDelete }: DeleteTaskButtonProps) {
    const [isConfirming, setIsConfirming] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (!isConfirming) {
            setIsConfirming(true)
            return
        }

        setIsDeleting(true)
        try {
            const result = await deleteTask(taskId)
            if (result.success) {
                onDelete()
            }
        } catch (error) {
            console.error('Failed to delete task:', error)
        } finally {
            setIsDeleting(false)
            setIsConfirming(false)
        }
    }

    const handleCancel = () => {
        setIsConfirming(false)
    }

    if (isConfirming) {
        return (
            <div className="flex gap-2">
                <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                >
                    {isDeleting ? 'Deleting...' : 'Confirm'}
                </Button>
                <Button
                    variant="ghost"
                    onClick={handleCancel}
                    disabled={isDeleting}
                >
                    Cancel
                </Button>
            </div>
        )
    }

    return (
        <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
        >
            Delete
        </Button>
    )
}

export default DeleteTaskButton 