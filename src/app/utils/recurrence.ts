// src/app/utils/recurrence.ts

import {
    addDays,
    addWeeks,
    addMonths,
    addYears,
    isValid as isValidDateFn,
} from "date-fns";                                        
import { CalendarDate } from "@internationalized/date";    

export type Frequency =
    | "DAILY"
    | "WEEKLY"
    | "MONTHLY"
    | "QUARTERLY"
    | "SEMESTERLY"
    | "YEARLY"
    | "CUSTOM";

export type IntervalUnit = "DAY" | "WEEK" | "MONTH" | "YEAR";

/**
 * Convert HeroUI/Intl DateValue (CalendarDate) → native JS Date
 */
function toJsDate(value: unknown): Date | undefined {
    if (value instanceof Date) {
        return value;
    }
    if (value instanceof CalendarDate) {
        // CalendarDate stores year, month, day
        return new Date(value.year, value.month - 1, value.day);
    }
    return undefined;
}

/**
 * Compute the earliest valid end-date for one full recurrence.
 * Returns a JS Date, which you can feed into toCalendarDate().
 */
export function computeMinEndDate(
    frequency: Frequency,
    nextDueDate: unknown,
    interval?: number,
    intervalUnit?: IntervalUnit
): Date | undefined {
    const jsDate = toJsDate(nextDueDate);
    if (!jsDate || !isValidDateFn(jsDate)) return undefined;

    switch (frequency) {
        case "DAILY": return addDays(jsDate, 1);
        case "WEEKLY": return addWeeks(jsDate, 1);
        case "MONTHLY": return addMonths(jsDate, 1);
        case "QUARTERLY": return addMonths(jsDate, 3);
        case "SEMESTERLY": return addMonths(jsDate, 6);
        case "YEARLY": return addYears(jsDate, 1);
        case "CUSTOM":
            if (!interval || !intervalUnit) return undefined;
            switch (intervalUnit) {
                case "DAY": return addDays(jsDate, interval);
                case "WEEK": return addWeeks(jsDate, interval);
                case "MONTH": return addMonths(jsDate, interval);
                case "YEAR": return addYears(jsDate, interval);
            }
    }
}

/**
 * Convert a JS Date → HeroUI-compatible CalendarDate
 */
export function toCalendarDate(jsDate: Date) {
    return new CalendarDate(
        jsDate.getFullYear(),
        jsDate.getMonth() + 1,
        jsDate.getDate()
    );
}
