export type UserRole = "student" | "teacher";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  description: string;
  color: string;
  progress: number;
  nextClass?: string;
}

export type TaskType = "assignment" | "homework" | "revision" | "reminder" | "general";
export type Priority = "low" | "medium" | "high";
export type TaskStatus = "pending" | "completed";

export interface Task {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  type: TaskType;
  dueDate: string;
  priority: Priority;
  status: TaskStatus;
}

export interface Exam {
  id: string;
  title: string;
  subjectId: string;
  examDate: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
}

export type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";

export interface Class {
  id: string;
  subjectId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  room: string;
}

export interface StudySession {
  id: string;
  title: string;
  subjectId: string;
  date: string;
  startTime: string;
  endTime: string;
  notes: string;
}

export type CalendarEventType = "class" | "task" | "exam" | "study";

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: CalendarEventType;
  time?: string;
  subjectId?: string;
}
