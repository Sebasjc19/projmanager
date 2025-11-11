"use client"

import { Badge } from "@/components/ui/badge"
import type { TaskDto } from "@/types/task.types"
import TaskCard from "./task-card"

interface KanbanBoardProps {
  searchQuery: string
  userTasks?: TaskDto[]
  onTaskClick?: (task: TaskDto) => void
}

const columns = [
  { id: "TODO", title: "To Do", color: "bg-blue-500" },
  { id: "INPROGRESS", title: "In Progress", color: "bg-yellow-500" },
  { id: "DONE", title: "Done", color: "bg-green-500" },
]

export function KanbanBoard({ searchQuery, userTasks = [], onTaskClick }: KanbanBoardProps) {
  const filteredTasks = userTasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {columns.map((column) => {
        const columnTasks = filteredTasks.filter((task) => task.state === column.id)
        return (
          <div key={column.id} className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${column.color}`} />
                <h3 className="font-semibold">{column.title}</h3>
                <Badge variant="secondary" className="rounded-full">
                  {columnTasks.length}
                </Badge>
              </div>
            </div>
            <div className="space-y-3">
              {columnTasks.map((task) => {
                return(
                  <TaskCard
                  key={task.id}
                  task={task}
                  assignedUsers={task.assignedUsers}
                  />
                )
                
              }
                )}
              {columnTasks.length === 0 && (
                <div className="rounded-lg border-2 border-dashed p-8 text-center">
                  <p className="text-sm text-muted-foreground">No tasks</p>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
