import type { Class, Exam, StudySession, Subject, Task, User } from "@/types";

export const currentUser: User = {
  id: "user-1",
  name: "Hashir Khan",
  email: "hashir@example.com",
  role: "student",
};

export const subjects: Subject[] = [
  {
    id: "subject-1",
    name: "Software Architecture",
    code: "CS603",
    description: "Designing reliable, maintainable software systems.",
    color: "#315c72",
    progress: 72,
    nextClass: "Today, 10:00 AM",
  },
  {
    id: "subject-2",
    name: "Database Systems",
    code: "CS601",
    description: "Data modeling, normalization, and query design.",
    color: "#7a6048",
    progress: 58,
    nextClass: "Tomorrow, 11:00 AM",
  },
  {
    id: "subject-3",
    name: "Web Engineering",
    code: "CS605",
    description: "Modern web applications from interface to deployment.",
    color: "#5e6b4f",
    progress: 81,
    nextClass: "Wed, 2:00 PM",
  },
  {
    id: "subject-4",
    name: "Computer Networks",
    code: "CS602",
    description: "Protocols and principles behind connected systems.",
    color: "#8c5b57",
    progress: 46,
    nextClass: "Thu, 9:00 AM",
  },
];

export const tasks: Task[] = [
  {
    id: "task-1",
    title: "Complete architecture assignment",
    description:
      "Document the service boundaries and tradeoffs for the course project.",
    subjectId: "subject-1",
    type: "assignment",
    dueDate: "2026-08-20",
    priority: "high",
    status: "pending",
  },
  {
    id: "task-2",
    title: "Study database normalization",
    description: "Review 1NF through 3NF and complete the practice questions.",
    subjectId: "subject-2",
    type: "revision",
    dueDate: "2026-08-21",
    priority: "medium",
    status: "pending",
  },
  {
    id: "task-3",
    title: "Prepare networking quiz",
    description: "Revise transport layer protocols before Friday's quiz.",
    subjectId: "subject-4",
    type: "homework",
    dueDate: "2026-08-22",
    priority: "medium",
    status: "pending",
  },
  {
    id: "task-4",
    title: "Review previous lecture",
    description: "Make a concise summary of the web performance lecture.",
    subjectId: "subject-3",
    type: "reminder",
    dueDate: "2026-08-18",
    priority: "low",
    status: "completed",
  },
  {
    id: "task-5",
    title: "Read Chapter 4",
    description: "Read the assigned architecture patterns chapter.",
    subjectId: "subject-1",
    type: "homework",
    dueDate: "2026-08-23",
    priority: "low",
    status: "pending",
  },
];

export const exams: Exam[] = [
  {
    id: "exam-1",
    title: "Software Architecture Final",
    subjectId: "subject-1",
    examDate: "2026-08-20",
    startTime: "09:00",
    endTime: "11:00",
    location: "Hall B",
    description:
      "Closed-book final covering architecture styles and quality attributes.",
  },
  {
    id: "exam-2",
    title: "Database Systems Midterm",
    subjectId: "subject-2",
    examDate: "2026-08-28",
    startTime: "13:00",
    endTime: "15:00",
    location: "Room 204",
    description: "Midterm assessment on relational design and SQL.",
  },
  {
    id: "exam-3",
    title: "Networks Quiz",
    subjectId: "subject-4",
    examDate: "2026-08-14",
    startTime: "10:00",
    endTime: "10:45",
    location: "Online",
    description: "Short quiz on transport and network layers.",
  },
];

export const classes: Class[] = [
  {
    id: "class-1",
    subjectId: "subject-1",
    dayOfWeek: "Monday",
    startTime: "10:00",
    endTime: "11:30",
    room: "Lab 3",
  },
  {
    id: "class-2",
    subjectId: "subject-2",
    dayOfWeek: "Tuesday",
    startTime: "11:00",
    endTime: "12:30",
    room: "Room 204",
  },
  {
    id: "class-3",
    subjectId: "subject-3",
    dayOfWeek: "Wednesday",
    startTime: "14:00",
    endTime: "15:30",
    room: "Studio 1",
  },
  {
    id: "class-4",
    subjectId: "subject-4",
    dayOfWeek: "Thursday",
    startTime: "09:00",
    endTime: "10:30",
    room: "Hall A",
  },
];

export const studySessions: StudySession[] = [
  {
    id: "session-1",
    title: "Database revision",
    subjectId: "subject-2",
    date: "2026-08-18",
    startTime: "08:30",
    endTime: "10:30",
    notes: "Focused on normalization exercises.",
  },
  {
    id: "session-2",
    title: "Architecture study session",
    subjectId: "subject-1",
    date: "2026-08-17",
    startTime: "15:00",
    endTime: "17:30",
    notes: "Reviewed architectural patterns.",
  },
  {
    id: "session-3",
    title: "Web engineering practice",
    subjectId: "subject-3",
    date: "2026-08-16",
    startTime: "10:00",
    endTime: "12:00",
    notes: "Built the accessible form states.",
  },
  {
    id: "session-4",
    title: "Network protocols review",
    subjectId: "subject-4",
    date: "2026-08-15",
    startTime: "16:00",
    endTime: "17:15",
    notes: "Revisited TCP congestion control.",
  },
];
