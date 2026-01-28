import { toZonedTime } from "date-fns-tz";

export function getCurrentDateInDC() {
  // Current date
  const currentDate = new Date();

  // Washington DC timezone
  const dcTimeZone = "America/New_York";

  // Convert to DC time and return as a Date object
  return toZonedTime(currentDate, dcTimeZone);
}

// Usage
const dcDate = getCurrentDateInDC();
console.log("Current date in Washington DC:", dcDate);

export function getFormattedDateAndTime(
  _date: string | Date,
  options?: { showYear: boolean }
): string {
  const date = new Date(_date);

  const formattedDate = Intl.DateTimeFormat("en-GB", {
    month: "short",
    day: "2-digit",
    ...(options?.showYear ? { year: "numeric" } : {}),
    timeZone: "America/New_York",
  }).format(date);

  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    // second: "2-digit",
    hour12: true,
    timeZone: "America/New_York",
  });

  return formattedDate + " : " + formattedTime;
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

//function to convert js date into YYYY-MM-DD format
export function convertToYMD(date: Date): string {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
