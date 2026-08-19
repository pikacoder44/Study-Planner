"use client";

import { CalendarDays, Check, Circle, Clock3 } from "lucide-react";
import { useState } from "react";
import { Badge, Card } from "@/components/ui";
import { subjects, tasks as initialTasks } from "@/lib/mock-data";

export default function TaskList({ limit }: { limit?: number }) {
  const [tasks, setTasks] = useState(initialTasks);
  const visibleTasks = limit ? tasks.slice(0, limit) : tasks;
  return (
    <div className="space-y-2">
      {visibleTasks.map((task) => {
        const subject = subjects.find((item) => item.id === task.subjectId);
        const completed = task.status === "completed";
        return (
          <Card
            key={task.id}
            className={`flex items-center gap-3 p-4 ${completed ? "opacity-65" : ""}`}
          >
            <button
              aria-label={
                completed ? `Reopen ${task.title}` : `Complete ${task.title}`
              }
              onClick={() =>
                setTasks((items) =>
                  items.map((item) =>
                    item.id === task.id
                      ? { ...item, status: completed ? "pending" : "completed" }
                      : item,
                  ),
                )
              }
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${completed ? "border-[var(--accent)] bg-[var(--accent)] text-white" : "border-[#b7c1bb] text-transparent hover:border-[var(--accent)]"}`}
            >
              <Check size={13} strokeWidth={3} />
            </button>
            <div className="min-w-0 flex-1">
              <p
                className={`truncate text-sm font-semibold ${completed ? "line-through" : ""}`}
              >
                {task.title}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[var(--muted)]">
                <span className="flex items-center gap-1">
                  <Circle
                    size={7}
                    fill={subject?.color}
                    color={subject?.color}
                  />
                  {subject?.code}
                </span>
                <span className="flex items-center gap-1">
                  <CalendarDays size={13} />
                  {task.dueDate}
                </span>
              </div>
            </div>
            <Badge
              tone={
                task.priority === "high"
                  ? "red"
                  : task.priority === "medium"
                    ? "amber"
                    : "neutral"
              }
            >
              {task.priority}
            </Badge>
          </Card>
        );
      })}
      <div className="hidden">
        <Clock3 />
      </div>
    </div>
  );
}
