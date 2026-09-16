import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  userId: mongoose.Types.ObjectId;
  subjectId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  type: "assignment" | "homework" | "revision" | "reminder" | "general";
  dueDate: Date;
  priority: "low" | "medium" | "high";
  status: "pending" | "completed" | "overdue";
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["assignment", "homework", "revision", "reminder", "general"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    dueDate: {
      type: Date,
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "overdue"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

const Task = mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);

export default Task;
