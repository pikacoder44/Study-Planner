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

  const formatTime12Hour = (timeStr?: string) => {
    if (!timeStr) return "";
    const parts = timeStr.split(":");
    if (parts.length < 2) return timeStr;

    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    if (isNaN(hours)) return timeStr;

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${hours}:${minutes} ${ampm}`;
  };

  const parseExamDate = (dateStr: string) => {
    if (!dateStr) return { month: "AUG", day: "01" };

    const cleanDateStr = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
    const parts = cleanDateStr.split("-");

    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const monthIndex = parseInt(parts[1], 10) - 1;
      const dayNum = parseInt(parts[2], 10);

      const utcDate = new Date(Date.UTC(year, monthIndex, dayNum));

      return {
        month: utcDate.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }),
        day: String(dayNum).padStart(2, "0"),
      };
    }

    const date = new Date(dateStr);
    return {
      month: isNaN(date.getTime()) ? "AUG" : date.toLocaleDateString("en-US", { month: "short" }),
      day: isNaN(date.getTime()) ? "01" : String(date.getDate()).padStart(2, "0"),
    };
  };

  const getExamBadgeDetails = (dateStr: string) => {
    if (!dateStr) return { label: "Upcoming", tone: "red" as const, isPast: false };

    const examDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    examDate.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil(
      (examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays < 0) {
      return { label: "Past exam", tone: "neutral" as const, isPast: true };
    }
    if (diffDays === 0) {
      return { label: "Today", tone: "red" as const, isPast: false };
    }
    if (diffDays === 1) {
      return { label: "Tomorrow", tone: "red" as const, isPast: false };
    }
    return {
      label: `In ${diffDays} days`,
      tone: "red" as const,
      isPast: false,
    };
  };

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
        {exams.map((exam) => {
          const { month, day } = parseExamDate(exam.examDate);
          const { label, tone, isPast } = getExamBadgeDetails(exam.examDate);

          const subject = subjects.find(
            (s) =>
              s.id === exam.subjectId ||
              (s as { _id?: string })._id === exam.subjectId,
          );

          const formattedStart = formatTime12Hour(exam.startTime);
          const formattedEnd = formatTime12Hour(exam.endTime);
          const timeText =
            formattedStart && formattedEnd
              ? `${formattedStart} - ${formattedEnd}`
              : formattedStart || formattedEnd || "Time not set";

          return (
            <Card
              key={exam.id || (exam as { _id?: string })._id}
              className={`p-5 ${isPast ? "opacity-70" : ""}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge tone={tone}>{label}</Badge>
                  <h2 className="mt-4 text-lg font-bold">{exam.title}</h2>
                  <p className="mt-1 text-sm font-semibold text-(--accent)">
                    {subject?.code || exam.subjectName}
                  </p>
                </div>
                <div className="rounded-md bg-[#f6e9e7] px-3 py-2 text-center shrink-0">
                  <p className="text-xs font-bold uppercase text-[#9a514b]">
                    {month}
                  </p>
                  <p className="text-xl font-bold text-[#9a514b]">{day}</p>
                </div>
              </div>
              <div className="mt-5 grid gap-3 border-t border-(--border) pt-4 text-sm text-(--muted) sm:grid-cols-2">
                <span className="flex items-center gap-2">
                  <CalendarDays size={16} />
                  {timeText}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin size={16} />
                  {exam.location || "Location not set"}
                </span>
              </div>
              {exam.description && (
                <p className="mt-4 text-sm leading-6 text-(--muted)">
                  {exam.description}
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}