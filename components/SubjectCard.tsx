import Link from "next/link";
import { ArrowUpRight, MoreHorizontal } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import type { Subject } from "@/types";

export default function SubjectCard({ subject }: { subject: Subject }) {
  return (
    <Card className="rounded-2xl border border-(--border) bg-white/90 p-5 shadow-[0_10px_24px_rgba(20,89,230,0.06)] backdrop-blur-md transition hover:border-(--primary) hover:shadow-[0_14px_28px_rgba(20,89,230,0.12)]">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span
            className="h-3 w-3 rounded-full shadow-[0_0_0_4px_rgba(20,89,230,0.08)]"
            style={{ backgroundColor: subject.color }}
          />
          <div>
            <p className="text-base font-bold tracking-[-0.01em] text-foreground">
              {subject.name}
            </p>
            <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.08em] text-(--muted)">
              {subject.code}
            </p>
          </div>
        </div>
        <button
          className="rounded-xl p-1.5 text-(--muted) transition hover:bg-(--surface-muted) hover:text-foreground"
          aria-label={`More options for ${subject.name}`}
        >
          <MoreHorizontal size={18} />
        </button>
      </div>

      <p className="mt-5 min-h-10 text-sm leading-5 text-(--muted)">
        {subject.description}
      </p>

      <div className="mt-5">
        <div className="mb-2 flex justify-between text-xs font-semibold">
          <span className="text-(--muted)">Progress</span>
          <span className="text-foreground">{subject.progress}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-(--surface-muted)">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${subject.progress}%`,
              backgroundColor: subject.color,
            }}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <Badge tone="blue">{subject.nextClass ?? "No class scheduled"}</Badge>
        <Link
          href={`/subjects/${subject.id}`}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-(--primary-strong) transition hover:bg-(--primary-soft)"
        >
          Details
          <ArrowUpRight size={15} />
        </Link>
      </div>
    </Card>
  );
}