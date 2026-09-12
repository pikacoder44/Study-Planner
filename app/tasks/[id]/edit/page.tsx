"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import type { ISubject } from "@/models/Subject";
import {
  Button,
  Card,
  Field,
  Input,
  PageHeader,
  Select,
} from "@/components/ui";

type Task = {
  _id: string;
  title: string;
  description: string;
  subjectId: string;
  type: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
};

function toDateInputValue(value: string) {
  return value.slice(0, 10);
}

export default function EditTaskPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const today = new Date();
  const minimumDueDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  useEffect(() => {
    async function loadTask() {
      try {
        const [tasksResponse, subjectsResponse] = await Promise.all([
          fetch("/api/tasks"),
          fetch("/api/subject"),
        ]);
        const tasksData = await tasksResponse.json();
        const subjectsData = await subjectsResponse.json();

        if (!tasksResponse.ok) {
          throw new Error(tasksData.error || "Unable to load task.");
        }
        if (!subjectsResponse.ok) {
          throw new Error(subjectsData.error || "Unable to load subjects.");
        }

        const selectedTask = tasksData.tasks.find(
          (item: Task) => item._id === id,
        );
        if (!selectedTask) {
          throw new Error("Task not found.");
        }
        setTask(selectedTask);
        setSubjects(subjectsData.subjects || []);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load task.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadTask();
  }, [id]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/tasks/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: id,
          title: formData.get("title"),
          description: formData.get("description"),
          subjectId: formData.get("subjectId"),
          type: formData.get("type"),
          dueDate: formData.get("dueDate"),
          priority: formData.get("priority"),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to update task.");
      }
      router.push("/tasks");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to update task.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Tasks"
        title="Edit task"
        description="Update the details and deadline for this piece of work."
      />
      {loading && <p className="text-sm text-(--muted)">Loading task...</p>}
      {!loading && task && (
        <Card className="max-w-2xl p-6">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Field label="Task title">
              <Input name="title" defaultValue={task.title} required />
            </Field>
            <Field label="Description">
              <textarea
                name="description"
                defaultValue={task.description}
                className="min-h-28 w-full rounded-md border border-(--border) p-3 text-sm outline-none focus:border-(--accent)"
                required
              />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Subject">
                <Select name="subjectId" defaultValue={task.subjectId} required>
                  {subjects.map((subject) => (
                    <option
                      key={String(subject._id)}
                      value={String(subject._id)}
                    >
                      {subject.name} ({subject.code})
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Task type">
                <Select name="type" defaultValue={task.type}>
                  <option value="assignment">Assignment</option>
                  <option value="homework">Homework</option>
                  <option value="revision">Revision</option>
                  <option value="reminder">Reminder</option>
                  <option value="general">General</option>
                </Select>
              </Field>
              <Field label="Due date">
                <Input
                  name="dueDate"
                  type="date"
                  defaultValue={toDateInputValue(task.dueDate)}
                  min={minimumDueDate}
                  required
                />
              </Field>
              <Field label="Priority">
                <Select name="priority" defaultValue={task.priority}>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="low">Low</option>
                </Select>
              </Field>
            </div>
            {error && (
              <p
                role="alert"
                className="rounded-xl bg-(--danger-soft) p-3 text-sm text-(--danger)"
              >
                {error}
              </p>
            )}
            <div className="flex justify-end gap-3 border-t border-(--border) pt-5">
              <Link href="/tasks">
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </Card>
      )}
      {!loading && !task && error && (
        <p
          role="alert"
          className="rounded-xl bg-(--danger-soft) p-4 text-sm text-(--danger)"
        >
          {error}
        </p>
      )}
    </AppShell>
  );
}
