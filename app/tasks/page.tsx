"use client";

import Link from "next/link";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import AppShell from "@/components/AppShell";
import TaskList from "@/components/TaskList";
import { Button, Card, Input, PageHeader, Select } from "@/components/ui";
import type { Priority, TaskStatus } from "@/types";

type StatusFilter = TaskStatus | "all";
type PriorityFilter = Priority | "all";
type TaskTab = "all" | TaskStatus | "priority";

export default function TasksPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [activeTab, setActiveTab] = useState<TaskTab>("all");

  function updateStatusFilter(value: StatusFilter) {
    setStatusFilter(value);
    if (value === "all") {
      setActiveTab(priorityFilter === "high" ? "priority" : "all");
    } else {
      setActiveTab(value);
    }
  }

  function updatePriorityFilter(value: PriorityFilter) {
    setPriorityFilter(value);
    if (value === "high") {
      setActiveTab("priority");
    } else if (statusFilter !== "all") {
      setActiveTab(statusFilter);
    } else {
      setActiveTab("all");
    }
  }

  function selectTab(tab: TaskTab) {
    setActiveTab(tab);
    if (tab === "all") {
      setStatusFilter("all");
      setPriorityFilter("all");
    } else if (tab === "priority") {
      setStatusFilter("all");
      setPriorityFilter("high");
    } else {
      setStatusFilter(tab);
      setPriorityFilter("all");
    }
  }

  function clearFilters() {
    setQuery("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setActiveTab("all");
  }

  const hasFilters =
    query.trim() !== "" || statusFilter !== "all" || priorityFilter !== "all";

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
            placeholder="Search tasks by title, description, or subject"
            className="border-transparent bg-(--surface-muted) pl-12 focus:border-(--primary) focus:bg-(--surface)"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <Select
            value={statusFilter}
            onChange={(event) =>
              updateStatusFilter(event.target.value as StatusFilter)
            }
            className="border-transparent bg-(--surface-muted) sm:w-40"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </Select>
          <Select
            value={priorityFilter}
            onChange={(event) =>
              updatePriorityFilter(event.target.value as PriorityFilter)
            }
            className="border-transparent bg-(--surface-muted) sm:w-44"
          >
            <option value="all">All priorities</option>
            <option value="high">High priority</option>
            <option value="medium">Medium priority</option>
            <option value="low">Low priority</option>
          </Select>
          <Button
            variant="secondary"
            aria-label={hasFilters ? "Clear filters" : "Filters are clear"}
            onClick={clearFilters}
            disabled={!hasFilters}
          >
            <SlidersHorizontal size={17} />
            <span className="hidden sm:inline">
              {hasFilters ? "Clear filters" : "Filters"}
            </span>
          </Button>
        </div>
      </Card>

      <div className="mb-5 flex gap-1 overflow-x-auto border-b border-zinc-200 dark:border-zinc-800">
        {[
          ["All", "all"],
          ["Pending", "pending"],
          ["Completed", "completed"],
          ["Priority", "priority"],
        ].map(([label, value]) => (
          <button
            key={value}
            type="button"
            onClick={() => selectTab(value as TaskTab)}
            className={`whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium ${
              activeTab === value
                ? "border-violet-400 text-zinc-900 dark:text-zinc-100 font-bold"
                : "border-transparent text-zinc-600 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <TaskList
        query={query}
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
      />
    </AppShell>
  );
}