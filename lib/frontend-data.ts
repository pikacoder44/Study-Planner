import {
  classes,
  exams,
  studySessions,
  subjects,
  tasks,
} from "@/lib/mock-data";
import type { Class, Exam, StudySession, Subject, Task } from "@/types";

// Replace these mock functions with REST calls when the backend is ready.
export async function getTasks(): Promise<Task[]> {
  return tasks;
}
export async function getSubjects(): Promise<Subject[]> {
  return subjects;
}
export async function getExams(): Promise<Exam[]> {
  return exams;
}
export async function getClasses(): Promise<Class[]> {
  return classes;
}
export async function getStudySessions(): Promise<StudySession[]> {
  return studySessions;
}

export async function createTask(task: Omit<Task, "id">): Promise<Task> {
  return { ...task, id: `task-${Date.now()}` };
}
export async function updateTask(
  id: string,
  updates: Partial<Task>,
): Promise<Task> {
  const task = tasks.find((item) => item.id === id);
  if (!task) throw new Error("Task not found");
  return { ...task, ...updates };
}
export async function deleteTask(id: string): Promise<void> {
  void id;
}
