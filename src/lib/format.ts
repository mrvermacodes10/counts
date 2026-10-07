export const TIME_ZONE = "Asia/Kolkata";

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE,
  day: "numeric",
  month: "short",
  year: "numeric",
});

const timeFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

/** 7 Oct 2026 */
export function formatDate(d: Date): string {
  return dateFormat.format(d).replace("Sept", "Sep");
}

/** 8:42 PM */
export function formatTime(d: Date): string {
  return timeFormat.format(d);
}

/** 58 → "58", 1200 → "1,200" (Indian grouping). */
export function formatNumber(n: number): string {
  return n.toLocaleString("en-IN");
}
