import mongoose, { Schema, Document } from "mongoose";

export interface IStudySession extends Document {
  userId: string;
  subjectId: string;
  title: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const StudySessionSchema: Schema<IStudySession> = new Schema(
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
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

const StudySession =
  mongoose.models.StudySession ||
  mongoose.model<IStudySession>("StudySession", StudySessionSchema);

export default StudySession;
