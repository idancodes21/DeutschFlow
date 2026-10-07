const STREAK_TIME_ZONE = "Africa/Lagos";

function getDateKey(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: STREAK_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function getDayNumber(dateKey: string): number {
  const year = Number(dateKey.slice(0, 4));
  const month = Number(dateKey.slice(5, 7));
  const day = Number(dateKey.slice(8, 10));

  return Date.UTC(year, month - 1, day);
}

function getCalendarDayDifference(from: Date, to: Date): number {
  const fromKey = getDateKey(from);
  const toKey = getDateKey(to);

  return (getDayNumber(toKey) - getDayNumber(fromKey)) / (1000 * 60 * 60 * 24);
}

export function calculateStreak(
  currentStreak: number,
  lastActivityAt: Date | null,
  now: Date,
): number {
  if (!lastActivityAt) {
    return 1;
  }

  const difference = getCalendarDayDifference(lastActivityAt, now);

  // User has already learned today.
  if (difference === 0) {
    return Math.max(currentStreak, 1);
  }

  // User learned yesterday.
  if (difference === 1) {
    return currentStreak + 1;
  }

  // User missed one or more days.
  return 1;
}
