/**
 * Format ISO date string to readable format
 * @param dateString - ISO date string from backend
 * @returns Formatted date string (e.g., "Apr 21")
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    });
  } catch {
    return 'Unknown date';
  }
};
