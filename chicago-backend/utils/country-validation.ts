import { countries } from "../data/countries";

/**
 * Validates if a country code exists in the countries list
 */
export const isValidCountryCode = (code: string): boolean => {
  return countries.some((country) => country.code === code);
};

/**
 * Validates an array of country codes
 */
export const areValidCountryCodes = (codes: string[]): boolean => {
  if (!Array.isArray(codes)) return false;
  return codes.every((code) => isValidCountryCode(code));
};

/**
 * Validates country-specific service type data
 * All service types are now country-specific with mandatory fromCountry and toCountry
 */
export const validateCountryFields = (data: {
  isCountrySpecific: boolean;
  fromCountry?: string | null;
  toCountry?: string | null;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // fromCountry and toCountry are now always required
  if (!data.fromCountry) {
    errors.push("fromCountry is required");
  } else if (!isValidCountryCode(data.fromCountry)) {
    errors.push(`Invalid country code: ${data.fromCountry}`);
  }

  if (!data.toCountry) {
    errors.push("toCountry is required");
  } else if (!isValidCountryCode(data.toCountry)) {
    errors.push(`Invalid country code: ${data.toCountry}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
