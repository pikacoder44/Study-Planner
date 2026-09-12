import mongoose, { Schema, Document } from "mongoose";

export interface IExam extends Document {
  userId: string;
  subjectId: string;
  title: string;
  examDate: Date;
  startTime: Date;
  endTime?: Date;
  location?: string;
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
    subjectId: {
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
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: false,
    },
    location: {
      type: String,
      required: false,
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
