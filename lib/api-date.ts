export function isDateOnly(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function isTimeOnly(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{2}:\d{2}$/.test(value)) {
    return false;
  }

  const [hours, minutes] = value.split(":").map(Number);
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
}

export function toDateTime(date: string, time: string) {
  return new Date(`${date}T${time}:00.000Z`);
}

export function formatDateOnly(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;

  if (isNaN(date.getTime())) {
    return "";
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "long" }).toLowerCase();
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

export function formatTimeOnly(value: Date) {
  return value.toISOString().slice(11, 16);
}

export function getDurationMinutes(startTime: Date, endTime: Date) {
  return Math.round((endTime.getTime() - startTime.getTime()) / 60000);
}

export function getTodayDateOnly() {
  return new Date().toISOString().slice(0, 10);
}

export function getDateRange(from: string | null, to: string | null) {
  const start = from ?? getTodayDateOnly();
  const end = to ?? start;
  if (!isDateOnly(start) || !isDateOnly(end) || start > end) {
    return null;
  }

  return {
    start,
    end,
    startDate: new Date(`${start}T00:00:00.000Z`),
    endDate: new Date(`${end}T23:59:59.999Z`),
  };
}
