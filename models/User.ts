import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  role: "student" | "teacher";
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "teacher"],
      default: "student",
    },
  },
  {
    timestamps: true,
  }
);

const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;