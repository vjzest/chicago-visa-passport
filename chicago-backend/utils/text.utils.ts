import { Request } from "express";

export function camelCaseToNormalCase(text: string) {
  if (!text) return "";
  return text
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

export function normalCaseToCamelCase(text: string): string {
  if (!text) return "";
  return text
    .split(" ")
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join("");
}

/**
 * Generates a sanitized string containing only lowercase letters, numbers, and hyphens.
 * All other characters are filtered out.
 * Multiple consecutive non-alphanumeric characters are replaced with a single hyphen.
 * Leading and trailing hyphens are removed.
 *
 * @param input - The input string to be sanitized
 * @returns A sanitized string containing only lowercase letters, numbers, and hyphens
 */
export function generateSlug(input: string): string {
  // Convert to lowercase and replace all non-alphanumeric characters with hyphens
  const hyphenated = input.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  // Remove leading and trailing hyphens
  return hyphenated.replace(/^-+/, "").replace(/-+$/, "");
}

export function getIpFromRequest(req: Request) {
  let forwarded = req.headers["x-forwarded-for"];

  // Ensure forwarded is treated as a string, even if it's an array
  if (Array.isArray(forwarded)) {
    forwarded = forwarded[0];
  }

  let ip = forwarded ? forwarded.split(",")[0].trim() : req.ip;
  if (!ip) return "unknown";

  // Regular expressions to match only the IP address part
  const ipv4Regex = /(\d{1,3}\.){3}\d{1,3}/;
  const ipv6Regex = /([a-f0-9:]+:+)+[a-f0-9]+/i;

  // Handle IPv4-mapped IPv6 addresses (e.g., ::ffff:192.168.1.1)
  if (ip.startsWith("::ffff:")) {
    ip = ip.substring(7);
  }

  // Match the IP against IPv4 and IPv6 patterns
  const ipv4Match = ip.match(ipv4Regex);
  const ipv6Match = ip.match(ipv6Regex);

  if (ipv4Match) {
    return ipv4Match[0];
  } else if (ipv6Match) {
    return ipv6Match[0];
  } else {
    return ip; // Fallback if no match
  }
}

export function removeHtmlTags(input: string): string {
  return input
    .replace(/<[^>]*>/g, "")     // remove HTML tags
    .replace(/&[a-z]+;/gi, "")   // remove HTML entities like &nbsp;
    .replace(/\\[nrt]/g, " ")    // remove escape characters \n, \r, \t
    .replace(/\s+/g, " ")        // collapse multiple spaces/newlines
    .replace(/\"/g, "'")        // replace \" with "
    .trim();                     // remove leading/trailing space
}


/**
 * Takes a credit card number and returns a masked version of it.
 * @example maskCCNumber("4111111111111111") => "411111xxxxxx1111"
 * @param ccNum (string)
 * @returns (string)
 */
export function maskCCNumber(
  ccNum: string,
) {
  return ccNum.replace(
    /(\d{6})(\d+)(\d{4})/,
    "$1xxxxxx$3"
  )
}
