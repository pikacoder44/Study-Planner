import mongoose, { Schema, Document } from "mongoose";

interface DayOfWeek {
  enum: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
}

export interface IClass extends Document {
  userId: string;
  subjectId: string;
  title: string;
  dayOfWeek: DayOfWeek;
  startTime: Date;
  endTime?: Date;
  room?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const Class: Schema<IClass> = new Schema(
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
    dayOfWeek: {
      type: DayOfWeek,
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
    room: {
      type: String,
      required: false,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Class =
  mongoose.models.Class || mongoose.model<IClass>("Class", ClassSchema);

export default Class;
