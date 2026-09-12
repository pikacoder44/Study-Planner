"use client";

import Link from "next/link";
import {
  CalendarDays,
  Check,
  ChevronDown,
  ChevronUp,
  Circle,
  Pencil,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Badge, Card } from "@/components/ui";

type ApiTask = {
  _id: string;
  title: string;
  description: string;
  subjectId: string;
  type: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "completed";
};

type ApiSubject = {
  _id: string;
  name: string;
  code: string;
};

export default function TaskList({ limit }: { limit?: number }) {
  const [tasks, setTasks] = useState<ApiTask[]>([]);
  const [subjects, setSubjects] = useState<ApiSubject[]>([]);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTasks() {
      try {
        const [tasksResponse, subjectsResponse] = await Promise.all([
          fetch("/api/tasks"),
          fetch("/api/subject"),
        ]);
        const tasksData = await tasksResponse.json();
        const subjectsData = await subjectsResponse.json();
        if (!tasksResponse.ok) {
          throw new Error(tasksData.error || "Unable to load tasks.");
        }
        if (!subjectsResponse.ok) {
          throw new Error(subjectsData.error || "Unable to load subjects.");
        }
        setTasks(tasksData.tasks);
        setSubjects(subjectsData.subjects);
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
        const expanded = expandedTaskId === task._id;
        const subject = subjects.find((item) => item._id === task.subjectId);
        return (
          <Card
            key={task._id}
            className={`cursor-pointer p-4 transition-[transform,box-shadow,border-color, background] duration-300 ease-out hover:-translate-y-0.5 hover:bg-blue-50 hover:border-blue-900 hover:shadow-[0_16px_34px_rgba(20,89,230,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary) ${completed ? "opacity-65" : ""}`}
            tabIndex={0}
            aria-expanded={expanded}
            onClick={() => setExpandedTaskId(expanded ? null : task._id)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setExpandedTaskId(expanded ? null : task._id);
              }
            }}
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label={
                  completed ? `Reopen ${task.title}` : `Complete ${task.title}`
                }
                onClick={(event) => {
                  event.stopPropagation();
                  setTasks((items) =>
                    items.map((item) =>
                      item._id === task._id
                        ? {
                            ...item,
                            status: completed ? "pending" : "completed",
                          }
                        : item,
                    ),
                  );
                }}
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${completed ? "border-(--accent) bg-(--accent) text-white" : "border-[#b7c1bb] text-transparent hover:border-(--accent)"}`}
              >
                <Check size={13} strokeWidth={3} />
              </button>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p
                    className={`truncate text-sm font-semibold ${completed ? "line-through" : ""}`}
                  >
                    {task.title}
                  </p>
                  <Link
                    href={`/tasks/${task._id}/edit`}
                    aria-label={`Edit ${task.title}`}
                    onClick={(event) => event.stopPropagation()}
                    className="shrink-0 rounded-lg p-1 text-(--muted) hover:bg-(--surface-muted) hover:text-(--primary-strong)"
                  >
                    <Pencil size={15} />
                  </Link>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-(--muted)">
                  <span className="flex items-center gap-1">
                    <Circle
                      size={7}
                      fill="var(--primary)"
                      color="var(--primary)"
                    />
                    {subject?.code ?? "Unknown subject"}
                  </span>
                  <span className="capitalize">{task.type}</span>
                </div>
              </div>
              <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-(--danger)">
                <CalendarDays size={13} />
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
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
              <span className="shrink-0 text-(--muted)" aria-hidden="true">
                {expanded ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
              </span>
            </div>
            <div
              className={`overflow-hidden transition-[max-height,opacity,margin] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${expanded ? "mt-4 max-h-72 opacity-100" : "max-h-0 opacity-0"}`}
              aria-hidden={!expanded}
            >
              <div className="border-t border-(--border) pt-4">
                <p className="text-sm leading-6 text-(--muted)">
                  {task.description || "No description added."}
                </p>
                {subject && (
                  <p className="mt-3 text-xs font-semibold text-(--muted)">
                    {subject.name} · {subject.code}
                  </p>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
