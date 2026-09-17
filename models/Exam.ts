import mongoose, { Schema, Document, Model } from "mongoose";

export interface IExam extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  subjectName: string;
  subjectId?: mongoose.Types.ObjectId; // Optional: Link to a Subject model if you have one
  title: string;
  examDate: Date;
  description?: string;
  status: "upcoming" | "completed" | "cancelled";
  priority: "low" | "medium" | "high";
  createdAt: Date;
  updatedAt: Date;
}

const ExamSchema = new Schema<IExam>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Speeds up queries like Exam.find({ userId })
    },
    subjectName: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true,
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: false,
    },
    title: {
      type: String,
      required: [true, "Exam title is required"],
      trim: true,
    },
    examDate: {
      type: Date,
      required: [true, "Exam date is required"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["upcoming", "completed", "cancelled"],
      default: "upcoming",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
  },
  {
    timestamps: true,
  },
);

// Prevent re-compilation model errors in Next.js Hot Module Replacement (HMR)
const Exam: Model<IExam> =
  mongoose.models.Exam || mongoose.model<IExam>("Exam", ExamSchema);

export default Exam;