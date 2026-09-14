"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import SubjectCard from "@/components/SubjectCard";
import { Button, PageHeader } from "@/components/ui";
import type { Subject } from "@/types";

export default function SubjectsPage() {
  const [items, setItems] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSubjects() {
      try {
        const response = await fetch("/api/subject");
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Unable to load subjects.");
        }
        setItems(
          data.subjects.map(
            (subject: {
              _id: string;
              name: string;
              code: string;
              color: string;
              description?: string;
            }) => ({
              id: subject._id,
              name: subject.name,
              code: subject.code,
              color: subject.color,
              description: subject.description ?? "No description added yet.",
              progress: 0,
            }),
          ),
        );
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load subjects.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadSubjects();
  }, []);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Your courses"
        title="Subjects"
        description="Keep course context close to your tasks, exams, and study time."
        action={
          <Link href="/subjects/new">
            <Button>
              <Plus size={17} />
              Add subject
            </Button>
          </Link>
        }
      />
      {loading && <p className="text-sm text-(--muted)">Loading subjects...</p>}
      {error && (
        <p
          role="alert"
          className="rounded-xl bg-(--danger-soft) p-4 text-sm text-(--danger)"
        >
          {error}
        </p>
      )}
      {!loading && !error && items.length === 0 && (
        <p className="text-sm text-(--muted)">
          No subjects yet. Add your first subject to get started.
        </p>
      )}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((subject) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            onDeleteSuccess={(deletedId) => {
              setItems((currentItems) =>
                currentItems.filter((item) => item.id !== deletedId),
              );
            }}
          />
        ))}
      </div>
    </AppShell>
  );
}
