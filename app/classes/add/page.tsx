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
} from "@/components/ui";
import { createClass, getSubjects } from "@/lib/frontend-data";
import type { Subject } from "@/types";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;

export default function AddClassPage() {
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
    const startTime = String(formData.get("startTime") ?? "");
    const endTime = String(formData.get("endTime") ?? "");
    try {
      await createClass({
        subjectId: String(formData.get("subjectId") ?? ""),
        title: String(formData.get("title") ?? ""),
        dayOfWeek: String(
          formData.get("dayOfWeek") ?? "Monday",
        ) as (typeof days)[number],
        startTime: startTime ? `1970-01-01T${startTime}:00.000Z` : "",
        endTime: endTime ? `1970-01-01T${endTime}:00.000Z` : "",
        room: String(formData.get("room") ?? ""),
      } as Parameters<typeof createClass>[0]);
      router.push("/classes");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to create class.",
      );
    }
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Classes"
        title="Add a class"
        description="Keep your weekly timetable in one clear place."
      />
      <Card className="max-w-2xl p-6">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Field label="Class title">
            <Input name="title" placeholder="e.g. Lecture" required />
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
            <Field label="Day">
              <Select name="dayOfWeek" defaultValue="Monday">
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Starts">
              <Input name="startTime" type="time" required />
            </Field>
            <Field label="Ends">
              <Input name="endTime" type="time" />
            </Field>
            <Field label="Room">
              <Input name="room" placeholder="e.g. Room 204" />
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
            <Link href="/classes">
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </Link>
            <Button type="submit">Add class</Button>
          </div>
        </form>
      </Card>
    </AppShell>
  );
}
