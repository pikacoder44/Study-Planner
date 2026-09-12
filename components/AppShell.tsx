"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Bell,
  BookOpen,
  CalendarDays,
  CheckSquare,
  ChevronRight,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { currentUser } from "@/lib/mock-data";

const mainLinks = [
  ["Dashboard", "/dashboard", LayoutDashboard],
  ["Tasks", "/tasks", CheckSquare],
  ["Subjects", "/subjects", BookOpen],
  ["Exams", "/exams", GraduationCap],
  ["Classes", "/classes", Users],
  ["Study sessions", "/study-sessions", ClipboardList],
  ["Calendar", "/calendar", CalendarDays],
] as const;

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const todayLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/login");
    }
  };

  const navigation = (
    <>
      <div className="mb-7 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5"
          onClick={() => setMobileOpen(false)}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[linear-gradient(145deg,var(--primary),var(--primary-strong))] text-white shadow-[0_10px_18px_rgba(20,89,230,0.35)]">
            <BookOpen size={19} />
          </span>
          <span className="text-base font-extrabold tracking-[-0.03em] text-foreground">
            Smart Study Planner
          </span>
        </Link>
        <button
          className="rounded-xl p-2 text-(--muted) hover:bg-(--surface-muted) lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation"
        >
          <X size={19} />
        </button>
      </div>
      <nav className="space-y-1.5" aria-label="Main navigation">
        {mainLinks.map(([label, href, Icon]) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${active ? "bg-(--primary-soft) text-(--primary-strong) shadow-[inset_0_0_0_1px_rgba(20,89,230,0.16)]" : "text-(--muted) hover:bg-(--surface-muted) hover:text-foreground"}`}
            >
              {active && (
                <span className="absolute left-1.5 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-(--primary)" />
              )}
              <Icon size={18} strokeWidth={active ? 2.4 : 1.8} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="my-7 border-t border-(--border)" />
      <Link
        href="/settings"
        onClick={() => setMobileOpen(false)}
        className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold ${pathname.startsWith("/settings") ? "bg-(--primary-soft) text-(--primary-strong)" : "text-(--muted) hover:bg-(--surface-muted)"}`}
      >
        <Settings size={18} />
        Settings
      </Link>
      <Link
        href="/teacher"
        onClick={() => setMobileOpen(false)}
        className="mt-2 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-(--muted) hover:bg-(--surface-muted)"
      >
        <GraduationCap size={18} />
        Teacher view
        <ChevronRight size={15} className="ml-auto" />
      </Link>
      <button
        type="button"
        onClick={handleLogout}
        disabled={loggingOut}
        className="mt-2 flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold text-(--muted) hover:bg-(--surface-muted) disabled:opacity-60"
      >
        {loggingOut ? "Signing out..." : "Sign out"}
      </button>

      <div className="mt-8 rounded-2xl border border-(--border) bg-[linear-gradient(165deg,#f8fbff,#eaf2ff)] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--muted)">
          Focus status
        </p>
        <p className="mt-2 text-sm font-bold tracking-[-0.01em] text-foreground">
          68% of weekly study goal
        </p>
        <div className="mt-3 h-1.5 rounded-full bg-white/90">
          <div className="h-full w-[68%] rounded-full bg-[linear-gradient(90deg,var(--support),var(--primary))]" />
        </div>
      </div>
    </>
  );
  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-68 border-r border-(--border) bg-[rgba(255,255,255,0.8)] px-5 py-6 backdrop-blur-md lg:block">
        {navigation}
      </aside>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#0d1b35]/35 backdrop-blur-[2px] lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <aside
            className="h-full w-[min(86vw,320px)] border-r border-(--border) bg-[rgba(255,255,255,0.95)] px-5 py-6 backdrop-blur-md"
            onClick={(event) => event.stopPropagation()}
          >
            {navigation}
          </aside>
        </div>
      )}
      <div className="lg:pl-68">
        <header className="sticky top-0 z-20 flex h-19 items-center justify-between border-b border-(--border) bg-[rgba(247,251,255,0.88)] px-5 backdrop-blur-md sm:px-8">
          <button
            className="rounded-xl p-2 text-(--muted) hover:bg-white lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={21} />
          </button>
          <div className="hidden text-sm font-medium text-(--muted) lg:block">
            {todayLabel}
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button
              className="rounded-xl border border-transparent p-2 text-(--muted) hover:border-(--border) hover:bg-white"
              aria-label="Notifications"
            >
              <Bell size={19} />
            </button>
            <Link
              href="/user/profile"
              className="flex items-center gap-2 rounded-xl border border-(--border) bg-white px-2.5 py-1.5 hover:border-(--primary)"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-(--primary-soft) text-xs font-bold text-(--primary-strong)">
                HK
              </span>
              <span className="hidden text-sm font-semibold sm:block">
                {currentUser.name}
              </span>
              <ArrowUpRight
                size={14}
                className="hidden text-(--muted) sm:block"
              />
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-360 px-5 py-8 sm:px-8 sm:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
