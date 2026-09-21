"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
import {
  getStudySessions,
  getSubjects,
  updateStudySession,
} from "@/lib/frontend-data";
import type { StudySession, Subject } from "@/types";

export default function UpdateStudySessionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [session, setSession] = useState<StudySession | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([getStudySessions(), getSubjects()])
      .then(([sessions, subjectData]) => {
        const selected = sessions.find((item) => item.id === id);
        if (!selected) throw new Error("Study session not found.");
        setSession(selected);
        setSubjects(subjectData);
      })
      .catch((loadError) =>
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load study session.",
        ),
      )
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    const formData = new FormData(event.currentTarget);
    const startTime = String(formData.get("startTime") ?? "");
    const endTime = String(formData.get("endTime") ?? "");
    if (startTime >= endTime) {
      setError("End time must be after start time.");
      setSaving(false);
      return;
    }
    try {
      await updateStudySession(id, {
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
          : "Unable to update study session.",
      );
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Study sessions"
        title="Update a study session"
        description="Adjust the subject, timing, or focus notes for this block."
      />
      {loading && (
        <p className="text-sm text-(--muted)">Loading study session...</p>
      )}
      {!loading && session && (
        <Card className="max-w-2xl p-6">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Field label="Session title">
              <Input name="title" defaultValue={session.title} required />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Subject">
                <Select
                  name="subjectId"
                  defaultValue={session.subjectId}
                  required
                >
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
                  defaultValue={session.date.slice(0, 10)}
                  required
                />
              </Field>
              <Field label="Starts">
                <Input
                  name="startTime"
                  type="time"
                  defaultValue={session.startTime.slice(0, 5)}
                  required
                />
              </Field>
              <Field label="Ends">
                <Input
                  name="endTime"
                  type="time"
                  defaultValue={session.endTime.slice(0, 5)}
                  required
                />
              </Field>
            </div>
            <Field label="Notes">
              <Textarea name="notes" defaultValue={session.notes} />
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
      {!loading && !session && error && (
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
