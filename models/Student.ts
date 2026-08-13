import { Schema } from "inspector/promises";
import User from "../../../models/User";

// Student interface extending the User model
export interface IStudent extends User {
  department: string;
  currentSemester: number;
}

// Schema
const StudentSchema: Schema<IStudent> = new mongoose.Schema({
  department: { type: String, required: true },
  currentSemester: { type: Number, required: true },
});

const Student =
  mongoose.models.Student || mongoose.model<IStudent>("Student", StudentSchema);

export default Student;
