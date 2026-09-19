import { NextResponse } from "next/server";
import Exam from "@/models/Exam";
import Subject from "@/models/Subject";
import StudySession from "@/models/StudySession";
import Task from "@/models/Task";
import { withAuth } from "@/lib/with-auth";
import { getDateRange, getTodayDateOnly } from "@/lib/api-date";

export const GET = withAuth(async (request, { userId }) => {
  try {
    const range = getDateRange(
      request.nextUrl.searchParams.get("from"),
      request.nextUrl.searchParams.get("to"),
    );
    if (!range)
      return NextResponse.json(
        { error: "from and to must be valid YYYY-MM-DD dates." },
        { status: 400 },
      );

    const [tasks, sessions, exams, subjects] = await Promise.all([
      Task.find({
        userId,
        dueDate: { $gte: range.startDate, $lte: range.endDate },
      }),
      StudySession.find({
        userId,
        startTime: { $lte: range.endDate },
        endTime: { $gte: range.startDate },
      }),
      Exam.find({
        userId,
        examDate: { $gte: range.startDate, $lte: range.endDate },
        status: { $ne: "cancelled" },
      }).sort({ examDate: 1 }),
      Subject.find({ userId }),
    ]);

    const today = getTodayDateOnly();
    const completedTasks = tasks.filter((task) => task.status === "completed");
    const overdueTasks = tasks.filter(
      (task) =>
        task.status !== "completed" &&
        task.dueDate.toISOString().slice(0, 10) < today,
    );
    const subjectNames = new Map(
      subjects.map((subject) => [
        String(subject._id),
        { name: subject.name, code: subject.code },
      ]),
    );
    const subjectWorkload = new Map<string, number>();
    for (const session of sessions) {
      const key = String(session.subjectId);
      subjectWorkload.set(
        key,
        (subjectWorkload.get(key) ?? 0) + session.duration,
      );
    }

    const examPressure = {
      totalExams: exams.length,
      byPriority: exams.reduce<Record<string, number>>((counts, exam) => {
        counts[exam.priority] = (counts[exam.priority] ?? 0) + 1;
        return counts;
      }, {}),
      nextExamDate: exams[0]?.examDate ?? null,
    };

    return NextResponse.json({
      from: range.start,
      to: range.end,
      completionRate: tasks.length
        ? Math.round((completedTasks.length / tasks.length) * 100)
        : 0,
      studyMinutes: sessions.reduce(
        (total, session) => total + session.duration,
        0,
      ),
      tasksCompleted: completedTasks.length,
      overdueCount: overdueTasks.length,
      subjectWorkload: [...subjectWorkload.entries()].map(
        ([subjectId, minutes]) => ({
          subjectId,
          subject: subjectNames.get(subjectId) ?? null,
          minutes,
        }),
      ),
      examPressure,
      taskTotals: {
        total: tasks.length,
        completed: completedTasks.length,
        pending: tasks.length - completedTasks.length - overdueTasks.length,
        overdue: overdueTasks.length,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics overview:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics overview." },
      { status: 500 },
    );
  }
});
