"use client";
import Link from "next/link";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import AppShell from "@/components/AppShell";
import TaskList from "@/components/TaskList";
import { Button, Input, PageHeader, Select } from "@/components/ui";

export default function TasksPage() {
  const [query, setQuery] = useState("");
  return (
    <AppShell>
      <PageHeader
        eyebrow="Keep moving"
        title="Tasks"
        description="A focused list of the work ahead, with enough context to make the next step clear."
        action={
          <Link href="/tasks/new">
            <Button>
              <Plus size={17} />
              New task
            </Button>
          </Link>
        }
      />
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={17}
            className="absolute left-3 top-3 text-[var(--muted)]"
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tasks"
            className="pl-10"
          />
        </div>
        <Select className="sm:w-40">
          <option>All statuses</option>
          <option>Pending</option>
          <option>Completed</option>
        </Select>
        <Select className="sm:w-40">
          <option>All priorities</option>
          <option>High priority</option>
          <option>Medium priority</option>
        </Select>
        <Button variant="secondary" aria-label="More filters">
          <SlidersHorizontal size={17} />
          <span className="hidden sm:inline">Filters</span>
        </Button>
      </div>
      <TaskList />
      {query && (
        <p className="mt-3 text-xs text-[var(--muted)]">
          Search is ready to connect to the data layer. Current mock list shows
          all tasks.
        </p>
      )}
    </AppShell>
  );
}
