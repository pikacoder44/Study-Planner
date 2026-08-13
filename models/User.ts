import mongoose, { Schema, Document } from "mongoose";

// 1. Define an interface for the User Document structure
export interface IUser extends Document {
  username: string;
  password: string;
}

// 2. Define the Mongoose Schema matching the database structure
const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true } // Automatically manages createdAt and updatedAt fields
);

// 3. Compile and export the model
const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
