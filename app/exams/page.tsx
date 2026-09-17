import { CalendarDays, MapPin, Plus } from "lucide-react";
import AppShell from "@/components/AppShell";
import { Badge, Button, Card, PageHeader } from "@/components/ui";
import { exams, subjects } from "@/lib/mock-data";
export default function ExamsPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Important dates"
        title="Exams"
        description="Know what is coming, then give revision the time it deserves."
        action={
          <Button>
            <Plus size={17} />
            Add exam
          </Button>
        }
      />
      <div className="grid gap-4 md:grid-cols-2">
        {exams.map((exam, index) => (
          <Card
            key={exam.id}
            className={`p-5 ${index === 2 ? "opacity-70" : ""}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <Badge tone={index === 2 ? "neutral" : "red"}>
                  {index === 2
                    ? "Past exam"
                    : index === 0
                      ? "Tomorrow"
                      : "In 9 days"}
                </Badge>
                <h2 className="mt-4 text-lg font-bold">{exam.title}</h2>
                <p className="mt-1 text-sm font-semibold text-(--accent)">
                  {
                    subjects.find((subject) => subject.id === exam.subjectId)
                      ?.code
                  }
                </p>
              </div>
              <div className="rounded-md bg-[#f6e9e7] px-3 py-2 text-center">
                <p className="text-xs font-bold uppercase text-[#9a514b]">
                  Aug
                </p>
                <p className="text-xl font-bold text-[#9a514b]">
                  {exam.examDate.slice(-2)}
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 border-t border-(--border) pt-4 text-sm text-(--muted) sm:grid-cols-2">
              <span className="flex items-center gap-2">
                <CalendarDays size={16} />
                {exam.startTime} - {exam.endTime}
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={16} />
                {exam.location}
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-(--muted)">
              {exam.description}
            </p>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
