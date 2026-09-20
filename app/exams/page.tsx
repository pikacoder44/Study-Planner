"use client";

import {
  CalendarDays,
  MapPin,
  Plus,
  CheckCircle2,
  XCircle,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { useRouter } from "next/navigation";
import { Badge, Button, Card, PageHeader } from "@/components/ui";
import {
  getExams,
  getSubjects,
  updateExam,
  deleteExam,
} from "@/lib/frontend-data";
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

    const cleanDateStr = dateStr.includes("T")
      ? dateStr.split("T")[0]
      : dateStr;
    const parts = cleanDateStr.split("-");

    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const monthIndex = parseInt(parts[1], 10) - 1;
      const dayNum = parseInt(parts[2], 10);

      const utcDate = new Date(Date.UTC(year, monthIndex, dayNum));

      return {
        month: utcDate.toLocaleDateString("en-US", {
          month: "short",
          timeZone: "UTC",
        }),
        day: String(dayNum).padStart(2, "0"),
      };
    }

    const date = new Date(dateStr);
    return {
      month: isNaN(date.getTime())
        ? "AUG"
        : date.toLocaleDateString("en-US", { month: "short" }),
      day: isNaN(date.getTime())
        ? "01"
        : String(date.getDate()).padStart(2, "0"),
    };
  };

  const getExamBadgeDetails = (dateStr: string, status?: string) => {
    if (status === "cancelled") {
      return { label: "Cancelled", tone: "neutral" as const, isPast: true };
    }
    if (status === "completed") {
      return { label: "Completed", tone: "neutral" as const, isPast: false };
    }

    if (!dateStr)
      return { label: "Upcoming", tone: "red" as const, isPast: false };

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

  const handleStatusUpdate = async (
    id: string,
    newStatus: "completed" | "cancelled" | "upcoming",
  ) => {
    setExams((prev) =>
      prev.map((item) => {
        const itemId = item.id || (item as unknown as { _id: string })._id;
        return itemId === id ? { ...item, status: newStatus } : item;
      }),
    );

    try {
      await updateExam(id, { status: newStatus });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status.");
      const original = await getExams();
      setExams(original);
    }
  };

  const handleDelete = async (id: string) => {
    setExams((prev) =>
      prev.filter(
        (item) => (item.id || (item as unknown as { _id: string })._id) !== id,
      ),
    );

    try {
      await deleteExam(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete exam.");
      const original = await getExams();
      setExams(original);
    }
  };

  // Sort exams: active first, completed second, cancelled at the bottom
  const sortedExams = [...exams].sort((a, b) => {
    const score = (status?: string) =>
      status === "cancelled" ? 2 : status === "completed" ? 1 : 0;
    return score(a.status) - score(b.status);
  });

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
        {sortedExams.map((exam) => {
          const examId = exam.id || (exam as unknown as { _id: string })._id;
          const isCancelled = exam.status === "cancelled";
          const isCompleted = exam.status === "completed";

          const { month, day } = parseExamDate(exam.examDate);
          const { label, tone } = getExamBadgeDetails(
            exam.examDate,
            exam.status,
          );

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
              key={examId}
              className={`group relative p-5 transition-all overflow-hidden ${
                isCancelled
                  ? "border-red-900/60 bg-red-950/20 text-red-500 opacity-90"
                  : isCompleted
                    ? "border-emerald-800/60 bg-emerald-950/20 text-emerald-400"
                    : ""
              }`}
            >
              {/* Card Contents */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge
                    tone={
                      isCancelled ? "neutral" : isCompleted ? "emerald" : tone
                    }
                  >
                    {label}
                  </Badge>
                  <h2
                    className={`mt-4 text-lg font-bold ${
                      isCancelled
                        ? "text-red-400 line-through decoration-red-400/80"
                        : isCompleted
                          ? "text-emerald-400"
                          : ""
                    }`}
                  >
                    {exam.title}
                  </h2>
                  <p
                    className={`mt-1 text-sm font-semibold ${
                      isCancelled
                        ? "text-red-400/80 line-through decoration-red-400/60"
                        : isCompleted
                          ? "text-emerald-400/80"
                          : "text-(--accent)"
                    }`}
                  >
                    {subject?.code || exam.subjectName}
                  </p>
                </div>
                <div
                  className={`rounded-md px-3 py-2 text-center shrink-0 ${
                    isCancelled
                      ? "bg-red-900/40 border border-red-800/50"
                      : isCompleted
                        ? "bg-emerald-900/40 border border-emerald-800/50"
                        : "bg-[#f6e9e7]"
                  }`}
                >
                  <p
                    className={`text-xs font-bold uppercase ${
                      isCancelled
                        ? "text-red-400 line-through decoration-red-400/80"
                        : isCompleted
                          ? "text-emerald-300"
                          : "text-[#9a514b]"
                    }`}
                  >
                    {month}
                  </p>
                  <p
                    className={`text-xl font-bold ${
                      isCancelled
                        ? "text-red-300 line-through decoration-red-300/80"
                        : isCompleted
                          ? "text-emerald-200"
                          : "text-[#9a514b]"
                    }`}
                  >
                    {day}
                  </p>
                </div>
              </div>

              <div
                className={`mt-5 grid gap-3 border-t pt-4 text-sm sm:grid-cols-2 ${
                  isCancelled
                    ? "border-red-900/40 text-red-400/80"
                    : isCompleted
                      ? "border-emerald-800/40 text-emerald-400/80"
                      : "border-(--border) text-(--muted)"
                }`}
              >
                <span
                  className={`flex items-center gap-2 ${isCancelled ? "line-through decoration-red-400/60" : ""}`}
                >
                  <CalendarDays size={16} className="shrink-0" />
                  {timeText}
                </span>
                <span
                  className={`flex items-center gap-2 ${isCancelled ? "line-through decoration-red-400/60" : ""}`}
                >
                  <MapPin size={16} className="shrink-0" />
                  {exam.location || "Location not set"}
                </span>
              </div>

              {exam.description && (
                <p
                  className={`mt-4 text-sm leading-6 ${
                    isCancelled
                      ? "text-red-400/70 line-through decoration-red-400/50"
                      : isCompleted
                        ? "text-emerald-400/70"
                        : "text-(--muted)"
                  }`}
                >
                  {exam.description}
                </p>
              )}

              {/* CANCELLED STATE: Large Central Action Blocks */}
              {isCancelled ? (
                <div className="relative z-20 mt-6 grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate(examId, "upcoming")}
                    className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3.5 text-zinc-900 shadow-lg transition-all duration-200 hover:scale-[1.02] hover:border-zinc-300 hover:bg-zinc-100 active:scale-[0.98] dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-100 dark:hover:border-zinc-500 dark:hover:bg-zinc-800"
                  >
                    <RotateCcw
                      size={20}
                      className="text-zinc-600 dark:text-zinc-300"
                    />
                    <span className="text-sm font-bold tracking-wide">
                      Reopen Exam
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(examId)}
                    className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-rose-800 shadow-lg transition-all duration-200 hover:scale-[1.02] hover:border-rose-400 hover:bg-rose-100 hover:text-rose-950 active:scale-[0.98] dark:border-rose-800/80 dark:bg-rose-950/70 dark:text-rose-200 dark:hover:border-rose-600 dark:hover:bg-rose-900 dark:hover:text-white"
                  >
                    <Trash2 size={20} className="text-rose-400" />
                    <span className="text-sm font-bold tracking-wide">
                      Delete Exam
                    </span>
                  </button>
                </div>
              ) : isCompleted ? (
                /* COMPLETED STATE: Green highlight & Reopen option only */
                <div className="mt-5 flex items-center justify-between border-t border-emerald-800/40 pt-3">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <CheckCircle2 size={16} /> Exam completed
                  </span>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => handleStatusUpdate(examId, "upcoming")}
                    className="h-8 gap-1.5 border-emerald-200 bg-emerald-50 px-3 text-xs text-emerald-800 hover:text-emerald-950 dark:border-emerald-800/50 dark:bg-emerald-950/30 dark:text-zinc-300 dark:hover:text-white"
                  >
                    <RotateCcw size={14} /> Reopen
                  </Button>
                </div>
              ) : (
                /* ACTIVE STATE: Standard Status Buttons */
                <div className="mt-5 flex items-center gap-2 border-t border-zinc-200/80 pt-3 dark:border-zinc-800/60">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => handleStatusUpdate(examId, "completed")}
                    className="text-xs h-8 px-3 gap-1.5 hover:border-emerald-600/50 hover:text-emerald-400"
                  >
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    Mark completed
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => handleStatusUpdate(examId, "cancelled")}
                    className="text-xs h-8 px-3 gap-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 hover:border-rose-800/50"
                  >
                    <XCircle size={14} className="text-rose-400" />
                    Mark cancel
                  </Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
