"use client";

import Link from "next/link";
import AppShell from "@/components/AppShell";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  Field,
  Input,
  PageHeader,
  Select,
} from "@/components/ui";

export default function NewSubjectPage() {
  const router = useRouter();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get("name"),
      code: formData.get("code"),
      color: formData.get("color"),
      description: formData.get("description"),
    };
    try {
      const response = await fetch("/api/subject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        router.push("/subjects");
      }
    } catch (error) {
      console.error("Error creating subject:", error);
    }
  };
  return (
    <AppShell>
      <PageHeader
        eyebrow="Subjects"
        title="Add a subject"
        description="Give your course a home for its tasks and progress."
      />
      <Card className="max-w-2xl p-6">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Field label="Subject name">
            <Input
              name="name"
              placeholder="e.g. Software Architecture"
              required
            />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Course code">
              <Input name="code" placeholder="e.g. CS603" required />
            </Field>
            <Field label="Accent color">
              <Select name="color" defaultValue="blue">
                <option value="blue">Ocean blue</option>
                <option value="green">Sage green</option>
                <option value="amber">Warm amber</option>
              </Select>
            </Field>
          </div>
          <Field label="Description">
            <textarea
              name="description"
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
