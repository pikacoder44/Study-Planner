import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  userId: string;
  title: string;
  description: string;
  subjectId: string;
  type: "assignment" | "homework" | "revision" | "reminder" | "general";
  dueDate: Date;
  priority: "low" | "medium" | "high";
  status: "pending" | "completed";
  createdAt: Date;
  uploadedAt: Date;
}

const TaskSchema = new Schema({
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
    type: String,
    enum: ["assignment", "homework", "revision", "reminder", "general"],
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
    type: String,
    enum: ["low", "medium", "high"],
    required: true,
  },
  status: {
    type: String,
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
