import { UserBooking } from "@/types/booking";

// Helper function to get the primary date/time for display
export const getPrimaryDateTime = (booking: UserBooking) => {
  // Priority: scheduledStart > scheduleAt > actualDaysAndTime > createdAt
  if (booking.scheduledStart) {
    return { start: booking.scheduledStart, end: booking.scheduledEnd };
  }
  if (booking.scheduleAt) {
    return { start: booking.scheduleAt, end: booking.endAt };
  }
  if (booking.actualDaysAndTime && booking.actualDaysAndTime.length > 0) {
    const firstSession = booking.actualDaysAndTime[0];
    // Create a date string from the day and time
    const today = new Date();
    const dayIndex = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ].indexOf(firstSession.dayOfWeek);
    if (dayIndex !== -1) {
      const targetDate = new Date(today);
      targetDate.setDate(
        today.getDate() + ((dayIndex - today.getDay() + 7) % 7)
      );
      const startDateTime = `${targetDate.toISOString().split("T")[0]}T${
        firstSession.startTime
      }:00`;
      const endDateTime = `${targetDate.toISOString().split("T")[0]}T${
        firstSession.endTime
      }:00`;
      return { start: startDateTime, end: endDateTime };
    }
  }
  return { start: booking.createdAt, end: undefined };
};

export const formatTimeRange = (startDate: string, endDate?: string) => {
  const start = new Date(startDate);
  const startTime = start.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (!endDate) return startTime;

  const end = new Date(endDate);
  const endTime = end.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${startTime} - ${endTime}`;
};

export const getDurationText = (minutes?: number) => {
  if (!minutes) return "Duration not specified";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

export const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
