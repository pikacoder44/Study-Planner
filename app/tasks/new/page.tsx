"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { createTask, getSubjects } from "@/lib/frontend-data";
import type { Subject } from "@/types";
import { useState, useEffect } from "react";
import {
  Button,
  Card,
  Field,
  Input,
  PageHeader,
  Select,
} from "@/components/ui";
export default function NewTaskPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState("");
  const today = new Date();
  const minimumDueDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  useEffect(() => {
    let isMounted = true;

    async function loadSubjects() {
      try {
        const data = await getSubjects();
        if (isMounted) {
          setSubjects(data);
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadSubjects();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.currentTarget);
    try {
      await createTask({
          title: formData.get("title"),
          description: formData.get("description"),
          subjectId: formData.get("subjectId"),
          type: formData.get("type"),
          dueDate: formData.get("dueDate"),
          priority: formData.get("priority"),
        } as Parameters<typeof createTask>[0]);
      router.push("/tasks");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to create task.",
      );
    }
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Tasks"
        title="Create a task"
        description="Capture the next piece of work while it is still fresh."
      />
      <Card className="max-w-2xl p-6">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Field label="Task title">
            <Input
              name="title"
              placeholder="e.g. Complete architecture assignment"
              required
            />
          </Field>
          <Field label="Description">
            <textarea
              name="description"
              className="min-h-28 w-full rounded-md border border-(--border) p-3 text-sm outline-none focus:border-(--accent)"
              placeholder="What does done look like?"
            />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Subject">
              <Select name="subjectId" defaultValue="" required>
                <option value="" disabled>
                  {loading ? "Loading subjects..." : "Select a subject"}
                </option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name} ({subject.code})
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Task type">
              <Select name="type" defaultValue="assignment">
                <option value="assignment">Assignment</option>
                <option value="homework">Homework</option>
                <option value="revision">Revision</option>
                <option value="reminder">Reminder</option>
                <option value="general">General</option>
              </Select>
            </Field>
            <Field label="Due date">
              <Input name="dueDate" type="date" min={minimumDueDate} required />
            </Field>
            <Field label="Priority">
              <Select name="priority" defaultValue="medium">
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
            <Button type="submit">Create task</Button>
          </div>
        </form>
      </Card>
    </AppShell>
  );
}
