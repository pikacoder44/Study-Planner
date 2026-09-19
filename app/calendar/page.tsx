"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import { Badge, Button, Card, PageHeader } from "@/components/ui";
import { getCalendarRange } from "@/lib/frontend-data";
import type { CalendarEvent } from "@/types";

// Dynamic style mapping: Soft idle state -> Solid, high-contrast filled state on hover
function getEventStyle(type: string) {
  const normalizedType = type?.toLowerCase() || "";

  switch (normalizedType) {
    case "class":
      return "bg-blue-500/15 border-blue-500/30 text-blue-300 hover:bg-blue-600 hover:text-white hover:border-blue-500 shadow-sm";
    case "study":
    case "study_session":
      return "bg-amber-500/15 border-amber-500/30 text-amber-300 hover:bg-amber-500 hover:text-zinc-950 hover:border-amber-400 shadow-sm";
    case "exam":
      return "bg-rose-500/15 border-rose-500/30 text-rose-300 hover:bg-rose-600 hover:text-white hover:border-rose-500 shadow-sm";
    case "task":
      return "bg-emerald-500/15 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500 hover:text-zinc-950 hover:border-emerald-400 shadow-sm";
    default:
      return "bg-purple-500/15 border-purple-500/30 text-purple-300 hover:bg-purple-600 hover:text-white hover:border-purple-500 shadow-sm";
  }
}

// Map event types to their dedicated application routes
function getEventRoute(type: string) {
  const normalizedType = type?.toLowerCase() || "";

  switch (normalizedType) {
    case "class":
      return "/classes";
    case "study":
    case "study_session":
      return "/study-sessions";
    case "exam":
      return "/exams";
    case "task":
      return "/tasks";
    default:
      return "/calendar";
  }
}

export default function CalendarPage() {
  const router = useRouter();
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
            <motion.div whileTap={{ scale: 0.96 }}>
              <Button
                variant="secondary"
                aria-label="Previous month"
                onClick={() => setMonth(new Date(year, monthIndex - 1, 1))}
              >
                <ChevronLeft size={17} />
              </Button>
            </motion.div>
            <motion.div whileTap={{ scale: 0.96 }}>
              <Button
                variant="secondary"
                aria-label="Next month"
                onClick={() => setMonth(new Date(year, monthIndex + 1, 1))}
              >
                <ChevronRight size={17} />
              </Button>
            </motion.div>
          </div>
        }
      />
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 px-4 py-4">
          <h2 className="font-bold text-zinc-100">
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
          <p className="p-4 text-sm text-zinc-400">Loading calendar...</p>
        )}
        {error && (
          <p role="alert" className="p-4 text-sm text-rose-400">
            {error}
          </p>
        )}
        {!loading && !error && events.length === 0 && (
          <p className="p-4 text-sm text-zinc-400">No events in this month.</p>
        )}
        <div className="grid min-w-180 grid-cols-7">
          {Array.from({ length: firstDay }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="min-h-32 border-r border-b border-zinc-800/70 bg-zinc-950/20"
            />
          ))}
          {days.map((day) => {
            const dayEvents = eventsForDay(day);
            return (
              <div
                key={day.toISOString()}
                className="min-h-32 border-r border-b border-zinc-800/70 p-2.5 last:border-r-0"
              >
                <p className="text-xs font-semibold text-zinc-400">
                  {day.getDate()}
                </p>
                <div className="mt-2 space-y-1.5">
                  {dayEvents.map((event, idx) => {
                    const styleClass = getEventStyle(event.type);
                    const route = getEventRoute(event.type);
                    const eventTime =
                      event.time ??
                      ("startTime" in event ? String(event.startTime) : "");

                    return (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        key={
                          (event as { _id?: string; id?: string }).id ||
                          (event as { _id?: string; id?: string })._id ||
                          `${event.title}-${idx}`
                        }
                        onClick={() => router.push(route)}
                        className={`cursor-pointer rounded-md border p-2 transition-all duration-200 ${styleClass}`}
                      >
                        {eventTime && (
                          <p className="text-[10px] font-semibold opacity-90">
                            {eventTime}
                          </p>
                        )}
                        <p className="mt-0.5 text-xs font-semibold leading-tight truncate">
                          {event.title}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </AppShell>
  );
}