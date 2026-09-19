"use client";

import { MapPin, Plus, Clock, CalendarDays } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { Button, Card, PageHeader } from "@/components/ui";
import { getClasses, getSubjects } from "@/lib/frontend-data";
import type { Class, Subject } from "@/types";

const ALL_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function ClassesPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Default active tab to current day of the week, fallback to "Monday"
  const [selectedDay, setSelectedDay] = useState<string>(() => {
    const todayName = new Date().toLocaleDateString("en-US", {
      weekday: "long",
    });
    return ALL_DAYS.includes(todayName) ? todayName : "Monday";
  });

  const formatTime12Hour = (timeStr?: string) => {
    if (!timeStr) return "";
    const parts = timeStr.split(":");
    if (parts.length < 2) return timeStr;

    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    if (isNaN(hours)) return timeStr;

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${hours}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    Promise.all([getClasses(), getSubjects()])
      .then(([classData, subjectData]) => {
        setClasses(classData);
        setSubjects(subjectData);
      })
      .catch((loadError) => {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load classes.",
        );
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter classes by selected day or show all
  const filteredClasses = useMemo(() => {
    if (selectedDay === "All") return classes;
    return classes.filter(
      (item) => item.dayOfWeek?.toLowerCase() === selectedDay.toLowerCase(),
    );
  }, [classes, selectedDay]);

  return (
    <AppShell>
      <PageHeader
        title="Classes"
        description="Your upcoming lectures and study sessions."
        action={
          <motion.div whileTap={{ scale: 0.96 }}>
            <Button
              onClick={() => router.push("/classes/add")}
              className="gap-2"
            >
              <Plus size={17} />
              Add class
            </Button>
          </motion.div>
        }
      />

      {loading && (
        <div className="flex items-center justify-center p-12">
          <p className="text-sm text-zinc-400">Loading your timetable...</p>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300"
        >
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-6">
          {/* Day Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto border-b border-zinc-800/80 pb-3 no-scrollbar">
            {["All", ...ALL_DAYS].map((day) => {
              const isActive = selectedDay === day;
              const dayClassCount =
                day === "All"
                  ? classes.length
                  : classes.filter(
                      (c) => c.dayOfWeek?.toLowerCase() === day.toLowerCase(),
                    ).length;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`relative flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-zinc-100 text-zinc-950 shadow-sm"
                      : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                  }`}
                >
                  <span>{day}</span>
                  {dayClassCount > 0 && (
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                        isActive
                          ? "bg-zinc-900/10 text-zinc-950"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {dayClassCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Class List Timeline View */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDay}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {filteredClasses.length === 0 ? (
                <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-zinc-800 bg-zinc-900/30">
                  <div className="rounded-full bg-zinc-800/60 p-3 text-zinc-400">
                    <CalendarDays size={22} />
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-zinc-200">
                    No classes scheduled
                  </h3>
                  <p className="mt-1 text-xs text-zinc-400">
                    You have no scheduled lectures for{" "}
                    {selectedDay === "All" ? "any day" : selectedDay}.
                  </p>
                </Card>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredClasses.map((item, index) => {
                    const subject = subjects.find(
                      (subjectItem) =>
                        subjectItem.id === item.subjectId ||
                        (subjectItem as { _id?: string })._id ===
                          item.subjectId,
                    );
                    const color = subject?.color || "#3b82f6"; // Fallback blue accent

                    return (
                      <motion.div
                        key={
                          item.id ||
                          (item as { _id?: string })._id ||
                          `class-${index}`
                        }
                        whileHover={{ y: -2, scale: 1.01 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Card className="relative overflow-hidden border border-zinc-800/80 bg-zinc-900/60 p-4 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900 hover:shadow-lg">
                          {/* Accent bar indicating subject color */}
                          <div
                            className="absolute top-0 left-0 h-full w-1.5"
                            style={{ backgroundColor: color }}
                          />

                          <div className="pl-2">
                            {/* Header: Code & Day Badge */}
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className="inline-block rounded-md px-2 py-0.5 text-xs font-bold"
                                style={{
                                  backgroundColor: `${color}18`,
                                  color: color,
                                  border: `1px solid ${color}33`,
                                }}
                              >
                                {subject?.code || "COURSE"}
                              </span>
                              {selectedDay === "All" && (
                                <span className="text-[11px] font-medium text-zinc-400">
                                  {item.dayOfWeek}
                                </span>
                              )}
                            </div>

                            {/* Title */}
                            <h3 className="mt-2.5 text-sm font-semibold text-zinc-100 truncate">
                              {subject?.name || "Class Session"}
                            </h3>

                            {/* Metadata Rows: Time & Room */}
                            <div className="mt-3 space-y-1.5 text-xs text-zinc-400">
                              <div className="flex items-center gap-2">
                                <Clock
                                  size={13}
                                  className="text-zinc-500 shrink-0"
                                />
                                <span>
                                  {formatTime12Hour(item.startTime)} -{" "}
                                  {formatTime12Hour(item.endTime)}
                                </span>
                              </div>
                              {item.room && (
                                <div className="flex items-center gap-2">
                                  <MapPin
                                    size={13}
                                    className="text-zinc-500 shrink-0"
                                  />
                                  <span>Room: {item.room}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </AppShell>
  );
}
