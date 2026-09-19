"use client";

import { CalendarDays, MapPin, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { useRouter } from "next/navigation";
import { Badge, Button, Card, PageHeader } from "@/components/ui";
import { getExams, getSubjects } from "@/lib/frontend-data";
import type { Exam, Subject } from "@/types";
export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    Promise.all([getExams(), getSubjects()])
      .then(([examData, subjectData]) => {
        setExams(examData);
        setSubjects(subjectData);
      })
      .catch((loadError) => {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load exams.",
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Important dates"
        title="Exams"
        description="Know what is coming, then give revision the time it deserves."
        action={
          <Button onClick={() => router.push("/exams/add")} variant="primary">
            <Plus size={17} />
            Add exam
          </Button>
        }
      />
      {loading && <p className="text-sm text-(--muted)">Loading exams...</p>}
      {error && (
        <p
          role="alert"
          className="rounded-xl bg-(--danger-soft) p-4 text-sm text-(--danger)"
        >
          {error}
        </p>
      )}
      {!loading && !error && exams.length === 0 && (
        <p className="text-sm text-(--muted)">No exams scheduled.</p>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {exams.map((exam, index) => (
          <Card
            key={exam.id}
            className={`p-5 ${index === 2 ? "opacity-70" : ""}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <Badge tone={index === 2 ? "neutral" : "red"}>
                  {index === 2
                    ? "Past exam"
                    : index === 0
                      ? "Tomorrow"
                      : "In 9 days"}
                </Badge>
                <h2 className="mt-4 text-lg font-bold">{exam.title}</h2>
                <p className="mt-1 text-sm font-semibold text-(--accent)">
                  {
                    subjects.find((subject) => subject.id === exam.subjectId)
                      ?.code
                  }
                </p>
              </div>
              <div className="rounded-md bg-[#f6e9e7] px-3 py-2 text-center">
                <p className="text-xs font-bold uppercase text-[#9a514b]">
                  Aug
                </p>
                <p className="text-xl font-bold text-[#9a514b]">
                  {exam.examDate.slice(-2)}
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 border-t border-(--border) pt-4 text-sm text-(--muted) sm:grid-cols-2">
              <span className="flex items-center gap-2">
                <CalendarDays size={16} />
                {exam.startTime} - {exam.endTime}
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={16} />
                {exam.location}
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-(--muted)">
              {exam.description}
            </p>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
