import { isBefore, subYears, startOfDay } from "date-fns";

/**
 * Checks if a given date is more than a specified number of years ago (date-only comparison).
 *
 * @param dateToCheck - The date to evaluate.
 * @param years - The number of years to compare against (default is 15).
 * @returns `true` if the date is more than the specified number of years ago, otherwise `false`. `null` if no valid date is given.
 */
export function isMoreThanYearsAgo(
  dateToCheck: Date | string,
  years: number = 15,
  currentDate: Date = new Date()
): boolean | null {
  if (!dateToCheck) return null;
  const comparisonDate = startOfDay(subYears(currentDate, years)); // 15 years ago, start of the day
  const checkDate = startOfDay(new Date(dateToCheck)); // Start of the day for the input date
  return isBefore(checkDate, comparisonDate);
}

import { toZonedTime } from "date-fns-tz";

export function getCurrentDateInDC() {
  // Current date
  const currentDate = new Date();

  // Washington DC timezone
  const dcTimeZone = "America/New_York";

  // Convert to DC time and return as a Date object
  return toZonedTime(currentDate, dcTimeZone);
}

/**
 * Calculates a person's exact age in full years between their date of birth and a specified date.
 *
 * @param dob - The date of birth of the person
 * @param dateToCheck - The date to calculate the age at (defaults to current date if not provided)
 * @returns The person's age in full years
 * @throws Error if the date to check is before the date of birth
 */
export function calculateAge(
  _dob: string | Date,
  _dateToCheck: string | Date
): number {
  // If no dateToCheck is provided, use the current date
  if (!_dob || !_dateToCheck) return 0;
  const dob = new Date(_dob);
  const checkDate = new Date(_dateToCheck);

  // Validate that dateToCheck is not before date of birth
  if (checkDate < dob) {
    throw new Error("Date to check cannot be before date of birth");
  }

  // Calculate age
  let age = checkDate.getFullYear() - dob.getFullYear();

  // Adjust age if birthday hasn't occurred yet in the check year
  const monthDiff = checkDate.getMonth() - dob.getMonth();
  const dayDiff = checkDate.getDate() - dob.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
}

export function parseMDYDate(dateString: string): Date | null {
  if (!dateString) return null;
  // Regular expression to match the MM/DD/YYYY format
  const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;

  // Check if the input string matches the pattern
  const match = dateString.match(datePattern);
  if (!match) {
    return null; // Return null if the format is invalid
  }

  // Extract month, day, and year from the matched groups
  const [, month, day, year] = match.map(Number);

  // Create a Date object (months are 0-indexed in JavaScript, so subtract 1 from the month)
  const date = new Date(year, month - 1, day);

  // Check if the Date object is valid
  if (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  ) {
    return date; // Return the valid Date object
  } else {
    return null; // Return null if the date is invalid (e.g., February 30)
  }
}
