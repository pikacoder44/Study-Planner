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

export default function NewSubjectPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Subjects"
        title="Add a subject"
        description="Give your course a home for its tasks and progress."
      />
      <Card className="max-w-2xl p-6">
        <form
          className="space-y-5"
          onSubmit={(event) => event.preventDefault()}
        >
          <Field label="Subject name">
            <Input placeholder="e.g. Software Architecture" required />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Course code">
              <Input placeholder="e.g. CS603" required />
            </Field>
            <Field label="Accent color">
              <Select defaultValue="blue">
                <option value="blue">Ocean blue</option>
                <option value="green">Sage green</option>
                <option value="amber">Warm amber</option>
              </Select>
            </Field>
          </div>
          <Field label="Description">
            <textarea
              className="min-h-28 w-full rounded-md border border-(--border) p-3 text-sm outline-none focus:border-(--accent)"
              placeholder="What is this course about?"
            />
          </Field>
          <div className="flex justify-end gap-3 border-t border-(--border) pt-5">
            <Link href="/subjects">
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </Link>
            <Button type="submit">Add subject</Button>
          </div>
        </form>
      </Card>
    </AppShell>
  );
}
