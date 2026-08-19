import Link from "next/link";
import { Plus } from "lucide-react";
import AppShell from "@/components/AppShell";
import SubjectCard from "@/components/SubjectCard";
import { Button, PageHeader } from "@/components/ui";
import { subjects } from "@/lib/mock-data";

export default function SubjectsPage() { return <AppShell><PageHeader eyebrow="Your courses" title="Subjects" description="Keep course context close to your tasks, exams, and study time." action={<Link href="/subjects/new"><Button><Plus size={17} />Add subject</Button></Link>} /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{subjects.map((subject) => <SubjectCard key={subject.id} subject={subject} />)}</div></AppShell>; }
