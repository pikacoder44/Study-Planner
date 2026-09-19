"use client";

import { Clock3, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { Button, Card, PageHeader } from "@/components/ui";
import { getStudySessions, getSubjects } from "@/lib/frontend-data";
import { useRouter } from "next/navigation";
import type { StudySession, Subject } from "@/types";
export default function StudySessionsPage() {
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
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

  return (
    <AppShell>
      <PageHeader
        eyebrow="Focused time"
        title="Study sessions"
        description="Plan deliberate blocks of focus and see where your time is going."
        action={
          <Button onClick={() => router.push("/study-sessions/schedule")} variant="primary">
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
          className="rounded-xl bg-(--danger-soft) p-4 text-sm text-(--danger)"
        >
          {error}
        </p>
      )}
      {!loading && !error && studySessions.length === 0 && (
        <p className="text-sm text-(--muted)">No study sessions yet.</p>
      )}
      <div className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
        <Card className="p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-(--muted)">
            This week
          </p>
          <div className="mt-5 space-y-4">
            {[
              ["CS603", "4h 30m", 78],
              ["CS601", "2h 00m", 42],
              ["CS602", "3h 15m", 58],
            ].map(([code, time, width]) => (
              <div key={code}>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">{code}</span>
                  <span className="text-(--muted)">{time}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-[#edf0ed]">
                  <div
                    className="h-full rounded-full bg-(--accent)"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t border-(--border) pt-5">
            <p className="text-sm text-(--muted)">Total focused time</p>
            <p className="mt-1 text-2xl font-bold">9h 45m</p>
          </div>
        </Card>
        <div className="space-y-3">
          {studySessions.map((session) => (
            <Card key={session.id} className="flex items-center gap-4 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#e8eff1] text-(--accent)">
                <Clock3 size={19} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold">{session.title}</p>
                <p className="mt-1 text-xs text-(--muted)">
                  {
                    subjects.find((subject) => subject.id === session.subjectId)
                      ?.name
                  }{" "}
                  · {session.date}
                </p>
              </div>
              <p className="text-sm font-semibold text-(--accent)">
                {session.startTime} - {session.endTime}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
