"use client";

import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  Check,
  Clock3,
  GraduationCap,
  MapPin,
  Plus,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import TaskList from "@/components/TaskList";
import { Badge, Button, Card, PageHeader } from "@/components/ui";
import { getClasses, getDashboard, getSubjects } from "@/lib/frontend-data";
import type { Class, Exam, StudySession, Subject, Task } from "@/types";

// Icon chips reuse the sidebar logo's gradient treatment so every section
// header feels like it belongs to the same system, not a one-off accent.
const CHIP = {
  primary: "bg-[linear-gradient(145deg,var(--primary),var(--primary-strong))]",
  support: "bg-[linear-gradient(145deg,var(--support),#0c8988)]",
  danger: "bg-[linear-gradient(145deg,var(--danger),#b23955)]",
} as const;

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<Awaited<
    ReturnType<typeof getDashboard>
  > | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setHasMounted(true));
    Promise.all([getDashboard(), getSubjects(), getClasses()])
      .then(([dashboardData, subjectData, classData]) => {
        setDashboard(dashboardData);
        setSubjects(subjectData);
        setClasses(classData);
      })
      .catch((loadError) =>
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load dashboard.",
        ),
      )
      .finally(() => setLoading(false));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const tasks: Task[] = dashboard?.dueTodayTasks ?? [];
  const exams: Exam[] = dashboard?.upcomingExams ?? [];
  const studySessions: StudySession[] = dashboard?.recentStudySessions ?? [];
  const pendingTasks =
    dashboard?.statistics.pendingTasks ??
    tasks.filter((task) => task.status === "pending").length;
  const upcomingExams = exams.slice(0, 2);
  const upcomingClasses = classes.slice(0, 3);
  const todaySchedule = (dashboard?.todaySchedule ?? []).map(
    (item) =>
      [
        String(item.startTime ?? ""),
        String(item.title ?? ""),
        String(item.room ?? item.priority ?? ""),
        String(item.type ?? ""),
      ] as const,
  );
  const userName = "there";

  return (
    <AppShell>
      {loading && (
        <p className="text-sm text-(--muted)">Loading dashboard...</p>
      )}
      {error && (
        <p
          role="alert"
          className="rounded-xl bg-(--danger-soft) p-4 text-sm text-(--danger)"
        >
          {error}
        </p>
      )}
      <PageHeader
        eyebrow={
          dashboard?.date ??
          (hasMounted ? new Date().toISOString().slice(0, 10) : "Today")
        }
        title={`Good morning, ${userName}`}
        description="Here is what you have planned today, and what deserves your attention next."
        action={
          <Link href="/tasks/new">
            <Button>
              <Plus size={17} />
              New task
            </Button>
          </Link>
        }
      />

      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.05 } },
        }}
        className="mb-10 grid gap-px overflow-hidden rounded-xl border border-zinc-800 bg-zinc-800 sm:grid-cols-2 xl:grid-cols-4"
      >
        <QuickStat
          icon={<Check size={17} />}
          tone="primary"
          label="Pending tasks"
          value={`${pendingTasks}`}
          detail="1 needs attention today"
        />
        <QuickStat
          icon={<CalendarDays size={17} />}
          tone="danger"
          label="Overdue"
          value="0"
          detail="You are on track"
        />
        <QuickStat
          icon={<GraduationCap size={17} />}
          tone="danger"
          label="Upcoming exams"
          value={`${upcomingExams.length}`}
          detail="Next one tomorrow"
        />
        <QuickStat
          icon={<Clock3 size={17} />}
          tone="support"
          label="Study time"
          value={`${Math.floor((dashboard?.statistics.studyMinutes ?? 0) / 60)}h ${(dashboard?.statistics.studyMinutes ?? 0) % 60}m`}
          detail={`Across ${studySessions.length} sessions`}
        />
      </motion.div>

      <div className="grid gap-10 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-10">
          <DashboardSection
            title="Today's schedule"
            icon={<CalendarDays size={16} />}
            tone="primary"
          >
            <Card className="divide-y divide-(--border) p-0">
              {todaySchedule.map(([time, title, detail, type]) => (
                <div
                  key={title}
                  className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-4 px-5 py-4"
                >
                  <span className="text-sm font-bold text-(--primary-strong)">
                    {time}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-foreground">{title}</p>
                    <p className="mt-1 text-xs text-(--muted)">{detail}</p>
                  </div>
                  <Badge
                    tone={
                      type === "Task"
                        ? "amber"
                        : type === "Class"
                          ? "blue"
                          : "neutral"
                    }
                  >
                    {type}
                  </Badge>
                </div>
              ))}
            </Card>
          </DashboardSection>

          <DashboardSection
            title="Tasks to complete"
            icon={<Check size={16} />}
            tone="primary"
            action={
              <Link
                href="/tasks"
                className="text-sm font-semibold text-(--primary-strong) hover:underline"
              >
                View all
              </Link>
            }
          >
            <TaskList limit={3} />
          </DashboardSection>

          <DashboardSection
            title="Recent study activity"
            icon={<Clock3 size={16} />}
            tone="support"
            action={
              <Link
                href="/study-sessions"
                className="text-sm font-semibold text-(--primary-strong) hover:underline"
              >
                See history
              </Link>
            }
          >
            <Card className="divide-y divide-(--border) p-0">
              {studySessions.slice(0, 3).map((session) => (
                <div
                  key={session.id || session._id}
                  className="flex items-center gap-4 px-5 py-4"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--support-soft) text-(--support)">
                    <BookOpen size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-foreground">
                      {session.title}
                    </p>
                    <p className="mt-1 text-xs text-(--muted)">
                      {
                        subjects.find(
                          (subject) => subject.id === session.subjectId,
                        )?.code
                      }{" "}
                      · {session.date}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-(--muted)">
                    {session.startTime}–{session.endTime}
                  </span>
                </div>
              ))}
            </Card>
          </DashboardSection>
        </div>

        <aside className="space-y-8">
          <DashboardSection
            title="Upcoming exams"
            icon={<GraduationCap size={16} />}
            tone="danger"
            action={
              <Link
                href="/exams"
                className="text-sm font-semibold text-(--primary-strong) hover:underline"
              >
                View all
              </Link>
            }
          >
            <div className="space-y-3">
              {upcomingExams.map((exam, index) => (
                <Card
                  key={exam.id}
                  className="relative overflow-hidden p-4 pl-5"
                >
                  <span
                    className={`absolute inset-y-0 left-0 w-1.5 ${
                      index === 0 ? "bg-(--danger)" : "bg-(--support)"
                    }`}
                  />
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.06em] text-(--primary-strong)">
                        {
                          subjects.find(
                            (subject) => subject.id === exam.subjectId,
                          )?.code
                        }
                      </p>
                      <p className="mt-1 text-sm font-bold text-foreground">
                        {exam.title}
                      </p>
                    </div>
                    <Badge tone={index === 0 ? "red" : "amber"}>
                      {index === 0 ? "Tomorrow" : "9 days"}
                    </Badge>
                  </div>
                  <p className="mt-3 text-xs text-(--muted)">
                    {exam.examDate} · {exam.startTime} · {exam.location}
                  </p>
                </Card>
              ))}
            </div>
          </DashboardSection>

          <DashboardSection
            title="Upcoming classes"
            icon={<GraduationCap size={16} />}
            tone="primary"
            action={
              <Link
                href="/classes"
                className="text-sm font-semibold text-(--primary-strong) hover:underline"
              >
                Timetable
              </Link>
            }
          >
            <Card className="divide-y divide-(--border) p-0">
              {upcomingClasses.map((item) => {
                const subject = subjects.find(
                  (subjectItem) => subjectItem.id === item.subjectId,
                );
                return (
                  <div key={item.id} className="px-5 py-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-foreground">
                        {subject?.code}
                      </p>
                      <span className="text-xs font-semibold text-(--primary-strong)">
                        {item.dayOfWeek}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-foreground">
                      {subject?.name}
                    </p>
                    <p className="mt-2 flex items-center gap-1 text-xs text-(--muted)">
                      <Clock3 size={13} />
                      {item.startTime}–{item.endTime}
                      <span className="mx-1">·</span>
                      <MapPin size={13} />
                      {item.room}
                    </p>
                  </div>
                );
              })}
            </Card>
          </DashboardSection>

          <DashboardSection
            title="Study progress"
            icon={<Clock3 size={16} />}
            tone="support"
          >
            <Card className="p-5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-extrabold tracking-[-0.03em] text-foreground">
                    9h 45m
                  </p>
                  <p className="mt-1 text-xs text-(--muted)">
                    Focused study this week
                  </p>
                </div>
                <span className="rounded-full bg-(--support-soft) px-2.5 py-1 text-xs font-bold text-(--support)">
                  +2h this week
                </span>
              </div>
              <div className="mt-5 h-2 rounded-full bg-(--surface-muted)">
                <div className="h-full w-[68%] rounded-full bg-[linear-gradient(90deg,var(--support),var(--primary))]" />
              </div>
              <div className="mt-3 flex justify-between text-xs text-(--muted)">
                <span>Goal: 14 hours</span>
                <span className="font-semibold text-foreground">68%</span>
              </div>
            </Card>
          </DashboardSection>
        </aside>
      </div>
    </AppShell>
  );
}

function QuickStat({
  icon,
  tone,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  tone: keyof typeof CHIP;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
      className="flex items-start gap-4 bg-zinc-950/60 p-5"
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-(--shadow-card) ${CHIP[tone]}`}
      >
        {icon}
      </span>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-(--muted)">
          {label}
        </p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-2xl font-extrabold tracking-[-0.03em] text-foreground">
            {value}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-(--muted)">{detail}</p>
      </div>
    </motion.div>
  );
}

function DashboardSection({
  title,
  icon,
  tone,
  action,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  tone: keyof typeof CHIP;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2.5 text-lg font-extrabold tracking-[-0.02em] text-foreground">
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-lg text-white ${CHIP[tone]}`}
          >
            {icon}
          </span>
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}
