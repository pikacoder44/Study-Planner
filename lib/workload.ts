export type WorkloadInput = {
  tasks: Array<{ priority: "low" | "medium" | "high"; dueDate: string; estimatedMinutes?: number }>;
  exams: Array<{ examDate: string }>;
};

export function calculateWorkloadScore({ tasks, exams }: WorkloadInput) {
  let score = 0;
  const now = new Date();

  // 1. Task Priority & Time
  tasks.forEach((task) => {
    const priorityWeight = task.priority === "high" ? 15 : task.priority === "medium" ? 10 : 5;
    const timeWeight = Math.min(20, Math.ceil((task.estimatedMinutes || 30) / 15) * 3); // ~3 pts per 15 mins
    
    // 2. Due-Date Distance (Days left)
    const daysLeft = Math.max(0, Math.ceil((new Date(task.dueDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    const urgencyMultiplier = daysLeft === 0 ? 2.0 : daysLeft === 1 ? 1.5 : daysLeft <= 3 ? 1.2 : 0.8;

    score += (priorityWeight + timeWeight) * urgencyMultiplier;
  });

  // 3. Exam Proximity
  exams.forEach((exam) => {
    const daysToExam = Math.max(0, Math.ceil((new Date(exam.examDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    if (daysToExam === 0) score += 30;
    else if (daysToExam <= 2) score += 20;
    else if (daysToExam <= 7) score += 10;
  });

  // Cap score between 0 and 100
  const finalScore = Math.min(100, Math.round(score));

  // Explanatory breakdown
  let status = "Light";
  if (finalScore >= 75) status = "Heavy";
  else if (finalScore >= 45) status = "Moderate";

  return {
    score: finalScore,
    status,
    explanation: `Calculated from ${tasks.length} active tasks and ${exams.length} upcoming exams based on priority, time estimates, and urgency.`,
  };
}