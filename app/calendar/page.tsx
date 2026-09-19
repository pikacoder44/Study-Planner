"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import { Badge, Button, Card, PageHeader } from "@/components/ui";
import { getCalendarRange } from "@/lib/frontend-data";
import type { CalendarEvent } from "@/types";

export default function CalendarPage() {
  const [month, setMonth] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstDay = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
  const days = useMemo(
    () =>
      Array.from(
        { length: daysInMonth },
        (_, index) => new Date(year, monthIndex, index + 1),
      ),
    [daysInMonth, monthIndex, year],
  );

  useEffect(() => {
    const from = `${year}-${String(monthIndex + 1).padStart(2, "0")}-01`;
    const to = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(daysInMonth).padStart(2, "0")}`;
    getCalendarRange(from, to)
      .then((data) => {
        setEvents(data.events);
        setError("");
      })
      .catch((loadError) =>
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load calendar.",
        ),
      )
      .finally(() => setLoading(false));
  }, [daysInMonth, monthIndex, year]);

  const eventsForDay = (date: Date) => {
    const dateOnly = date.toISOString().slice(0, 10);
    return events.filter((event) => event.date === dateOnly);
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Plan in context"
        title="Calendar"
        description="Classes, deadlines, exams, and study sessions in one quiet view."
        action={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              aria-label="Previous month"
              onClick={() => setMonth(new Date(year, monthIndex - 1, 1))}
            >
              <ChevronLeft size={17} />
            </Button>
            <Button
              variant="secondary"
              aria-label="Next month"
              onClick={() => setMonth(new Date(year, monthIndex + 1, 1))}
            >
              <ChevronRight size={17} />
            </Button>
          </div>
        }
      />
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-(--border) px-4 py-4">
          <h2 className="font-bold">
            {month.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <div className="flex gap-2">
            <Badge tone="blue">Class</Badge>
            <Badge tone="amber">Study</Badge>
            <Badge tone="red">Exam</Badge>
          </div>
        </div>
        {loading && (
          <p className="p-4 text-sm text-(--muted)">Loading calendar...</p>
        )}
        {error && (
          <p role="alert" className="p-4 text-sm text-(--danger)">
            {error}
          </p>
        )}
        {!loading && !error && events.length === 0 && (
          <p className="p-4 text-sm text-(--muted)">No events in this month.</p>
        )}
        <div className="grid min-w-180 grid-cols-7">
          {Array.from({ length: firstDay }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="min-h-36 border-r border-b border-(--border)"
            />
          ))}
          {days.map((day) => (
            <div
              key={day.toISOString()}
              className="min-h-36 border-r border-b border-(--border) p-3 last:border-r-0"
            >
              <p className="text-xs font-bold text-(--muted)">
                {day.getDate()}
              </p>
              <div className="mt-4 space-y-2">
                {eventsForDay(day).map((event) => (
                  <div
                    key={event.title}
                    className="rounded-md bg-(--surface-muted) p-2"
                  >
                    <p className="text-[10px] font-bold text-(--accent)">
                      {event.time ??
                        ("startTime" in event ? String(event.startTime) : "")}
                    </p>
                    <p className="mt-1 text-xs font-semibold">{event.title}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}
