import { NextResponse } from "next/server";
import CalendarEvent from "@/models/CalendarEvent";
import ClassModel from "@/models/Class";
import Exam from "@/models/Exam";
import StudySession from "@/models/StudySession";
import Task from "@/models/Task";
import { withAuth } from "@/lib/with-auth";
import { formatTimeOnly, getTodayDateOnly } from "@/lib/api-date";

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const GET = withAuth(async (_request, { userId }) => {
  try {
    const today = getTodayDateOnly();
    const startOfToday = new Date(`${today}T00:00:00.000Z`);
    const endOfToday = new Date(`${today}T23:59:59.999Z`);
    const now = new Date();

    const startOfWeek = new Date(startOfToday);
    const dayOfWeek = startOfWeek.getUTCDay();
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startOfWeek.setUTCDate(startOfWeek.getUTCDate() - daysSinceMonday);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setUTCDate(endOfWeek.getUTCDate() + 7);

    const endOfSoon = new Date(endOfToday);
    endOfSoon.setUTCDate(endOfSoon.getUTCDate() + 7);

    // Using .lean() ensures pure JS objects so all fields (location, startTime, etc.) serialize 100% reliably
    const [tasks, rawExams, sessions, weekSessions, classes, customEvents] =
      await Promise.all([
        Task.find({ userId }).sort({ dueDate: 1 }).lean(),
        Exam.find({
          userId,
          examDate: { $gte: startOfToday },
          status: { $ne: "cancelled" },
        })
          .sort({ examDate: 1 })
          .limit(10)
          .lean(),
        StudySession.find({ userId, startTime: { $gte: startOfToday } })
          .sort({ startTime: 1 })
          .limit(10)
          .lean(),
        StudySession.find({
          userId,
          startTime: { $gte: startOfWeek, $lt: endOfWeek },
        })
          .sort({ startTime: 1 })
          .lean(),
        ClassModel.find({
          userId,
          dayOfWeek: dayNames[now.getUTCDay()],
          isActive: true,
        })
          .sort({ startTime: 1 })
          .lean(),
        CalendarEvent.find({ userId, date: today })
          .sort({ startTime: 1 })
          .lean(),
      ]);

    // Explicitly map exams to guarantee location and time properties pass to the frontend
    const exams = rawExams.map((exam) => ({
      ...exam,
      id: String(exam._id),
      location: exam.location || "",
      startTime: exam.startTime || "",
      endTime: exam.endTime || "",
    }));

    const overdueTasks = tasks.filter(
      (task) =>
        task.status !== "completed" && new Date(task.dueDate) < startOfToday,
    );
    const dueTodayTasks = tasks.filter(
      (task) =>
        new Date(task.dueDate) >= startOfToday &&
        new Date(task.dueDate) <= endOfToday,
    );
    const completedTasks = tasks.filter((task) => task.status === "completed");
    const pendingTasks = tasks.filter(
      (task) =>
        task.status !== "completed" && new Date(task.dueDate) >= startOfToday,
    );
    const activeTasks = tasks.filter((task) => task.status !== "completed");

    const priorityTasks = [...activeTasks]
      .sort((left, right) => {
        const priorityRank = { high: 0, medium: 1, low: 2 };
        return (
          priorityRank[String(left.priority) as keyof typeof priorityRank] -
            priorityRank[String(right.priority) as keyof typeof priorityRank] ||
          new Date(left.dueDate).getTime() - new Date(right.dueDate).getTime()
        );
      })
      .slice(0, 5);

    const dueSoonTasks = activeTasks
      .filter(
        (task) =>
          new Date(task.dueDate) >= startOfToday &&
          new Date(task.dueDate) <= endOfSoon,
      )
      .sort(
        (left, right) =>
          new Date(left.dueDate).getTime() - new Date(right.dueDate).getTime(),
      )
      .slice(0, 5);

    const weeklyTasks = tasks.filter(
      (task) =>
        new Date(task.dueDate) >= startOfWeek &&
        new Date(task.dueDate) < endOfWeek,
    );
    const weeklyCompletedTasks = weeklyTasks.filter(
      (task) => task.status === "completed",
    );

    const todaySchedule = [
      ...classes.map((item) => ({
        type: "class" as const,
        id: String(item._id),
        title: item.title,
        startTime: formatTimeOnly(item.startTime),
        endTime: item.endTime ? formatTimeOnly(item.endTime) : undefined,
        subjectId: item.subjectId,
        room: item.room,
      })),
      ...dueTodayTasks.map((task) => ({
        type: "task" as const,
        id: String(task._id),
        title: task.title,
        startTime: "Due today",
        subjectId: task.subjectId,
        priority: task.priority,
      })),
      ...exams
        .filter((exam) => new Date(exam.examDate) <= endOfToday)
        .map((exam) => ({
          type: "exam" as const,
          id: String(exam._id),
          title: exam.title,
          startTime: exam.startTime || "Upcoming",
          subjectId: exam.subjectId,
          location: exam.location,
        })),
      ...sessions
        .filter((session) => new Date(session.startTime) <= endOfToday)
        .map((session) => ({
          type: "study" as const,
          id: String(session._id),
          title: session.title,
          startTime: formatTimeOnly(session.startTime),
          endTime: formatTimeOnly(session.endTime),
          subjectId: session.subjectId,
        })),
      ...customEvents.map((event) => ({
        type: "event" as const,
        id: String(event._id),
        title: event.title,
        startTime: event.startTime,
        endTime: event.endTime,
      })),
    ].sort((left, right) => {
      const leftStartTime =
        "startTime" in left ? (left.startTime ?? "99:99") : "99:99";
      const rightStartTime =
        "startTime" in right ? (right.startTime ?? "99:99") : "99:99";
      return leftStartTime.localeCompare(rightStartTime);
    });

    return NextResponse.json({
      date: today,
      todaySchedule,
      dueTodayTasks,
      overdueTasks,
      priorityTasks,
      dueSoonTasks,
      upcomingExams: exams,
      upcomingStudySessions: sessions,
      recentStudySessions: sessions.slice(0, 5), // Uses already queried sessions instead of re-fetching from DB
      statistics: {
        totalTasks: tasks.length,
        completedTasks: completedTasks.length,
        pendingTasks: pendingTasks.length,
        overdueTasks: overdueTasks.length,
        completionRate: tasks.length
          ? Math.round((completedTasks.length / tasks.length) * 100)
          : 0,
        studyMinutes: sessions.reduce(
          (total, session) => total + (session.duration || 0),
          0,
        ),
        weeklyProgress: {
          completionRate: weeklyTasks.length
            ? Math.round(
                (weeklyCompletedTasks.length / weeklyTasks.length) * 100,
              )
            : 0,
          completedTasks: weeklyCompletedTasks.length,
          totalTasks: weeklyTasks.length,
          studyMinutes: weekSessions.reduce(
            (total, session) => total + (session.duration || 0),
            0,
          ),
          goalMinutes: 14 * 60,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard." },
      { status: 500 },
    );
  }
});
