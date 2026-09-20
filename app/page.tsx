import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  Clock3,
  CalendarDays,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-5 py-6 sm:px-10">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-base font-bold"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-white dark:text-white">
            <BookOpen size={19} />
          </span>
          Study Planner
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-md px-3 py-2 text-sm font-semibold text-muted hover:bg-white"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg--accent-strong dark:text-white"
          >
            Create account
          </Link>
        </div>
      </nav>
      <section className="mx-auto grid max-w-6xl items-center gap-14 pb-20 pt-20 lg:grid-cols-[0.9fr_1.1fr] lg:pt-28">
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-accent">
            A clearer academic week
          </p>
          <h1 className="max-w-xl text-5xl font-bold leading-[1.08] tracking-tighter text-ink sm:text-6xl">
            Make room for the work that matters.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-muted">
            Plan tasks, classes, exams, and focused study time in one calm
            workspace built for students.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-accent-strong dark:text-white"
            >
              Start planning
              <ArrowRight size={17} />
            </Link>
            <Link
              href="/dashboard"
              className="rounded-md border border-border bg-white px-5 py-3 text-sm font-semibold text-ink hover:bg-surface-muted"
            >
              View demo
            </Link>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-white p-4 shadow-[0_12px_35px_rgba(30,42,48,0.07 sm:p-6">
          <div className="flex items-center justify-between border-b border-border pb-5">
            <div>
              <p className="text-xs font-semibold text-muted">
                Wednesday, August 19
              </p>
              <h2 className="mt-1 text-xl font-bold">Good morning, Hashir</h2>
            </div>
            <span className="rounded-full bg-[#eaf1e8] px-3 py-1 text-xs font-semibold text-[#557149]">
              On track
            </span>
          </div>
          <div className="grid gap-3 py-5 sm:grid-cols-3">
            <Metric
              icon={<Check size={16} />}
              label="Pending tasks"
              value="4"
            />
            <Metric
              icon={<CalendarDays size={16} />}
              label="Next exam"
              value="1 day"
            />
            <Metric
              icon={<Clock3 size={16} />}
              label="Study this week"
              value="9h 45m"
            />
          </div>
          <div className="rounded-lg bg-surface-muted p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold">Today&apos;s schedule</p>
              <span className="text-xs text-muted">3 items</span>
            </div>
            {[
              "10:00  CS603 Lecture",
              "12:30  Study session",
              "16:00  Assignment review",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 border-t border-border py-3 text-sm"
              >
                <span className="h-2 w-2 rounded-full bg-accent" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-8 border-t border-border py-12 sm:grid-cols-3">
        <Feature
          icon={<Check size={18} />}
          title="Stay ahead"
          text="Keep deadlines visible and turn completed work into momentum."
        />
        <Feature
          icon={<CalendarDays size={18} />}
          title="See the week"
          text="Bring classes, exams, and study sessions into one view."
        />
        <Feature
          icon={<Clock3 size={18} />}
          title="Study with intent"
          text="Track focused hours without turning planning into another task."
        />
      </section>
    </main>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-white p-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#e8eff1] text-accent">
        {icon}
      </span>
      <p className="mt-3 text-xs text-muted">{label}</p>
      <p className="mt-1 text-lg font-bold">{value}</p>
    </div>
  );
}
function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#e8eff1] text-accent">
        {icon}
      </span>
      <div>
        <h2 className="text-sm font-bold">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-muted">{text}</p>
      </div>
    </div>
  );
}
