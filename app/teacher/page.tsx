import { Copy, Plus, Share2, Users } from "lucide-react";
import AppShell from "@/components/AppShell";
import { Badge, Button, Card, PageHeader } from "@/components/ui";
export default function TeacherPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Teacher view"
        title="Your timetable"
        description="Create a clear schedule and share it with the students who need it."
        action={
          <Button>
            <Plus size={17} />
            Add timetable entry
          </Button>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Card className="p-5">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
            <h2 className="font-bold">Shared timetable</h2>
            <Badge tone="green">Active</Badge>
          </div>
          <div className="mt-4 divide-y divide-[var(--border)]">
            {[
              ["Monday", "10:00 - 11:30", "Software Architecture", "Room 302"],
              ["Wednesday", "14:00 - 15:30", "Web Engineering", "Studio 1"],
              ["Friday", "09:00 - 10:30", "Database Systems", "Room 204"],
            ].map(([day, time, name, room]) => (
              <div key={day} className="flex flex-wrap items-center gap-4 py-4">
                <div className="w-24">
                  <p className="text-sm font-bold">{day}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">{time}</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{name}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">{room}</p>
                </div>
                <button className="text-sm font-semibold text-[var(--accent)]">
                  Edit
                </button>
              </div>
            ))}
          </div>
        </Card>
        <div className="space-y-4">
          <Card className="p-5">
            <Share2 size={20} className="text-[var(--accent)]" />
            <h2 className="mt-4 font-bold">Share with students</h2>
            <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
              Invite students to view this timetable without giving them editing
              access.
            </p>
            <Button variant="secondary" className="mt-4 w-full">
              <Copy size={16} />
              Copy share link
            </Button>
          </Card>
          <Card className="p-5">
            <Users size={20} className="text-[var(--accent)]" />
            <h2 className="mt-4 font-bold">Shared students</h2>
            <p className="mt-1 text-2xl font-bold">18</p>
            <p className="text-sm text-[var(--muted)]">
              students currently have access
            </p>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
