"use client";

import { CalendarDays, Check, Circle } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge, Card } from "@/components/ui";

type ApiTask = {
  _id: string;
  title: string;
  subjectId: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "completed";
};

export default function TaskList({ limit }: { limit?: number }) {
  const [tasks, setTasks] = useState<ApiTask[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTasks() {
      try {
        const response = await fetch("/api/tasks");
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Unable to load tasks.");
        }
        setTasks(data.tasks);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load tasks.",
        );
      }
    }

    void loadTasks();
  }, []);

  const visibleTasks = limit ? tasks.slice(0, limit) : tasks;
  if (error) {
    return (
      <p
        role="alert"
        className="rounded-xl bg-(--danger-soft) p-4 text-sm text-(--danger)"
      >
        {error}
      </p>
    );
  }

  if (visibleTasks.length === 0) {
    return <p className="text-sm text-(--muted)">No tasks yet.</p>;
  }

  return (
    <div className="space-y-2">
      {visibleTasks.map((task) => {
        const completed = task.status === "completed";
        return (
          <Card
            key={task._id}
            className={`flex items-center gap-3 p-4 ${completed ? "opacity-65" : ""}`}
          >
            <button
              aria-label={
                completed ? `Reopen ${task.title}` : `Complete ${task.title}`
              }
              onClick={() =>
                setTasks((items) =>
                  items.map((item) =>
                    item._id === task._id
                      ? { ...item, status: completed ? "pending" : "completed" }
                      : item,
                  ),
                )
              }
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${completed ? "border-(--accent) bg-(--accent) text-white" : "border-[#b7c1bb] text-transparent hover:border-(--accent)"}`}
            >
              <Check size={13} strokeWidth={3} />
            </button>
            <div className="min-w-0 flex-1">
              <p
                className={`truncate text-sm font-semibold ${completed ? "line-through" : ""}`}
              >
                {task.title}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-(--muted)">
                <span className="flex items-center gap-1">
                  <Circle
                    size={7}
                    fill="var(--primary)"
                    color="var(--primary)"
                  />
                  {task.subjectId}
                </span>
                <span className="flex items-center gap-1">
                  <CalendarDays size={13} />
                  {new Date(task.dueDate).toLocaleDateString()}
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
    </div>
  );
}
