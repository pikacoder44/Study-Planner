"use client";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import {
  Button,
  Card,
  Field,
  Input,
  PageHeader,
  Select,
} from "@/components/ui";
export default function NewTaskPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Tasks"
        title="Create a task"
        description="Capture the next piece of work while it is still fresh."
      />
      <Card className="max-w-2xl p-6">
        <form
          className="space-y-5"
          onSubmit={(event) => event.preventDefault()}
        >
          <Field label="Task title">
            <Input
              placeholder="e.g. Complete architecture assignment"
              required
            />
          </Field>
          <Field label="Description">
            <textarea
              className="min-h-28 w-full rounded-md border border-(--border) p-3 text-sm outline-none focus:border-(--accent)"
              placeholder="What does done look like?"
            />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Subject">
              <Select>
                <option>Software Architecture</option>
                <option>Database Systems</option>
                <option>Web Engineering</option>
              </Select>
            </Field>
            <Field label="Task type">
              <Select>
                <option>Assignment</option>
                <option>Homework</option>
                <option>Revision</option>
                <option>Reminder</option>
              </Select>
            </Field>
            <Field label="Due date">
              <Input type="date" defaultValue="2026-08-23" />
            </Field>
            <Field label="Priority">
              <Select>
                <option>Medium</option>
                <option>High</option>
                <option>Low</option>
              </Select>
            </Field>
          </div>
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
