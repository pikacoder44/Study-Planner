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

    const [tasks, exams, sessions, classes, customEvents] = await Promise.all([
      Task.find({ userId }).sort({ dueDate: 1 }),
      Exam.find({
        userId,
        examDate: { $gte: startOfToday },
        status: { $ne: "cancelled" },
      })
        .sort({ examDate: 1 })
        .limit(10),
      StudySession.find({ userId, startTime: { $gte: startOfToday } })
        .sort({ startTime: 1 })
        .limit(10),
      ClassModel.find({
        userId,
        dayOfWeek: dayNames[now.getUTCDay()],
        isActive: true,
      }).sort({ startTime: 1 }),
      CalendarEvent.find({ userId, date: today }).sort({ startTime: 1 }),
    ]);

    const overdueTasks = tasks.filter(
      (task) => task.status !== "completed" && task.dueDate < startOfToday,
    );
    const dueTodayTasks = tasks.filter(
      (task) => task.dueDate >= startOfToday && task.dueDate <= endOfToday,
    );
    const completedTasks = tasks.filter((task) => task.status === "completed");
    const pendingTasks = tasks.filter(
      (task) => task.status !== "completed" && task.dueDate >= startOfToday,
    );

    const todaySchedule = [
      ...classes.map((item) => ({
        type: "class" as const,
        id: item._id,
        title: item.title,
        startTime: formatTimeOnly(item.startTime),
        endTime: item.endTime ? formatTimeOnly(item.endTime) : undefined,
        subjectId: item.subjectId,
        room: item.room,
      })),
      ...dueTodayTasks.map((task) => ({
        type: "task" as const,
        id: task._id,
        title: task.title,
        subjectId: task.subjectId,
        priority: task.priority,
      })),
      ...exams
        .filter((exam) => exam.examDate <= endOfToday)
        .map((exam) => ({
          type: "exam" as const,
          id: exam._id,
          title: exam.title,
          startTime: exam.examDate.toISOString().slice(11, 16),
          subjectId: exam.subjectId,
        })),
      ...sessions
        .filter((session) => session.startTime <= endOfToday)
        .map((session) => ({
          type: "study" as const,
          id: session._id,
          title: session.title,
          startTime: formatTimeOnly(session.startTime),
          endTime: formatTimeOnly(session.endTime),
          subjectId: session.subjectId,
        })),
      ...customEvents.map((event) => ({
        type: "event" as const,
        id: event._id,
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
      upcomingExams: exams,
      upcomingStudySessions: sessions,
      recentStudySessions: await StudySession.find({ userId })
        .sort({ startTime: -1 })
        .limit(5),
      statistics: {
        totalTasks: tasks.length,
        completedTasks: completedTasks.length,
        pendingTasks: pendingTasks.length,
        overdueTasks: overdueTasks.length,
        completionRate: tasks.length
          ? Math.round((completedTasks.length / tasks.length) * 100)
          : 0,
        studyMinutes: sessions.reduce(
          (total, session) => total + session.duration,
          0,
        ),
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
