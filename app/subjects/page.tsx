"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import SubjectCard from "@/components/SubjectCard";
import { Button, PageHeader } from "@/components/ui";
import { getSubjects } from "@/lib/frontend-data";
import type { Subject } from "@/types";

export default function SubjectsPage() {
  const [items, setItems] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSubjects() {
      try {
        setItems(await getSubjects());
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
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.05 } },
        }}
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
      >
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
      </motion.div>
    </AppShell>
  );
}
