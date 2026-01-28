export function flattenObject(
  obj: Record<string, any>,
  parentKey: string = "",
  result: Record<string, any> = {},
): Record<string, any> {
  for (const [key, value] of Object.entries(obj)) {
    const newKey = parentKey ? `${parentKey}.${key}` : key; // Create dot notation for nested keys
    if (value && typeof value === "object" && !Array.isArray(value)) {
      flattenObject(value, newKey, result); // Recurse for nested objects
    } else {
      result[newKey] = value; // Assign value to the flattened key
    }
  }
  return result;
}
