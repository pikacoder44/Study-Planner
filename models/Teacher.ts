import User from "../../../models/User";

// Teacher interface extending the User model
export interface ITeacher extends User {
    department: string;
    designation: string;
}

const TeacherSchema: Schema<ITeacher> = new mongoose.Schema({
  department: { type: String, required: true },
  designation: { type: String, required: true },
});

const Teacher =
  mongoose.models.Teacher || mongoose.model<ITeacher>("Teacher", TeacherSchema);

export default Teacher;