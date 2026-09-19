import mongoose, { Document, Schema } from "mongoose";

export interface ICalendarEvent extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  description?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CalendarEventSchema = new Schema<ICalendarEvent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    startTime: { type: String, match: /^\d{2}:\d{2}$/ },
    endTime: { type: String, match: /^\d{2}:\d{2}$/ },
    description: { type: String, default: "" },
    color: { type: String },
  },
  { timestamps: true },
);

const CalendarEvent =
  mongoose.models.CalendarEvent ||
  mongoose.model<ICalendarEvent>("CalendarEvent", CalendarEventSchema);

export default CalendarEvent;
