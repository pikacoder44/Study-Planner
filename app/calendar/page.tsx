import { ChevronLeft, ChevronRight } from "lucide-react";
import AppShell from "@/components/AppShell";
import { Badge, Button, Card, PageHeader } from "@/components/ui";
const days = [
  "Mon 17",
  "Tue 18",
  "Wed 19",
  "Thu 20",
  "Fri 21",
  "Sat 22",
  "Sun 23",
];
const events = [
  { day: 0, time: "10:00", title: "CS603 Lecture", tone: "blue" as const },
  { day: 1, time: "11:00", title: "CS601 Class", tone: "green" as const },
  { day: 2, time: "12:30", title: "Database revision", tone: "amber" as const },
  { day: 3, time: "09:00", title: "Architecture Final", tone: "red" as const },
  { day: 4, time: "16:00", title: "Networking quiz", tone: "neutral" as const },
];
export default function CalendarPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Plan in context"
        title="Calendar"
        description="Classes, deadlines, exams, and study sessions in one quiet view."
        action={
          <div className="flex gap-2">
            <Button variant="secondary" aria-label="Previous month">
              <ChevronLeft size={17} />
            </Button>
            <Button variant="secondary" aria-label="Next month">
              <ChevronRight size={17} />
            </Button>
          </div>
        }
      />
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-4">
          <h2 className="font-bold">August 2026</h2>
          <div className="flex gap-2">
            <Badge tone="blue">Class</Badge>
            <Badge tone="amber">Study</Badge>
            <Badge tone="red">Exam</Badge>
          </div>
        </div>
        <div className="grid min-w-[720px] grid-cols-7">
          {days.map((day) => (
            <div
              key={day}
              className="min-h-36 border-r border-b border-[var(--border)] p-3 last:border-r-0"
            >
              <p className="text-xs font-bold text-[var(--muted)]">{day}</p>
              <div className="mt-4 space-y-2">
                {events
                  .filter((event) => event.day === days.indexOf(day))
                  .map((event) => (
                    <div
                      key={event.title}
                      className="rounded-md bg-[var(--surface-muted)] p-2"
                    >
                      <p className="text-[10px] font-bold text-[var(--accent)]">
                        {event.time}
                      </p>
                      <p className="mt-1 text-xs font-semibold">
                        {event.title}
                      </p>
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
