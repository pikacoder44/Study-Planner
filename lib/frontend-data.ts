import type {
  CalendarEvent,
  Class,
  Exam,
  StudySession,
  Subject,
  Task,
} from "@/types";

export type SubjectInput = Omit<Subject, "id" | "progress" | "nextClass">;
export type TaskInput = Omit<Task, "id" | "status">;
export type TaskFilters = Partial<
  Pick<Task, "status" | "subjectId" | "priority">
> & {
  from?: string;
  to?: string;
};

export type Dashboard = {
  date: string;
  todaySchedule: Array<Record<string, unknown>>;
  dueTodayTasks: Task[];
  overdueTasks: Task[];
  priorityTasks: Task[];
  dueSoonTasks: Task[];
  upcomingExams: Exam[];
  upcomingStudySessions: StudySession[];
  recentStudySessions: StudySession[];
  statistics: Record<string, number> & {
    weeklyProgress: {
      completionRate: number;
      completedTasks: number;
      totalTasks: number;
      studyMinutes: number;
      goalMinutes: number;
    };
  };
};

export type Analytics = {
  from: string;
  to: string;
  completionRate: number;
  studyMinutes: number;
  tasksCompleted: number;
  overdueCount: number;
  subjectWorkload: Array<Record<string, unknown>>;
  examPressure: Record<string, unknown>;
  taskTotals: Record<string, number>;
};

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type ApiResponse<T> = T | { error?: string; message?: string };

const invalidationListeners = new Set<(keys: string[]) => void>();

// Subscribe UI components to data invalidation events
export function subscribeToDataInvalidation(
  listener: (keys: string[]) => void,
) {
  invalidationListeners.add(listener);
  return () => invalidationListeners.delete(listener);
}

// Invalidate cached data across subscribers
function invalidate(...keys: string[]) {
  for (const listener of invalidationListeners) listener(keys);
}

// Centralized request wrapper with JSON headers & error parsing
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...options,
    headers: {
      ...(options?.body ? { "Content-Type": "application/json" } : {}),
      ...options?.headers,
    },
    cache: "no-store",
  });
  const data = (await response.json().catch(() => ({}))) as ApiResponse<T>;
  if (!response.ok) {
    const errorBody = data as { error?: string; message?: string };
    const errors = (data as { errors?: string | string[] }).errors;
    const errorMessage = Array.isArray(errors)
      ? errors.join(" ")
      : errors || errorBody.error || errorBody.message;
    throw new ApiError(
      errorMessage || "The request could not be completed.",
      response.status,
    );
  }
  return data as T;
}

// Normalizes MongoDB _id to frontend id property
function withId<T extends { _id?: string; id?: string }>(item: T) {
  return { ...item, id: item.id ?? item._id ?? "" };
}

// Map API payload to Subject interface
function subjectFromApi(subject: Record<string, unknown>): Subject {
  return {
    id: String(subject._id ?? subject.id),
    name: String(subject.name ?? ""),
    code: String(subject.code ?? ""),
    description: String(subject.description ?? ""),
    color: String(subject.color ?? "blue"),
    progress: Number(subject.progress ?? 0),
    ...(subject.nextClass ? { nextClass: String(subject.nextClass) } : {}),
  };
}

// Map API payload to Task interface
function taskFromApi(task: Record<string, unknown>): Task {
  return {
    id: String(task._id ?? task.id),
    title: String(task.title ?? ""),
    description: String(task.description ?? ""),
    subjectId: String(task.subjectId ?? ""),
    type: task.type as Task["type"],
    dueDate: String(task.dueDate ?? ""),
    priority: task.priority as Task["priority"],
    status: (task.status ?? "pending") as Task["status"],
  };
}

// --------------------------- Subject Routes ---------------------------
export async function getSubjects(): Promise<Subject[]> {
  const data = await request<{ subjects: Array<Record<string, unknown>> }>(
    "/api/subject",
  );
  return data.subjects.map(subjectFromApi);
}

export async function getSubject(id: string): Promise<Subject> {
  const data = await request<{ subject: Record<string, unknown> }>(
    `/api/subject/${id}`,
  );
  return subjectFromApi(data.subject);
}

export async function createSubject(input: SubjectInput): Promise<Subject> {
  const data = await request<{ subject: Record<string, unknown> }>(
    "/api/subject",
    { method: "POST", body: JSON.stringify(input) },
  );
  invalidate("subjects", "dashboard", "analytics");
  return subjectFromApi(data.subject);
}

export async function updateSubject(
  id: string,
  updates: Partial<SubjectInput>,
): Promise<Subject> {
  const data = await request<{ subject: Record<string, unknown> }>(
    `/api/subject/${id}`,
    { method: "PUT", body: JSON.stringify(updates) },
  );
  invalidate(
    "subjects",
    "subject",
    "tasks",
    "calendar",
    "dashboard",
    "analytics",
  );
  return subjectFromApi(data.subject);
}

export async function deleteSubject(id: string): Promise<void> {
  await request(`/api/subject/${id}`, { method: "DELETE" });
  invalidate("subjects", "tasks", "calendar", "dashboard", "analytics");
}

// --------------------------- Task Routes ---------------------------

export async function getTasks(filters: TaskFilters = {}): Promise<Task[]> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value) params.set(key, value);
  }
  const query = params.toString();
  const data = await request<{ tasks: Array<Record<string, unknown>> }>(
    `/api/tasks${query ? `?${query}` : ""}`,
  );
  let result = data.tasks.map(taskFromApi);
  if (filters.status)
    result = result.filter((task) => task.status === filters.status);
  if (filters.subjectId)
    result = result.filter((task) => task.subjectId === filters.subjectId);
  if (filters.priority)
    result = result.filter((task) => task.priority === filters.priority);
  return result;
}

export async function createTask(input: TaskInput): Promise<Task> {
  const data = await request<{ task: Record<string, unknown> }>("/api/tasks", {
    method: "POST",
    body: JSON.stringify(input),
  });
  invalidate("tasks", "calendar", "dashboard", "analytics");
  return taskFromApi(data.task);
}

export async function updateTask(
  id: string,
  updates: Partial<TaskInput> & Partial<Pick<Task, "status">>,
): Promise<Task> {
  const data = await request<{ task: Record<string, unknown> }>(
    `/api/tasks/${id}`,
    { method: "PUT", body: JSON.stringify(updates) },
  );
  invalidate("tasks", "task", "calendar", "dashboard", "analytics");
  return taskFromApi(data.task);
}

export async function completeTask(
  id: string,
  completed = true,
): Promise<Task> {
  return updateTask(id, { status: completed ? "completed" : "pending" });
}

export async function deleteTask(id: string): Promise<void> {
  await request(`/api/tasks/${id}`, { method: "DELETE" });
  invalidate("tasks", "calendar", "dashboard", "analytics");
}

// --------------------------- Exam Routes ---------------------------

export async function getExams(): Promise<Exam[]> {
  const data = await request<Array<Record<string, unknown>>>("/api/exams");
  return data.map((exam) => withId(exam) as unknown as Exam);
}

export async function getExam(id: string): Promise<Exam> {
  const data = await request<Record<string, unknown>>(`/api/exams/${id}`);
  return withId(data) as unknown as Exam;
}

export async function createExam(input: Omit<Exam, "id">): Promise<Exam> {
  const data = await request<Record<string, unknown>>("/api/exams", {
    method: "POST",
    body: JSON.stringify(input),
  });
  invalidate("exams", "calendar", "dashboard", "analytics");
  return withId(data) as unknown as Exam;
}

export async function updateExam(
  id: string,
  updates: Partial<Omit<Exam, "id">>,
): Promise<Exam> {
  const data = await request<Record<string, unknown>>(`/api/exams/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
  invalidate("exams", "exam", "calendar", "dashboard", "analytics");
  return withId(data) as unknown as Exam;
}

export async function deleteExam(id: string): Promise<void> {
  await request(`/api/exams/${id}`, { method: "DELETE" });
  invalidate("exams", "calendar", "dashboard", "analytics");
}

// --------------------------- Class Routes ---------------------------

export async function getClasses(): Promise<Class[]> {
  const data = await request<Class[]>("/api/classes");
  return data.map(withId) as Class[];
}

export async function createClass(input: Omit<Class, "id">): Promise<Class> {
  const data = await request<Class>("/api/classes", {
    method: "POST",
    body: JSON.stringify(input),
  });
  invalidate("classes", "calendar", "dashboard");
  return withId(data) as unknown as Class;
}

export async function updateClass(
  id: string,
  updates: Partial<Omit<Class, "id">>,
): Promise<Class> {
  const data = await request<Class>(`/api/classes/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
  invalidate("classes", "calendar", "dashboard");
  return withId(data) as unknown as Class;
}

export async function deleteClass(id: string): Promise<void> {
  await request(`/api/classes/${id}`, { method: "DELETE" });
  invalidate("classes", "calendar", "dashboard");
}

// --------------------------- Study Session Routes ---------------------------

export async function getStudySessions(): Promise<StudySession[]> {
  const data = await request<{ sessions: StudySession[] }>(
    "/api/study-sessions",
  );
  return data.sessions.map(withId) as StudySession[];
}

export async function getStudySession(id: string): Promise<StudySession> {
  const data = await request<{ session: StudySession }>(
    `/api/study-sessions/${id}`,
  );
  return withId(data.session) as StudySession;
}

export async function createStudySession(
  input: Omit<StudySession, "id">,
): Promise<StudySession> {
  const data = await request<{ session: StudySession }>("/api/study-sessions", {
    method: "POST",
    body: JSON.stringify(input),
  });
  invalidate("study-sessions", "dashboard", "analytics");
  return withId(data.session) as StudySession;
}

export async function updateStudySession(
  id: string,
  updates: Partial<Omit<StudySession, "id">>,
): Promise<StudySession> {
  const data = await request<{ session: StudySession }>(
    `/api/study-sessions/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(updates),
    },
  );
  invalidate("study-sessions", "dashboard", "analytics");
  return withId(data.session) as StudySession;
}

export async function deleteStudySession(id: string): Promise<void> {
  await request(`/api/study-sessions/${id}`, { method: "DELETE" });
  invalidate("study-sessions", "dashboard", "analytics");
}

// --------------------------- Calendar Routes ---------------------------

export async function getCalendarRange(
  from: string,
  to: string,
): Promise<{ from: string; to: string; events: CalendarEvent[] }> {
  return request(
    `/api/calendar?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
  );
}

export async function createCalendarEvent(
  input: Omit<CalendarEvent, "id">,
): Promise<CalendarEvent> {
  const data = await request<{ event: CalendarEvent }>("/api/calendar/events", {
    method: "POST",
    body: JSON.stringify(input),
  });
  invalidate("calendar", "dashboard");
  return data.event;
}

export async function updateCalendarEvent(
  id: string,
  updates: Partial<Omit<CalendarEvent, "id">>,
): Promise<CalendarEvent> {
  const data = await request<{ event: CalendarEvent }>(
    `/api/calendar/events/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(updates),
    },
  );
  invalidate("calendar", "dashboard");
  return data.event;
}

export async function deleteCalendarEvent(id: string): Promise<void> {
  await request(`/api/calendar/events/${id}`, { method: "DELETE" });
  invalidate("calendar", "dashboard");
}

// --------------------------- Dashboard ---------------------------

export async function getDashboard(): Promise<Dashboard> {
  const data = await request<Dashboard>("/api/dashboard");
  return {
    ...data,
    dueTodayTasks: data.dueTodayTasks.map((task) =>
      withId(task as Task & { _id?: string }),
    ) as Task[],
    overdueTasks: data.overdueTasks.map((task) =>
      withId(task as Task & { _id?: string }),
    ) as Task[],
    priorityTasks: data.priorityTasks.map((task) =>
      withId(task as Task & { _id?: string }),
    ) as Task[],
    dueSoonTasks: data.dueSoonTasks.map((task) =>
      withId(task as Task & { _id?: string }),
    ) as Task[],
    upcomingExams: data.upcomingExams.map((exam) => {
      const item = withId(exam as Exam & { _id?: string });
      return {
        ...item,
        location: (exam as Record<string, unknown>).location ?? "",
      } as Exam;
    }),
    upcomingStudySessions: data.upcomingStudySessions.map((session) =>
      withId(session as StudySession & { _id?: string }),
    ) as StudySession[],
    recentStudySessions: data.recentStudySessions.map((session) =>
      withId(session as StudySession & { _id?: string }),
    ) as StudySession[],
  };
}


// --------------------------- Auth Routes ---------------------------

export async function login(input: {
  username: string;
  password: string;
}): Promise<void> {
  await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function register(input: {
  username: string;
  password: string;
  confirmPassword: string;
  role: string;
}): Promise<void> {
  await request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function logout(): Promise<void> {
  await request("/api/auth/logout", { method: "POST" });
}

export async function changePassword(input: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  await request("/api/auth/password", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getProfile<T>(): Promise<{ user: T }> {
  return request<{ user: T }>("/api/auth/profile");
}

export async function updateProfile<T>(updates: {
  username: string;
}): Promise<{ user: T }> {
  return request<{ user: T }>("/api/auth/profile", {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}
