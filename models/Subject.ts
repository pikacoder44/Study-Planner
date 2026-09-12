import mongoose, { Schema, Document } from "mongoose";

export interface ISubject extends Document {
  userId: string;
  name: string;
  code: string;
  color: string;
  description?: string;
}

const SubjectSchema = new Schema({
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
});

const Subject =
  mongoose.models.Subject || mongoose.model<ISubject>("Subject", SubjectSchema);

export default Subject;
