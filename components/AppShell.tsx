"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigation = (
    <>
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5"
          onClick={() => setMobileOpen(false)}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--navy)] text-[var(--amber)]">
            <BookOpen size={19} />
          </span>
          <span className="text-base font-bold tracking-[-0.02em] text-[var(--ink)]">
            Smart Study Planner
          </span>
        </Link>
        <button
          className="rounded-md p-2 text-[var(--muted)] lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation"
        >
          <X size={19} />
        </button>
      </div>
      <nav className="space-y-1" aria-label="Main navigation">
        {mainLinks.map(([label, href, Icon]) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-md border-l-2 px-3 py-2.5 text-sm font-semibold transition-colors ${active ? "border-[var(--amber)] bg-[var(--amber-soft)] text-[var(--ink)]" : "border-transparent text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--ink)]"}`}
            >
              <Icon size={18} strokeWidth={active ? 2.4 : 1.8} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="my-7 border-t border-[var(--border)]" />
      <Link
        href="/settings"
        onClick={() => setMobileOpen(false)}
        className={`flex items-center gap-3 rounded-md border-l-2 px-3 py-2.5 text-sm font-semibold ${pathname.startsWith("/settings") ? "border-[var(--amber)] bg-[var(--amber-soft)] text-[var(--ink)]" : "border-transparent text-[var(--muted)] hover:bg-[var(--surface-muted)]"}`}
      >
        <Settings size={18} />
        Settings
      </Link>
      <Link
        href="/teacher"
        onClick={() => setMobileOpen(false)}
        className="mt-2 flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-[var(--muted)] hover:bg-[var(--surface-muted)]"
      >
        <GraduationCap size={18} />
        Teacher view
        <ChevronRight size={15} className="ml-auto" />
      </Link>
    </>
  );
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--ink)]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-[var(--border)] bg-white px-5 py-6 lg:block">
        {navigation}
      </aside>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#172033]/25 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <aside
            className="h-full w-[min(84vw,300px)] bg-white px-5 py-6"
            onClick={(event) => event.stopPropagation()}
          >
            {navigation}
          </aside>
        </div>
      )}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-[var(--border)] bg-[rgba(250,250,248,0.94)] px-5 backdrop-blur-sm sm:px-8">
          <button
            className="rounded-md p-2 text-[var(--muted)] hover:bg-white lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={21} />
          </button>
          <div className="hidden text-sm text-[var(--muted)] lg:block">
            Wednesday, August 19, 2026
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button
              className="rounded-md p-2 text-[var(--muted)] hover:bg-white"
              aria-label="Notifications"
            >
              <Bell size={19} />
            </button>
            <div className="flex items-center gap-2 border-l border-[var(--border)] pl-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--amber-soft)] text-xs font-bold text-[var(--ink)]">
                HK
              </span>
              <span className="hidden text-sm font-semibold sm:block">
                {currentUser.name}
              </span>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
