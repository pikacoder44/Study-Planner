import { NextResponse } from "next/server";
import CalendarEvent from "@/models/CalendarEvent";
import ClassModel from "@/models/Class";
import Exam from "@/models/Exam";
import StudySession from "@/models/StudySession";
import Task from "@/models/Task";
import { withAuth } from "@/lib/with-auth";
import { formatTimeOnly, getDateRange } from "@/lib/api-date";

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const GET = withAuth(async (request, { userId }) => {
  try {
    const range = getDateRange(
      request.nextUrl.searchParams.get("from"),
      request.nextUrl.searchParams.get("to"),
    );
    if (!range) {
      return NextResponse.json(
        { error: "from and to must be valid YYYY-MM-DD dates." },
        { status: 400 },
      );
    }

    const [tasks, exams, sessions, classes, customEvents] = await Promise.all([
      Task.find({
        userId,
        dueDate: { $gte: range.startDate, $lte: range.endDate },
      }).sort({ dueDate: 1 }),
      Exam.find({
        userId,
        examDate: { $gte: range.startDate, $lte: range.endDate },
      }).sort({ examDate: 1 }),
      StudySession.find({
        userId,
        startTime: { $lte: range.endDate },
        endTime: { $gte: range.startDate },
      }).sort({ startTime: 1 }),
      ClassModel.find({ userId, isActive: true }),
      CalendarEvent.find({
        userId,
        date: { $gte: range.start, $lte: range.end },
      }).sort({ date: 1, startTime: 1 }),
    ]);

    const events = [
      ...tasks.map((task) => ({
        id: task._id,
        sourceId: task._id,
        type: "task" as const,
        title: task.title,
        date: task.dueDate.toISOString().slice(0, 10),
        subjectId: task.subjectId,
        status: task.status,
        priority: task.priority,
      })),
      ...exams.map((exam) => ({
        id: exam._id,
        sourceId: exam._id,
        type: "exam" as const,
        title: exam.title,
        date: exam.examDate.toISOString().slice(0, 10),
        subjectId: exam.subjectId,
        startTime: exam.examDate.toISOString().slice(11, 16),
        status: exam.status,
      })),
      ...sessions.map((session) => ({
        id: session._id,
        sourceId: session._id,
        type: "study" as const,
        title: session.title,
        date: session.startTime.toISOString().slice(0, 10),
        subjectId: session.subjectId,
        startTime: formatTimeOnly(session.startTime),
        endTime: formatTimeOnly(session.endTime),
        notes: session.notes ?? "",
      })),
      ...customEvents.map((event) => ({
        id: event._id,
        sourceId: event._id,
        type: "event" as const,
        title: event.title,
        date: event.date,
        startTime: event.startTime,
        endTime: event.endTime,
        description: event.description ?? "",
        color: event.color,
      })),
      ...classes.flatMap((item) => {
        const datedEvents = [];
        for (
          let date = new Date(range.startDate);
          date <= range.endDate;
          date.setUTCDate(date.getUTCDate() + 1)
        ) {
          if (dayNames[date.getUTCDay()] !== item.dayOfWeek) continue;
          const dateOnly = date.toISOString().slice(0, 10);
          datedEvents.push({
            id: `${item._id}-${dateOnly}`,
            sourceId: item._id,
            type: "class" as const,
            title: item.title,
            date: dateOnly,
            subjectId: item.subjectId,
            startTime: formatTimeOnly(item.startTime),
            endTime: item.endTime ? formatTimeOnly(item.endTime) : undefined,
            room: item.room,
          });
        }
        return datedEvents;
      }),
    ].sort((left, right) => {
      const leftStartTime = "startTime" in left ? (left.startTime ?? "") : "";
      const rightStartTime =
        "startTime" in right ? (right.startTime ?? "") : "";
      return `${left.date} ${leftStartTime}`.localeCompare(
        `${right.date} ${rightStartTime}`,
      );
    });

    return NextResponse.json({ from: range.start, to: range.end, events });
  } catch (error) {
    console.error("Error fetching calendar:", error);
    return NextResponse.json(
      { error: "Failed to fetch calendar." },
      { status: 500 },
    );
  }
});
