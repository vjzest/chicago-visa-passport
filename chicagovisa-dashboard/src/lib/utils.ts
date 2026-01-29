import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toCamelCase(text: string): string {
  return text
    .split(" ")
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join("");
}

export function toRegularCase(camelCase: string): string {
  return camelCase
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}

export function createRandomId(): string {
  const timestamp = Date.now().toString(36); // Convert timestamp to base 36
  const randomPart = Math.random().toString(36).substr(2, 5); // Get 5 random characters
  return `${timestamp}-${randomPart}`;
}

export function getFormattedDateAndTime(
  _date: string | Date,
  options?: { showYear: boolean }
): {
  formattedDate: string;
  formattedTime: string;
} {
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

  return { formattedDate, formattedTime };
}

export function getFormattedDate(_date: string | Date): string {
  const date = new Date(_date);

  const formattedDate = Intl.DateTimeFormat("en-GB", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "America/New_York",
  }).format(date);

  return formattedDate;
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
 * @description extracts plain text from html string
 * @param htmlString html string to sanitize
 * @param truncate whether to truncate the text to 100 words
 * @returns
 */
export function extractPlainText(
  htmlString: string,
  truncate: number | null = null
) {
  // Create a temporary DOM element to parse the HTML string
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlString;

  // Remove all <h> tags and their content
  const headers = tempDiv.querySelectorAll("h1, h2, h3, h4, h5, h6");
  headers.forEach((header) => header.remove());

  // Extract the plain text from the remaining content
  const plainText = tempDiv.textContent || "";

  // Split the text into words and truncate to 100 words
  const words = plainText.split(/\s+/).filter(Boolean);
  if (!truncate) return words.join(" ");
  const truncatedText = words.slice(0, truncate).join(" ");

  // Add "..." if the text was truncated
  return truncatedText.slice(0, truncate) + "...";
}

export function removeHtmlTags(input: string): string {
  // Regular expression to match HTML tags
  const htmlTagRegex = /<[^>]*>/g;
  // Replace all HTML tags with an empty string
  return input?.replace(htmlTagRegex, "");
}

interface FormatterOptions {
  makeFirstLetterUppercase?: boolean;
  allowNonConsecutiveSpaces?: boolean;
  allowNumbers?: boolean;
  makeLettersAfterSpaceCapital?: boolean;
  allowUppercaseInBetween?: boolean;
  allowSpecialCharacters?: boolean;
}

export function formatName(
  input: string,
  options: FormatterOptions = {}
): string {
  const {
    makeFirstLetterUppercase = true,
    allowNonConsecutiveSpaces = false,
    allowNumbers = false,
    makeLettersAfterSpaceCapital = true,
    allowUppercaseInBetween = false,
    allowSpecialCharacters = false,
  } = options;

  // Remove consecutive spaces and keep only allowed characters
  let formatted = input.replace(/\s+/g, " ");

  if (!allowNumbers) {
    formatted = formatted.replace(/\d/g, "");
  }

  if (allowNonConsecutiveSpaces) {
    const length = formatted.length;
    if (formatted[length - 1] === " " && formatted[length - 2] === " ") {
      formatted = formatted.slice(0, length - 1);
    }
    if (formatted[0] === " ") {
      formatted = formatted.slice(1);
    }
  } else {
    formatted = formatted.replace(" ", "");
  }

  // Keep only allowed characters
  if (allowSpecialCharacters) {
    // This regex allows letters, numbers, spaces, and common special characters
    formatted = formatted.replace(
      /[^a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/g,
      ""
    );
  } else {
    formatted = formatted.replace(/[^a-zA-Z0-9\s]/g, "");
  }

  // Convert to lowercase
  if (!allowUppercaseInBetween) formatted = formatted.toLowerCase();

  // Capitalize first letter if option is true
  if (makeFirstLetterUppercase && formatted.length > 0) {
    formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  // Capitalize letters after spaces if option is true
  if (makeLettersAfterSpaceCapital) {
    formatted = formatted.replace(/\s+[a-z]/g, (match) => match.toUpperCase());
  }

  return formatted;
}
