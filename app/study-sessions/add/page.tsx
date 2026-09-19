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
import { createStudySession, getSubjects } from "@/lib/frontend-data";
import type { Subject } from "@/types";

export default function AddStudySessionPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void getSubjects()
      .then(setSubjects)
      .catch((loadError) =>
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load subjects."
        )
      )
      .finally(() => setLoadingSubjects(false));
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const startTime = String(formData.get("startTime") ?? "");
    const endTime = String(formData.get("endTime") ?? "");

    // Client-side time validation
    if (startTime && endTime && startTime >= endTime) {
      setError("End time must be after start time.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createStudySession({
        title: String(formData.get("title") ?? ""),
        subjectId: String(formData.get("subjectId") ?? ""),
        date: String(formData.get("date") ?? ""),
        startTime,
        endTime,
        notes: String(formData.get("notes") ?? ""),
      });
      router.push("/study-sessions");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to schedule study session."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Study sessions"
        title="Schedule a study session"
        description="Give focused work a time, a subject, and a finish line."
      />
      <Card className="max-w-2xl p-6">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Field label="Session title">
            <Input
              name="title"
              placeholder="e.g. Revise architectural patterns"
              required
              disabled={isSubmitting}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Subject">
              <Select
                name="subjectId"
                defaultValue=""
                required
                disabled={isSubmitting || loadingSubjects}
              >
                <option value="" disabled>
                  {loadingSubjects
                    ? "Loading subjects..."
                    : "Select a subject"}
                </option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name} ({subject.code})
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Date">
              <Input
                name="date"
                type="date"
                required
                disabled={isSubmitting}
              />
            </Field>

            <Field label="Starts">
              <Input
                name="startTime"
                type="time"
                required
                disabled={isSubmitting}
              />
            </Field>

            <Field label="Ends">
              <Input
                name="endTime"
                type="time"
                required
                disabled={isSubmitting}
              />
            </Field>
          </div>

          <Field label="Notes">
            <Textarea
              name="notes"
              placeholder="What will you focus on during this block?"
              disabled={isSubmitting}
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
            <Link href="/study-sessions">
              <Button type="button" variant="secondary" disabled={isSubmitting}>
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Scheduling..." : "Schedule session"}
            </Button>
          </div>
        </form>
      </Card>
    </AppShell>
  );
}