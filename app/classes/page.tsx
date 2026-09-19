"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";

import { Button, Card, PageHeader } from "@/components/ui";
import { getClasses, getSubjects } from "@/lib/frontend-data";
import type { Class, Subject } from "@/types";
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
export default function ClassesPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const formatTime12Hour = (timeStr?: string) => {
    if (!timeStr) return "";

    // Handle strings like "14:30" or "14:30:00"
    const parts = timeStr.split(":");
    if (parts.length < 2) return timeStr; // Return as-is if string format is unexpected

    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];

    if (isNaN(hours)) return timeStr;

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // convert 0 to 12

    return `${hours}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    Promise.all([getClasses(), getSubjects()])
      .then(([classData, subjectData]) => {
        setClasses(classData);
        setSubjects(subjectData);
      })
      .catch((loadError) => {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load classes.",
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell>
      <PageHeader
        title="Classes"
        description="A simple timetable for the places you need to be."
        action={
          <Button onClick={() => router.push("/classes/add")}>
            <Plus size={17} />
            Add class
          </Button>
        }
      />
      {loading && <p className="text-sm text-(--muted)">Loading classes...</p>}
      {error && (
        <p
          role="alert"
          className="rounded-xl bg-(--danger-soft) p-4 text-sm text-(--danger)"
        >
          {error}
        </p>
      )}
      <div className="grid gap-3 md:grid-cols-5">
        {days.map((day) => (
          <Card key={day} className="group min-h-48 overflow-hidden hover:scale-105 hover:bg-white hover:text-black transition-all ease-in-out">
            <div className=" border-b border-(--border) bg-(--surface-muted) px-4 py-3">
              <p className="text-sm font-bold group-hover:text-white">{day}</p>
            </div>
            <div className="space-y-2 p-3">
              {!loading &&
                !error &&
                classes
                  .filter((item) => item.dayOfWeek === day)
                  .map((item) => {
                    const subject = subjects.find(
                      (subjectItem) => subjectItem.id === item.subjectId,
                    );
                    return (
                      <div
                        key={item.id}
                        className="rounded-md border-l-4 p-3"
                        style={{ borderColor: subject?.color }}
                      >
                        <p className="text-sm font-bold">{subject?.code}</p>
                        <p className="mt-1 text-xs text-(--muted)">
                          {formatTime12Hour(item.startTime)} -{" "}
                          {formatTime12Hour(item.endTime)}
                        </p>
                        <p className="mt-1 text-xs text-(--muted)">
                          Room No: {item.room}
                        </p>
                      </div>
                    );
                  })}
              {!loading &&
                !error &&
                classes.filter((item) => item.dayOfWeek === day).length ===
                  0 && (
                  <p className="p-3 text-xs text-(--muted)">
                    No classes scheduled.
                  </p>
                )}
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
