import Link from "next/link";
import { BookOpen } from "lucide-react";
import type { ReactNode } from "react";

export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-background px-5 py-6 sm:px-10">
      <header className="mx-auto flex max-w-6xl items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-base font-bold tracking-[-0.02em] text-foreground sm:text-lg"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-(--navy) text-(--amber)">
            <BookOpen size={19} />
          </span>
          Smart Study Planner
        </Link>
        <Link
          href="/"
          className="text-sm font-semibold text-(--muted) hover:text-foreground sm:text-base"
        >
          Back to home
        </Link>
      </header>
      <div className="flex min-h-[calc(100vh-104px)] items-center justify-center py-12">
        {children}
      </div>
    </main>
  );
}
