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
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui";
import { completeTask, getSubjects, getTasks } from "@/lib/frontend-data";
import type { Subject, Task } from "@/types";

export default function TaskList({ limit }: { limit?: number }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTasks() {
      try {
        const [taskData, subjectData] = await Promise.all([
          getTasks(),
          getSubjects(),
        ]);
        setTasks(taskData);
        setSubjects(subjectData);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load tasks.",
        );
      } finally {
        setLoading(false);
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

  if (loading) {
    return <p className="text-sm text-(--muted)">Loading tasks...</p>;
  }

  if (visibleTasks.length === 0) {
    return <p className="text-sm text-(--muted)">No tasks yet.</p>;
  }

  return (
    <motion.div
      className="space-y-2"
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
    >
      <AnimatePresence initial={false}>
        {visibleTasks.map((task) => {
          const completed = task.status === "completed";
          const expanded = expandedTaskId === task.id;
          const subject = subjects.find((item) => item.id === task.subjectId);
          return (
            <motion.div
              key={task.id}
              layout
              variants={{
                hidden: { opacity: 0, y: 8 },
                show: { opacity: 1, y: 0 },
              }}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              whileHover={{ y: -2, scale: 1.01 }}
              className={`cursor-pointer rounded-xl bg-(--surface) p-4 shadow-xs hover:border-(--primary-strong) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary) ${
                completed ? "opacity-60" : ""
              }`}
              tabIndex={0}
              aria-expanded={expanded}
              onClick={() => setExpandedTaskId(expanded ? null : task.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setExpandedTaskId(expanded ? null : task.id);
                }
              }}
            >
              <div className="flex items-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  type="button"
                  aria-label={
                    completed
                      ? `Reopen ${task.title}`
                      : `Complete ${task.title}`
                  }
                  onClick={async (event) => {
                    event.stopPropagation();
                    const nextCompleted = !completed;
                    setTasks((items) =>
                      items.map((item) =>
                        item.id === task.id
                          ? {
                              ...item,
                              status: nextCompleted ? "completed" : "pending",
                            }
                          : item,
                      ),
                    );
                    try {
                      await completeTask(task.id, nextCompleted);
                    } catch (mutationError) {
                      setTasks((items) =>
                        items.map((item) =>
                          item.id === task.id ? task : item,
                        ),
                      );
                      setError(
                        mutationError instanceof Error
                          ? mutationError.message
                          : "Unable to update task.",
                      );
                    }
                  }}
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    completed
                      ? "border-(--primary) bg-(--primary) text-white"
                      : "border-(--muted) text-transparent hover:border-(--primary)"
                  }`}
                >
                  <Check size={13} strokeWidth={3} />
                </motion.button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p
                      className={`truncate text-sm font-semibold text-(--foreground) ${
                        completed ? "line-through text-(--muted)" : ""
                      }`}
                    >
                      {task.title}
                    </p>
                    <Link
                      href={`/tasks/${task.id}/edit`}
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
                  {expanded ? (
                    <ChevronUp size={17} />
                  ) : (
                    <ChevronDown size={17} />
                  )}
                </span>
              </div>

              <div
                className={`overflow-hidden transition-[max-height,opacity,margin] duration-300 ease-out ${
                  expanded ? "mt-4 max-h-72 opacity-100" : "max-h-0 opacity-0"
                }`}
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
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}
