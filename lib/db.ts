// lib/db.ts
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Define explicit types for the Mongoose connection cache
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend globalThis without using `any`
const globalWithMongoose = globalThis as typeof globalThis & {
  mongoose?: MongooseCache;
};

const cached: MongooseCache = globalWithMongoose.mongoose || {
  conn: null,
  promise: null,
};

export async function connectDB() {
  try {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
      cached.promise = mongoose
        .connect(MONGODB_URI, {
          bufferCommands: false,
        })
        .then((m) => m);
    }

    cached.conn = await cached.promise;
    globalWithMongoose.mongoose = cached;

    return cached.conn;
  } catch (error) {
    console.error(`Database connection error: ${(error as Error).message}`);
    process.exit(1);
  }
}