import mongoose, { Schema, Document } from "mongoose";

export interface ISubject extends Document {
  userId: string;
  name: string;
  code: string;
  color: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema: Schema<ISubject> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    color: {
      type: String,
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

const Subject =
  mongoose.models.Subject || mongoose.model<ISubject>("Subject", SubjectSchema);

export default Subject;
