"use client";

import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  Check,
  Clock3,
  GraduationCap,
  AlertTriangle,
  MapPin,
  Plus,
  Target,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { Badge, Button, Card, PageHeader } from "@/components/ui";
import { getDashboard } from "@/lib/frontend-data";
import type { Exam, StudySession, Task } from "@/types";

const CHIP = {
  primary:
    "bg-[linear-gradient(145deg,var(--primary),var(--primary-strong))] text-white",
  support: "bg-[linear-gradient(145deg,var(--support),#0c8988)] text-white",
  danger: "bg-[linear-gradient(145deg,var(--danger),#b23955)] text-white",
} as const;

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<Awaited<
    ReturnType<typeof getDashboard>
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setHasMounted(true));
    getDashboard()
      .then((dashboardData) => setDashboard(dashboardData))
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

  const tasks: Task[] = dashboard?.priorityTasks ?? [];
  const exams: Exam[] = dashboard?.upcomingExams ?? [];
  const studySessions: StudySession[] = dashboard?.recentStudySessions ?? [];
  const overdueTasks = dashboard?.overdueTasks ?? [];
  const upcomingExams = exams.slice(0, 3);
  const weeklyProgress = dashboard?.statistics.weeklyProgress;

  const todaySchedule = (dashboard?.todaySchedule ?? []).map(
    (item, index) =>
      [
        String(item.id ?? `${item.type ?? "schedule"}-${index}`),
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
        className="mb-10 grid gap-px overflow-hidden rounded-xl border border-(--border) bg-(--border) sm:grid-cols-2 xl:grid-cols-4"
      >
        <QuickStat
          icon={<Check size={17} />}
          tone="primary"
          label="Due today"
          value={`${dashboard?.dueTodayTasks.length ?? 0}`}
          detail="Tasks planned for today"
        />
        <QuickStat
          icon={<CalendarDays size={17} />}
          tone="danger"
          label="Overdue"
          value={`${overdueTasks.length}`}
          detail={overdueTasks.length ? "Needs attention" : "Nothing overdue"}
        />
        <QuickStat
          icon={<GraduationCap size={17} />}
          tone="danger"
          label="Upcoming exams"
          value={`${exams.length}`}
          detail={
            upcomingExams[0]
              ? countdownLabel(upcomingExams[0].examDate)
              : "No exams scheduled"
          }
        />
        <QuickStat
          icon={<Clock3 size={17} />}
          tone="support"
          label="Study time"
          value={formatMinutes(weeklyProgress?.studyMinutes ?? 0)}
          detail={`Across ${studySessions.length} recent sessions`}
        />
      </motion.div>

      <div className="grid gap-10 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-10">
          <DashboardSection
            title="Today's schedule"
            icon={<CalendarDays size={16} />}
            tone="primary"
          >
            <Card className="divide-y divide-(--border) p-0 bg-(--surface) border border-(--border)">
              {todaySchedule.length > 0 ? (
                todaySchedule.map(([id, title, detail, type]) => (
                  <div
                    key={id}
                    className="flex items-center justify-between gap-4 px-5 py-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-(--foreground)">
                        {title}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-(--muted)">
                        <span className="font-medium">
                          Due Date:{" "}
                          <span className="text-red-600">
                            {formatDashboardDate(dashboard?.date ?? "")}
                          </span>
                        </span>
                        {detail && (
                          <>
                            <span>·</span>
                            <span>{detail}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Badge
                      tone={
                        type === "task"
                          ? "amber"
                          : type === "class"
                            ? "blue"
                            : "neutral"
                      }
                    >
                      {type}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="px-5 py-8 text-center text-sm text-(--muted)">
                  Nothing scheduled for today.
                </p>
              )}
            </Card>
          </DashboardSection>

          <DashboardSection
            title="Tasks needing attention"
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
            <TaskPanel
              tasks={tasks}
              overdueTasks={overdueTasks}
            />
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
            <Card className="divide-y divide-(--border) p-0 bg-(--surface) border border-(--border) shadow-xs">
              {studySessions.slice(0, 3).map((session, index) => (
                <div
                  key={session.id || `study-session-${index}`}
                  className="flex items-center gap-4 px-5 py-4"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--support-soft) text-(--support)">
                    <BookOpen size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-(--foreground)">
                      {session.title}
                    </p>
                    <p className="mt-1 text-xs text-(--muted)">
                      {session.date}
                    </p>
                  </div>
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
              {upcomingExams.map((exam, index) => {
                // Ensure location handles empty strings or undefined gracefully
                const examLocation =
                  exam.location && exam.location.trim() !== ""
                    ? exam.location
                    : "Location TBA";

                return (
                  <Card
                    key={exam.id || `exam-${index}`}
                    className="relative overflow-hidden p-4 pl-5 bg-(--surface) border border-(--border) shadow-xs"
                  >
                    <span
                      className={`absolute inset-y-0 left-0 w-1.5 ${
                        index === 0 ? "bg-(--danger)" : "bg-(--support)"
                      }`}
                    />
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="mt-1 text-sm font-bold text-(--foreground)">
                          {exam.title}
                        </p>
                      </div>
                      <Badge tone={index === 0 ? "red" : "amber"}>
                        {countdownLabel(exam.examDate)}
                      </Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-(--muted)">
                      <span className="flex items-center gap-1">
                        <CalendarDays size={13} />
                        Due {formatDashboardDate(exam.examDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={13} />
                        {examLocation}
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </DashboardSection>

          <DashboardSection
            title="Study progress"
            icon={<Clock3 size={16} />}
            tone="support"
          >
            <Card className="p-5 bg-(--surface) border border-(--border) shadow-xs">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-extrabold tracking-[-0.03em] text-(--foreground)">
                    {formatMinutes(weeklyProgress?.studyMinutes ?? 0)}
                  </p>
                  <p className="mt-1 text-xs text-(--muted)">
                    Focused study this week
                  </p>
                </div>
                <span className="rounded-full bg-(--support-soft) px-2.5 py-1 text-xs font-bold text-(--support)">
                  {weeklyProgress?.completedTasks ?? 0} completed
                </span>
              </div>
              <div className="mt-5 h-2 rounded-full bg-(--surface-muted)">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,var(--support),var(--primary))]"
                  style={{
                    width: `${Math.min(100, weeklyProgress?.completionRate ?? 0)}%`,
                  }}
                />
              </div>
              <div className="mt-3 flex justify-between text-xs text-(--muted)">
                <span>
                  Goal: {formatMinutes(weeklyProgress?.goalMinutes ?? 0)}
                </span>
                <span className="font-semibold text-(--foreground)">
                  {weeklyProgress?.completionRate ?? 0}% complete
                </span>
              </div>
            </Card>
          </DashboardSection>
        </aside>
      </div>
    </AppShell>
  );
}

function TaskPanel({
  tasks,
  overdueTasks,
}: {
  tasks: Task[];
  dueSoonTasks: Task[];
  overdueTasks: Task[];
}) {
  const visibleTasks = tasks.slice(0, 5);

  return (
    <Card className="overflow-hidden p-0">
      {visibleTasks.length ? (
        <div className="divide-y divide-(--border)">
          {visibleTasks.map((task) => {
            const overdue = overdueTasks.some((item) => item.id === task.id);
            return (
              <div key={task.id} className="flex items-center gap-3 px-5 py-4">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${overdue ? "bg-(--danger-soft) text-(--danger)" : "bg-(--primary-soft) text-(--primary-strong)"}`}
                >
                  {overdue ? <AlertTriangle size={15} /> : <Target size={15} />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-(--foreground)">
                    {task.title}
                  </p>
                  <p className="mt-1 text-xs text-(--muted)">
                    {overdue
                      ? "Overdue"
                      : `Due ${formatDashboardDate(task.dueDate)}`}
                  </p>
                </div>
                <Badge
                  tone={
                    overdue
                      ? "red"
                      : task.priority === "high"
                        ? "amber"
                        : "neutral"
                  }
                >
                  {overdue ? "Overdue" : task.priority}
                </Badge>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="px-5 py-8 text-center text-sm text-(--muted)">
          No tasks need attention.
        </p>
      )}
    </Card>
  );
}

function formatMinutes(minutes: number) {
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

function countdownLabel(value: string) {
  const days = Math.ceil((new Date(value).getTime() - Date.now()) / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `${days} days`;
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
      className="flex items-start gap-4 bg-(--surface) p-5 shadow-xs"
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-(--shadow-card) ${CHIP[tone]}`}
      >
        {icon}
      </span>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-(--muted)">
          {label}
        </p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-2xl font-extrabold tracking-[-0.03em] text-(--foreground)">
            {value}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-(--muted)">{detail}</p>
      </div>
    </motion.div>
  );
}

function formatDashboardDate(value: string) {
  if (!value) return "Today";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
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
        <h2 className="flex items-center gap-2.5 text-lg font-extrabold tracking-[-0.02em] text-(--foreground)">
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-lg ${CHIP[tone]}`}
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
