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
} from "@/components/ui";
import { getClasses, getSubjects, updateClass } from "@/lib/frontend-data";
import type { Class, Subject } from "@/types";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

function timeInputValue(value?: string) {
  if (!value) return "";
  if (value.includes("T")) return value.split("T")[1]?.slice(0, 5) ?? "";
  return value.slice(0, 5);
}

export default function UpdateClassPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [classItem, setClassItem] = useState<Class | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([getClasses(), getSubjects()])
      .then(([classData, subjectData]) => {
        const selected = classData.find((item) => item.id === id);
        if (!selected) throw new Error("Class not found.");
        setClassItem(selected);
        setSubjects(subjectData);
      })
      .catch((loadError) =>
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load class.",
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

    try {
      await updateClass(id, {
        subjectId: String(formData.get("subjectId") ?? ""),
        title: String(formData.get("title") ?? ""),
        dayOfWeek: String(
          formData.get("dayOfWeek") ?? "Monday",
        ) as Class["dayOfWeek"],
        startTime: startTime ? `1970-01-01T${startTime}:00.000Z` : "",
        endTime: endTime ? `1970-01-01T${endTime}:00.000Z` : "",
        room: String(formData.get("room") ?? ""),
      } as Partial<Omit<Class, "id">>);
      router.push("/classes");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to update class.",
      );
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Classes"
        title="Update a class"
        description="Keep your weekly timetable accurate and easy to scan."
      />
      {loading && <p className="text-sm text-(--muted)">Loading class...</p>}
      {!loading && classItem && (
        <Card className="max-w-2xl p-6">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Field label="Class title">
              <Input
                name="title"
                defaultValue={(classItem as Class & { title?: string }).title}
                required
              />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Subject">
                <Select
                  name="subjectId"
                  defaultValue={classItem.subjectId}
                  required
                >
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name} ({subject.code})
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Day">
                <Select name="dayOfWeek" defaultValue={classItem.dayOfWeek}>
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Starts">
                <Input
                  name="startTime"
                  type="time"
                  defaultValue={timeInputValue(classItem.startTime)}
                  required
                />
              </Field>
              <Field label="Ends">
                <Input
                  name="endTime"
                  type="time"
                  defaultValue={timeInputValue(classItem.endTime)}
                />
              </Field>
              <Field label="Room">
                <Input
                  name="room"
                  defaultValue={classItem.room}
                  placeholder="e.g. Room 204"
                />
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
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </Card>
      )}
      {!loading && !classItem && error && (
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
