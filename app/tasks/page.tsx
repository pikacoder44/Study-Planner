"use client";
import Link from "next/link";
import { ListChecks, Plus, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import AppShell from "@/components/AppShell";
import TaskList from "@/components/TaskList";
import { Button, Card, Input, PageHeader, Select } from "@/components/ui";

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

      <Card className="mb-8 flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg bg-(--primary-soft) text-(--primary-strong)">
            <Search size={15} />
          </span>
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tasks"
            className="border-transparent bg-(--surface-muted) pl-12 focus:border-(--primary) focus:bg-(--surface)"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <Select className="border-transparent bg-(--surface-muted) sm:w-40">
            <option>All statuses</option>
            <option>Pending</option>
            <option>Completed</option>
          </Select>
          <Select className="border-transparent bg-(--surface-muted) sm:w-44">
            <option>All priorities</option>
            <option>High priority</option>
            <option>Medium priority</option>
          </Select>
          <Button variant="secondary" aria-label="More filters">
            <SlidersHorizontal size={17} />
            <span className="hidden sm:inline">Filters</span>
          </Button>
        </div>
      </Card>

      <div className="mb-5 flex gap-1 overflow-x-auto border-b border-zinc-200 dark:border-zinc-800">
        {["All", "Pending", "Completed", "Priority"].map((tab, index) => (
          <button
            key={tab}
            type="button"
            className={`whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium ${index === 0 ? "border-violet-400 text-zinc-900 dark:text-zinc-100" : "border-transparent text-zinc-600 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-300"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <TaskList />

      {query && (
        <Card className="mt-5 flex items-center gap-3 border-dashed bg-(--surface-muted) p-4">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--primary-soft) text-(--primary-strong)">
            <ListChecks size={15} />
          </span>
          <p className="text-xs text-(--muted)">
            Search is ready to connect to the data layer. Current mock list
            shows all tasks.
          </p>
        </Card>
      )}
    </AppShell>
  );
}
