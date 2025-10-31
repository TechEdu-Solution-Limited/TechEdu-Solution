import { UserBooking } from "@/types/booking";
import type { PriceModel, TierType } from "@/lib/constants/pricing";

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

// Helper function for pricing
// ⬇️ place near your other helpers (top of file)

// Map product.TierType → cart's allowed tier union
export const normalizeTierType = (
  t?: TierType
): "volume" | "graduated" | undefined => {
  if (!t) return undefined;
  if (t === "stairstep") return "graduated";
  if (t === "volume" || t === "graduated") return t;
  return undefined;
};

// Map product.PricingModel → cart's allowed model union
export const normalizeCartModel = (
  m?: PriceModel
): "one_time" | "subscription" | "free" =>
  m === "subscription" ? "subscription" : m === "one_time" ? "one_time" : "free";

type Tier = { upTo: number; unitPrice: number };

/**
 * Returns the per-tier unitPrice for the smallest `upTo` ≥ qty.
 * If qty is greater than all `upTo`, returns the unitPrice of the maximum `upTo`.
 * Strict camel `upTo` only (no `upto`).
 *
 * @param tiersArray - Array of tiers (may be unsorted and/or partial).
 * @param qtyInput   - Quantity (total team members).
 * @returns unitPrice of the hit tier, or the max-tier price if qty is above all caps, or null if no valid tiers exist.
 */
export function getTierUnitPrice(
  tiersArray: ReadonlyArray<Partial<Tier>> | null | undefined,
  qtyInput: number
): number | null {
  const qty = Math.max(0, Math.floor(Number(qtyInput)));
  if (!Number.isFinite(qty) || !tiersArray?.length) return null;

  let bestUpTo: number | null = null; // smallest upTo >= qty
  let bestPrice: number | null = null;

  let maxUpTo: number | null = null; // largest upTo (fallback)
  let maxPrice: number | null = null;

  for (const t of tiersArray) {
    if (!t) continue;

    const cap = Number((t as any).upTo);
    const price = Number((t as any).unitPrice);

    if (!Number.isFinite(cap) || !Number.isFinite(price) || price < 0) {
      continue; // skip invalid rows
    }

    // Track the smallest cap that still covers qty
    if (cap >= qty && (bestUpTo === null || cap < bestUpTo)) {
      bestUpTo = cap;
      bestPrice = price;
    }

    // Track the overall maximum cap (for qty above all caps)
    if (maxUpTo === null || cap > maxUpTo) {
      maxUpTo = cap;
      maxPrice = price;
    }
  }

  if (bestPrice != null) return bestPrice; // we found the smallest cap ≥ qty
  if (maxPrice != null) return maxPrice; // qty above all caps → use max tier
  return null; // no valid tiers
}
