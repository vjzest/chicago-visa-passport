// Shared types and utilities for handling jurisdiction states with regions

export interface StateEntry {
  state: string;
  region: string | null;
}

/**
 * Normalize a state entry for display
 * @param entry - State entry object
 * @returns Formatted string for display
 */
export function normalizeStateEntryForDisplay(entry: StateEntry): string {
  if (entry.region) {
    return `${entry.state} - ${entry.region}`;
  }
  return entry.state;
}

/**
 * Normalize a state entry for comparison/storage
 * @param entry - State entry object
 * @returns Normalized string with pipe separator
 */
export function normalizeStateEntry(entry: StateEntry): string {
  if (entry.region) {
    return `${entry.state}|${entry.region}`;
  }
  return entry.state;
}
