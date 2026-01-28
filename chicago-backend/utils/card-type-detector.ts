/**
 * Detects the card type based on the card number pattern
 * @param cardNumber - The card number (can be masked or full)
 * @returns The detected card type
 */
export function detectCardType(cardNumber: string): string {
  if (!cardNumber) return "Unknown";

  // Remove any non-digit characters (like spaces, dashes, x's)
  const cleanNumber = cardNumber.replace(/\D/g, "");

  // If the number is masked (contains 'x' or similar), try to extract the first digits
  const firstDigits = cleanNumber.substring(0, 6);

  // Visa: starts with 4
  if (/^4/.test(firstDigits)) {
    return "Visa";
  }

  // Mastercard: starts with 51-55 or 2221-2720
  if (/^5[1-5]/.test(firstDigits) || /^(222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)/.test(firstDigits)) {
    return "Mastercard";
  }

  // American Express: starts with 34 or 37
  if (/^3[47]/.test(firstDigits)) {
    return "American Express";
  }

  // Discover: starts with 6011, 622126-622925, 644-649, or 65
  if (/^(6011|65|64[4-9]|622)/.test(firstDigits)) {
    return "Discover";
  }

  // Diners Club: starts with 36 or 38 or 300-305
  if (/^(36|38|30[0-5])/.test(firstDigits)) {
    return "Diners Club";
  }

  // JCB: starts with 35
  if (/^35/.test(firstDigits)) {
    return "JCB";
  }

  // UnionPay: starts with 62
  if (/^62/.test(firstDigits)) {
    return "UnionPay";
  }

  return "Other";
}
