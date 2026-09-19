import mongoose, { Schema, Document, Model } from "mongoose";

export interface IExam extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  subjectName: string;
  subjectId?: mongoose.Types.ObjectId;
  title: string;
  examDate: Date;
  startTime?: string;
  endTime?: string;
  location?: string;
  description?: string;
  status: "upcoming" | "completed" | "cancelled";
  priority: "low" | "medium" | "high";
  createdAt: Date;
  updatedAt: Date;
}

const ExamSchema = new Schema<IExam>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    subjectName: { type: String, required: true, trim: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: false },
    title: { type: String, required: true, trim: true },
    examDate: { type: Date, required: true },
    startTime: { type: String, default: "" },
    endTime: { type: String, default: "" },
    location: { type: String, default: "" },
    description: { type: String, default: "" },
    status: { type: String, enum: ["upcoming", "completed", "cancelled"], default: "upcoming" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  },
  { timestamps: true }
);

const Exam: Model<IExam> = mongoose.models.Exam || mongoose.model<IExam>("Exam", ExamSchema);
export default Exam;