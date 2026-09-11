import mongoose, { Schema, Document } from "mongoose";

interface TaskType {
  type: "assignment" | "homework" | "revision" | "reminder" | "general";
}
interface TaskStatus {
  status: "pending" | "completed";
}
interface Priority {
  priority: "low" | "medium" | "high";
}

export interface ITask extends Document {
  userId: string;
  title: string;
  description: string;
  subject: string;
  taskType: TaskType;
  dueDate: Date;
  priority: Priority;
  status: TaskStatus;
  createdAt: Date;
  uploadedAt: Date;
}

const TaskSchema: Schema<ITask> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  subjectId: {
    type: Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  type: {
    type: TaskType,
    enum: ["assignment", "exam", "project"],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
    priority: {
    type: Priority,
    enum: ["low", "medium", "high"],
    required: true,
  },
  status: {
    type: TaskStatus,
    enum: ["pending", "completed", "overdue"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const Task = mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);

export default Task;
