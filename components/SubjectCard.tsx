"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui";
import type { Subject } from "@/types";

interface SubjectCardProps {
  subject: Subject;
  onDeleteSuccess?: (id: string) => void;
}

// Convert Tailwind class names (e.g., "bg-blue-500" or "blue-500") to Hex if necessary
function parseColor(colorStr?: string): string {
  if (!colorStr) return "#3b82f6";
  if (
    colorStr.startsWith("#") ||
    colorStr.startsWith("rgb") ||
    colorStr.startsWith("hsl")
  ) {
    return colorStr;
  }

  const colorMap: Record<string, string> = {
    red: "#ef4444",
    blue: "#3b82f6",
    green: "#22c55e",
    amber: "#f59e0b",
    yellow: "#eab308",
    purple: "#a855f7",
    pink: "#ec4899",
    indigo: "#6366f1",
    orange: "#f97316",
    teal: "#14b8a6",
    emerald: "#10b981",
    cyan: "#06b6d4",
    sky: "#0ea5e9",
  };

  const key = colorStr.replace(/^(bg-|text-)/, "").split("-")[0];
  return colorMap[key] || "#3b82f6";
}

export default function SubjectCard({
  subject,
  onDeleteSuccess,
}: SubjectCardProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const subjectId = (subject as { _id?: string })._id || subject.id;
  const accentColor = parseColor(subject.color);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEdit = () => {
    setIsOpen(false);
    router.push(`/subjects/update/${subjectId}`);
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${subject.name}"?`)) return;

    setIsDeleting(true);
    setIsOpen(false);

    try {
      const response = await fetch(`/api/subject/${subjectId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        if (onDeleteSuccess) {
          onDeleteSuccess(subjectId);
        } else {
          router.refresh();
        }
      } else {
        const data = await response.json();
        alert(data.error || data.message || "Failed to delete subject");
      }
    } catch (error) {
      console.error("Error deleting subject:", error);
      alert("An error occurred while deleting the subject");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: `color-mix(in srgb, ${accentColor} 10%, white)`,
        borderColor: `color-mix(in srgb, ${accentColor} 35%, transparent)`,
      }}
      className={`rounded-2xl border p-5 shadow-[0_10px_24px_rgba(20,89,230,0.06)] backdrop-blur-md transition hover:shadow-[0_14px_28px_rgba(20,89,230,0.12)] ${
        isDeleting ? "pointer-events-none opacity-50" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-base font-bold tracking-[-0.01em] text-foreground">
              {subject.name}
            </p>
            <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.08em] text-(--muted)">
              {subject.code}
            </p>
          </div>
        </div>

        {/* Dropdown Action Menu */}
        <div className="relative inline-block text-left" ref={menuRef}>
          <button
            type="button"
            disabled={isDeleting}
            onClick={() => setIsOpen((prev) => !prev)}
            className="rounded-xl p-1.5 text-(--muted) transition hover:bg-black/5 hover:text-foreground disabled:opacity-50"
            aria-label={`More options for ${subject.name}`}
          >
            <MoreHorizontal size={18} />
          </button>

          {isOpen && (
            <div className="absolute right-0 z-20 mt-1 w-36 origin-top-right rounded-xl border border-(--border) bg-white p-1 shadow-lg backdrop-blur-md">
              <button
                type="button"
                onClick={handleEdit}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-(--surface-muted)"
              >
                <Pencil size={14} />
                Edit
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="mt-5 min-h-10 text-sm leading-5 text-(--muted)">
        {subject.description}
      </p>

      <div className="mt-5">
        <div className="mb-2 flex justify-between text-xs font-semibold">
          <span className="text-(--muted)]">Progress</span>
          <span className="text-foreground">{subject.progress}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-black/10">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${subject.progress}%`,
              backgroundColor: accentColor,
            }}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <Badge tone="blue">{subject.nextClass ?? "No class scheduled"}</Badge>
        <Link
          href={`/subjects/${subjectId}`}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-(--primary-strong) transition hover:bg-black/5"
        >
          Details
          <ArrowUpRight size={15} />
        </Link>
      </div>
    </div>
  );
}
