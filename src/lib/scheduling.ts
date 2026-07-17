import type { Locale } from "./content";

export const businessTimeZone = "Europe/Amsterdam";
export const bookingScheduleSettingKey = "booking_schedule_v1";

export type TimeRange = {
  end: string;
  start: string;
};

export type BookingDay = {
  blocked: TimeRange[];
  date: string;
  end: string;
  start: string;
};

export type ServiceSchedule = {
  dates: BookingDay[];
  durationMinutes: number;
  useCustomAvailability: boolean;
};

export type BookingSchedule = {
  defaultEnd: string;
  defaultStart: string;
  enabled: boolean;
  slotIntervalMinutes: number;
  dates: BookingDay[];
  services: Record<string, ServiceSchedule>;
  timeZone: string;
  version: 1;
};

export type BookedAppointment = {
  end: string;
  start: string;
};

export type AppointmentSlot = {
  end: string;
  label: string;
  start: string;
};

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
const localeTags: Record<Locale, string> = {
  en: "en-US",
  es: "es-ES",
  nl: "nl-NL",
  pt: "pt-PT",
};

export function createDefaultBookingSchedule(): BookingSchedule {
  return {
    dates: [],
    defaultEnd: "18:00",
    defaultStart: "09:00",
    enabled: false,
    services: {},
    slotIntervalMinutes: 30,
    timeZone: businessTimeZone,
    version: 1,
  };
}

function validTime(value: unknown, fallback: string) {
  return typeof value === "string" && timePattern.test(value) ? value : fallback;
}

function normaliseRange(value: unknown): TimeRange | null {
  if (!value || typeof value !== "object") return null;
  const range = value as Partial<TimeRange>;
  const start = validTime(range.start, "");
  const end = validTime(range.end, "");
  return start && end && start < end ? { end, start } : null;
}

function normaliseDays(value: unknown, defaultStart: string, defaultEnd: string) {
  if (!Array.isArray(value)) return [];

  const days = value.flatMap((item): BookingDay[] => {
    if (!item || typeof item !== "object") return [];
    const day = item as Partial<BookingDay>;
    if (typeof day.date !== "string" || !datePattern.test(day.date)) return [];
    const start = validTime(day.start, defaultStart);
    const end = validTime(day.end, defaultEnd);
    if (start >= end) return [];

    return [{
      blocked: Array.isArray(day.blocked)
        ? day.blocked.map(normaliseRange).filter((range): range is TimeRange => Boolean(range))
        : [],
      date: day.date,
      end,
      start,
    }];
  });

  return Array.from(new Map(days.map((day) => [day.date, day])).values())
    .sort((left, right) => left.date.localeCompare(right.date));
}

export function normaliseBookingSchedule(value: unknown): BookingSchedule {
  const fallback = createDefaultBookingSchedule();
  if (!value || typeof value !== "object") return fallback;

  const input = value as Partial<BookingSchedule>;
  const defaultStart = validTime(input.defaultStart, fallback.defaultStart);
  const defaultEnd = validTime(input.defaultEnd, fallback.defaultEnd);
  const safeEnd = defaultStart < defaultEnd ? defaultEnd : fallback.defaultEnd;
  const services = Object.entries(input.services || {}).reduce<Record<string, ServiceSchedule>>((result, [productId, service]) => {
    if (!service || typeof service !== "object") return result;
    const item = service as Partial<ServiceSchedule>;
    result[productId] = {
      dates: normaliseDays(item.dates, defaultStart, safeEnd),
      durationMinutes: Math.min(Math.max(Number(item.durationMinutes) || 60, 15), 480),
      useCustomAvailability: Boolean(item.useCustomAvailability),
    };
    return result;
  }, {});

  return {
    dates: normaliseDays(input.dates, defaultStart, safeEnd),
    defaultEnd: safeEnd,
    defaultStart,
    enabled: Boolean(input.enabled),
    services,
    slotIntervalMinutes: [15, 30, 45, 60].includes(Number(input.slotIntervalMinutes))
      ? Number(input.slotIntervalMinutes)
      : fallback.slotIntervalMinutes,
    timeZone: businessTimeZone,
    version: 1,
  };
}

export function parseBookingSchedule(value: unknown) {
  if (typeof value !== "string") return createDefaultBookingSchedule();
  try {
    return normaliseBookingSchedule(JSON.parse(value));
  } catch {
    return createDefaultBookingSchedule();
  }
}

export function safeTimeZone(value?: string) {
  if (!value) return businessTimeZone;
  try {
    new Intl.DateTimeFormat("en", { timeZone: value }).format();
    return value;
  } catch {
    return businessTimeZone;
  }
}

function timeZoneOffset(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
    minute: "2-digit",
    month: "2-digit",
    second: "2-digit",
    timeZone,
    year: "numeric",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const asUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second),
  );
  return asUtc - date.getTime();
}

export function amsterdamDateTimeToUtc(date: string, time: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const localAsUtc = Date.UTC(year, month - 1, day, hour, minute);
  let result = new Date(localAsUtc - timeZoneOffset(new Date(localAsUtc), businessTimeZone));
  result = new Date(localAsUtc - timeZoneOffset(result, businessTimeZone));
  return result;
}

function overlaps(leftStart: Date, leftEnd: Date, rightStart: Date, rightEnd: Date) {
  return leftStart < rightEnd && leftEnd > rightStart;
}

export function getServiceDuration(schedule: BookingSchedule, productId: string) {
  return schedule.services[productId]?.durationMinutes || 60;
}

export function getAppointmentSlots({
  booked = [],
  clientTimeZone,
  locale,
  now = new Date(),
  productId,
  schedule,
}: {
  booked?: BookedAppointment[];
  clientTimeZone?: string;
  locale: Locale;
  now?: Date;
  productId: string;
  schedule: BookingSchedule;
}): AppointmentSlot[] {
  if (!schedule.enabled) return [];

  const service = schedule.services[productId];
  const dates = service?.useCustomAvailability ? service.dates : schedule.dates;
  const durationMinutes = getServiceDuration(schedule, productId);
  const displayTimeZone = safeTimeZone(clientTimeZone);
  const bookedRanges = booked.flatMap((item) => {
    const start = new Date(item.start);
    const end = new Date(item.end);
    return Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) ? [] : [{ end, start }];
  });
  const formatter = new Intl.DateTimeFormat(localeTags[locale], {
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    month: "long",
    timeZone: displayTimeZone,
    timeZoneName: "short",
    weekday: "long",
  });

  return dates.flatMap((day) => {
    const dayStart = amsterdamDateTimeToUtc(day.date, day.start);
    const dayEnd = amsterdamDateTimeToUtc(day.date, day.end);
    const blocked = day.blocked.map((range) => ({
      end: amsterdamDateTimeToUtc(day.date, range.end),
      start: amsterdamDateTimeToUtc(day.date, range.start),
    }));
    const slots: AppointmentSlot[] = [];

    for (
      let start = dayStart;
      start.getTime() + durationMinutes * 60_000 <= dayEnd.getTime();
      start = new Date(start.getTime() + schedule.slotIntervalMinutes * 60_000)
    ) {
      const end = new Date(start.getTime() + durationMinutes * 60_000);
      if (start <= now) continue;
      if (blocked.some((range) => overlaps(start, end, range.start, range.end))) continue;
      if (bookedRanges.some((range) => overlaps(start, end, range.start, range.end))) continue;

      slots.push({
        end: end.toISOString(),
        label: formatter.format(start),
        start: start.toISOString(),
      });
    }

    return slots;
  });
}
