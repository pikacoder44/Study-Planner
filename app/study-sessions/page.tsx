"use client";

import { Clock3, Trash2, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { Button, Card, PageHeader } from "@/components/ui";
import {
  getStudySessions,
  getSubjects,
  deleteStudySession,
  subscribeToDataInvalidation,
} from "@/lib/frontend-data";
import { useRouter } from "next/navigation";
import type { StudySession, Subject } from "@/types";
import { formatDateOnly } from "@/lib/api-date";

// Helper function to format HH:mm or HH:mm:ss strings to 12-hour format with AM/PM
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

export default function StudySessionsPage() {
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const loadData = useCallback(() => {
    Promise.all([getStudySessions(), getSubjects()])
      .then(([sessionData, subjectData]) => {
        setStudySessions(sessionData);
        setSubjects(subjectData);
      })
      .catch((loadError) => {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load study sessions.",
        );
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadData();
    // Re-fetch automatically when mutation invalidation fires
    const unsubscribe = subscribeToDataInvalidation((keys) => {
      if (keys.includes("study-sessions") || keys.includes("subjects")) {
        loadData();
      }
    });
    return () => unsubscribe();
  }, [loadData]);

  const handleDelete = async (sessionId: string) => {
    const previousSessions = [...studySessions];
    // Optimistic UI update
    setStudySessions((prev) => prev.filter((s) => s.id !== sessionId));

    try {
      await deleteStudySession(sessionId);
    } catch (deleteError) {
      // Revert on failure & set error
      setStudySessions(previousSessions);
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete study session.",
      );
    }
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Focused time"
        title="Study sessions"
        description="Plan deliberate blocks of focus and see where your time is going."
        action={
          <Button
            onClick={() => router.push("/study-sessions/add")}
            variant="primary"
          >
            <Plus size={17} />
            Schedule session
          </Button>
        }
      />

      {loading && (
        <p className="text-sm text-(--muted)">Loading study sessions...</p>
      )}

      {error && (
        <p
          role="alert"
          className="rounded-xl bg-(--danger-soft) p-4 text-sm text-(--danger) mb-4"
        >
          {error}
        </p>
      )}

      {!loading && !error && studySessions.length === 0 && (
        <p className="text-sm text-(--muted)">No study sessions yet.</p>
      )}

      <div className="grid gap-4 lg:grid-cols-1">
        <div className="space-y-3">
          {studySessions.map((session) => {
            const subjectName =
              subjects.find((subject) => subject.id === session.subjectId)
                ?.name ?? "General";

            return (
              <Card
                key={
                  session.id ||
                  `${session.date}-${session.startTime}-${session.title}`
                }
                className="flex items-center gap-4 p-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-(--background-soft) text-(--accent)">
                  <Clock3 size={19} />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold">{session.title}</p>
                  <p className="mt-1 text-xs text-(--muted)">
                    of <span className="font-bold">{subjectName}</span> at{" "}
                    <span className="font-bold">
                      {formatDateOnly(session.date)}
                    </span>
                  </p>
                  <p className="text-sm font-bold text-(--accent) items-center mt-2">
                    {formatTime12Hour(session.startTime)} -{" "}
                    {formatTime12Hour(session.endTime)}
                  </p>
                </div>
                <button
                  type="button"
                  className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md bg-(--background-soft) text-(--danger) transition-all duration-200 ease-in-out hover:scale-110 hover:bg-red-500 hover:text-white active:scale-95"
                  aria-label="Delete study session block"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this study session?",
                      )
                    ) {
                      handleDelete(session.id);
                    }
                  }}
                >
                  <Trash2 size={19} />
                </button>
              </Card>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
