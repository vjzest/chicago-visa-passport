export function areObjectsEqual(
  obj1: any,
  obj2: any,
  visited = new WeakMap()
): boolean {
  // Handle case where both are exactly the same (reference equality or primitive)
  if (obj1 === obj2) {
    return true;
  }

  // Handle null/undefined cases
  if (obj1 == null || obj2 == null) {
    return obj1 === obj2;
  }

  // Handle dates - convert both to Date objects first
  const isDate1 = obj1 instanceof Date || !isNaN(Date.parse(String(obj1)));
  const isDate2 = obj2 instanceof Date || !isNaN(Date.parse(String(obj2)));

  if (isDate1 || isDate2) {
    if (!(isDate1 && isDate2)) {
      return false; // one is date, other isn't
    }
    const date1 = obj1 instanceof Date ? obj1 : new Date(obj1);
    const date2 = obj2 instanceof Date ? obj2 : new Date(obj2);
    return date1.toDateString() === date2.toDateString();
  }

  // Handle non-objects
  if (typeof obj1 !== "object" || typeof obj2 !== "object") {
    return obj1 === obj2;
  }

  // Check for circular references
  const visit1 = visited.get(obj1);
  if (visit1) {
    return visit1 === obj2;
  }

  visited.set(obj1, obj2);

  // Handle arrays
  const isArray1 = Array.isArray(obj1);
  const isArray2 = Array.isArray(obj2);

  if (isArray1 || isArray2) {
    if (!(isArray1 && isArray2)) {
      return false; // one is array, other isn't
    }
    if (obj1.length !== obj2.length) {
      return false;
    }
    return obj1.every((item, index) =>
      areObjectsEqual(item, obj2[index], visited)
    );
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  return keys1.every(
    (key) =>
      keys2.includes(key) && areObjectsEqual(obj1[key], obj2[key], visited)
  );
}
