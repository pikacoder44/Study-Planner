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
import { useEffect, useState, type ReactNode } from "react";
import { getProfile, logout } from "@/lib/frontend-data";

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
  const [profileName, setProfileName] = useState("Profile");
  const [todayLabel, setTodayLabel] = useState("");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setTodayLabel(
        new Intl.DateTimeFormat("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        }).format(new Date()),
      );
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    void getProfile<{ username?: string }>()
      .then(({ user }) => setProfileName(user.username || "Profile"))
      .catch(() => undefined);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      router.push("/login");
    }
  };

  const navigation = (
    <>
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5"
          onClick={() => setMobileOpen(false)}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500 text-white shadow-lg shadow-violet-950/30">
            <BookOpen size={19} />
          </span>
          <span className="text-base font-extrabold tracking-[-0.03em] text-foreground">
            Study Planner
          </span>
        </Link>
        <button
          className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 lg:hidden"
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
              className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${active ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"}`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-violet-400" />
              )}
              <Icon size={18} strokeWidth={active ? 2.4 : 1.8} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="my-7 border-t border-zinc-800" />
      <Link
        href="/settings"
        onClick={() => setMobileOpen(false)}
        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${pathname.startsWith("/settings") ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"}`}
      >
        <Settings size={18} />
        Settings
      </Link>
      <Link
        href="/teacher"
        onClick={() => setMobileOpen(false)}
        className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
      >
        <GraduationCap size={18} />
        Teacher view
        <ChevronRight size={15} className="ml-auto" />
      </Link>
      <button
        type="button"
        onClick={handleLogout}
        disabled={loggingOut}
        className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200 disabled:opacity-60"
      >
        {loggingOut ? "Signing out..." : "Sign out"}
      </button>

      <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Focus status
        </p>
        <p className="mt-2 text-sm font-bold tracking-[-0.01em] text-zinc-200">
          68% of weekly study goal
        </p>
        <div className="mt-3 h-1.5 rounded-full bg-white/90">
          <div className="h-full w-[68%] rounded-full bg-emerald-400" />
        </div>
      </div>
    </>
  );
  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-68 border-r border-zinc-800/80 bg-zinc-950/80 px-5 py-6 backdrop-blur-md lg:block">
        {navigation}
      </aside>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#0d1b35]/35 backdrop-blur-[2px] lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <aside
            className="h-full w-[min(86vw,320px)] border-r border-zinc-800 bg-zinc-950 px-5 py-6 backdrop-blur-md"
            onClick={(event) => event.stopPropagation()}
          >
            {navigation}
          </aside>
        </div>
      )}
      <div className="lg:pl-68">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-zinc-800/80 bg-zinc-950/80 px-5 backdrop-blur-md sm:px-8">
          <button
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-900 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={21} />
          </button>
          <div className="hidden text-sm font-medium text-zinc-500 lg:block">
            {todayLabel || "Today"}
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button
              className="rounded-lg border border-transparent p-2 text-zinc-500 hover:border-zinc-800 hover:bg-zinc-900"
              aria-label="Notifications"
            >
              <Bell size={19} />
            </button>
            <Link
              href="/user/profile"
              className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 hover:border-zinc-700"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/15 text-xs font-bold text-violet-300">
                {profileName.slice(0, 2).toUpperCase()}
              </span>
              <span className="hidden text-sm font-semibold sm:block">
                {profileName}
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
