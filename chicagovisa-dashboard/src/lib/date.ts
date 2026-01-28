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
  years: number = 15
): boolean | null {
  if (!dateToCheck) return null;
  const comparisonDate = startOfDay(subYears(new Date(), years)); // 15 years ago, start of the day
  const checkDate = startOfDay(new Date(dateToCheck)); // Start of the day for the input date
  return isBefore(checkDate, comparisonDate);
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
