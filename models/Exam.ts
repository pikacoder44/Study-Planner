import mongoose, { Schema, Document } from "mongoose";

export interface IExam extends Document {
  userId: string;
  subjectId: string;
  title: string;
  examDate: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExamSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subjectName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    examDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

const Exam = mongoose.models.Exam || mongoose.model<IExam>("Exam", ExamSchema);

export default Exam;
