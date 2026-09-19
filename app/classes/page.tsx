"use client";

import { AlertTriangle, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { Button, Card, PageHeader } from "@/components/ui";
import { getClasses, getSubjects } from "@/lib/frontend-data";
import type { Class, Subject } from "@/types";
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getClasses(), getSubjects()])
      .then(([classData, subjectData]) => {
        setClasses(classData);
        setSubjects(subjectData);
      })
      .catch((loadError) => {
        setError(loadError instanceof Error ? loadError.message : "Unable to load classes.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Weekly rhythm"
        title="Classes"
        description="A simple timetable for the places you need to be."
        action={
          <Button>
            <Plus size={17} />
            Add class
          </Button>
        }
      />
      {loading && <p className="text-sm text-(--muted)">Loading classes...</p>}
      {error && <p role="alert" className="rounded-xl bg-(--danger-soft) p-4 text-sm text-(--danger)">{error}</p>}
      <div className="grid gap-3 md:grid-cols-5">
        {days.map((day) => (
          <Card key={day} className="min-h-48 overflow-hidden">
            <div className="border-b border-(--border) bg-(--surface-muted) px-4 py-3">
              <p className="text-sm font-bold">{day}</p>
            </div>
            <div className="space-y-2 p-3">
              {!loading && !error && classes
                .filter((item) => item.dayOfWeek === day)
                .map((item) => {
                  const subject = subjects.find(
                    (subjectItem) => subjectItem.id === item.subjectId,
                  );
                  return (
                    <div
                      key={item.id}
                      className="rounded-md border-l-4 bg-[#f8faf8] p-3"
                      style={{ borderColor: subject?.color }}
                    >
                      <p className="text-sm font-bold">{subject?.code}</p>
                      <p className="mt-1 text-xs text-(--muted)">
                        {item.startTime} - {item.endTime}
                      </p>
                      <p className="mt-1 text-xs text-(--muted)">
                        {item.room}
                      </p>
                    </div>
                  );
                })}
              {!loading && !error && classes.filter((item) => item.dayOfWeek === day).length === 0 && (
                <p className="p-3 text-xs text-(--muted)">No classes scheduled.</p>
              )}
            </div>
          </Card>
        ))}
      </div>
      <Card className="mt-6 flex items-start gap-3 border-[#eadfca] bg-[#fffaf1] p-4">
        <AlertTriangle size={18} className="mt-0.5 text-[#9b783d]" />
        <div>
          <p className="text-sm font-bold">Conflict checking is enabled</p>
          <p className="mt-1 text-sm text-(--muted)">
            New timetable entries will be checked against overlapping classes
            before they are saved.
          </p>
        </div>
      </Card>
    </AppShell>
  );
}
