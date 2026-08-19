import Link from "next/link";
import { ArrowUpRight, MoreHorizontal } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import type { Subject } from "@/types";

export default function SubjectCard({ subject }: { subject: Subject }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: subject.color }}
          />
          <div>
            <p className="text-base font-bold">{subject.name}</p>
            <p className="mt-0.5 text-xs font-semibold text-[var(--muted)]">
              {subject.code}
            </p>
          </div>
        </div>
        <button
          className="rounded-md p-1.5 text-[var(--muted)] hover:bg-[var(--surface-muted)]"
          aria-label={`More options for ${subject.name}`}
        >
          <MoreHorizontal size={18} />
        </button>
      </div>
      <p className="mt-5 min-h-10 text-sm leading-5 text-[var(--muted)]">
        {subject.description}
      </p>
      <div className="mt-5">
        <div className="mb-2 flex justify-between text-xs font-semibold">
          <span className="text-[var(--muted)]">Progress</span>
          <span>{subject.progress}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[#edf0ed]">
          <div
            className="h-full rounded-full"
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
          className="flex items-center gap-1 text-sm font-semibold text-[var(--accent)] hover:underline"
        >
          Details
          <ArrowUpRight size={15} />
        </Link>
      </div>
    </Card>
  );
}
