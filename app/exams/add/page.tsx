"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import {
  Button,
  Card,
  Field,
  Input,
  PageHeader,
  Select,
  Textarea,
} from "@/components/ui";
import { createExam, getSubjects } from "@/lib/frontend-data";
import type { Subject } from "@/types";

export default function AddExamPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void getSubjects()
      .then(setSubjects)
      .catch((loadError) =>
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load subjects.",
        ),
      )
      .finally(() => setLoadingSubjects(false));
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.currentTarget);
    const subjectId = String(formData.get("subjectId") ?? "");
    const subject = subjects.find((item) => item.id === subjectId);
    try {
      await createExam({
        title: String(formData.get("title") ?? ""),
        subjectId,
        subjectName: subject?.name ?? "",
        examDate: String(formData.get("examDate") ?? ""),
        startTime: String(formData.get("startTime") ?? ""),
        endTime: String(formData.get("endTime") ?? ""),
        location: String(formData.get("location") ?? ""),
        description: String(formData.get("description") ?? ""),
        status: "upcoming",
        priority: String(formData.get("priority") ?? "medium") as
          | "low"
          | "medium"
          | "high",
      } as Parameters<typeof createExam>[0]);
      router.push("/exams");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to create exam.",
      );
    }
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Exams"
        title="Add an exam"
        description="Put the date on your radar and make revision easier to plan."
      />
      <Card className="max-w-2xl p-6">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Field label="Exam title">
            <Input
              name="title"
              placeholder="e.g. Software Architecture final"
              required
            />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Subject">
              <Select name="subjectId" defaultValue="" required>
                <option value="" disabled>
                  {loadingSubjects ? "Loading subjects..." : "Select a subject"}
                </option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name} ({subject.code})
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Exam date">
              <Input name="examDate" type="date" required />
            </Field>
            <Field label="Starts">
              <Input name="startTime" type="time" />
            </Field>
            <Field label="Ends">
              <Input name="endTime" type="time" />
            </Field>
            <Field label="Location">
              <Input name="location" placeholder="e.g. Main hall" />
            </Field>
            <Field label="Priority">
              <Select name="priority" defaultValue="medium">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </Select>
            </Field>
          </div>
          <Field label="Notes">
            <Textarea
              name="description"
              placeholder="Topics, room, or anything else to remember."
            />
          </Field>
          {error && (
            <p
              role="alert"
              className="rounded-xl bg-(--danger-soft) p-3 text-sm text-(--danger)"
            >
              {error}
            </p>
          )}
          <div className="flex justify-end gap-3 border-t border-(--border) pt-5">
            <Link href="/exams">
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </Link>
            <Button type="submit">Add exam</Button>
          </div>
        </form>
      </Card>
    </AppShell>
  );
}
