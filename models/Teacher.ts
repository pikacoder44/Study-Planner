import User from "../../../models/User";
import mongoose, { Schema } from "mongoose";
// Teacher interface extending the User model
export interface ITeacher extends User {
    department: string;
    designation: string;
}

const TeacherSchema: Schema<ITeacher> = new Schema({
  department: { type: String, required: true },
  designation: { type: String, required: true },
});

const Teacher =
  mongoose.models.Teacher || User.discriminator<ITeacher>("Teacher", TeacherSchema);

export default Teacher;