import { format, formatDistanceToNow, isToday, isTomorrow } from 'date-fns';

/**
 * Date formatting utilities using date-fns
 */

/**
 * Format a due date timestamp in a human-friendly way
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {string} Formatted date string
 */
export function formatDue(timestamp) {
  if (!timestamp) {
    return '';
  }

  const date = new Date(timestamp);

  if (isToday(date)) {
    return 'Today';
  }

  if (isTomorrow(date)) {
    return 'Tomorrow';
  }

  // If within 7 days, show relative time
  const diffDays = Math.floor((timestamp - Date.now()) / (1000 * 60 * 60 * 24));
  if (diffDays >= 0 && diffDays <= 6) {
    return format(date, 'EEEE'); // Day of week
  }

  // Otherwise show date
  return format(date, 'MMM d, yyyy');
}

/**
 * Format a creation timestamp
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {string} Formatted timestamp (e.g., "2 hours ago")
 */
export function formatStamp(timestamp) {
  if (!timestamp) {
    return '';
  }

  try {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  } catch (error) {
    return format(new Date(timestamp), 'MMM d, yyyy');
  }
}

/**
 * Format a timestamp as a full date
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {string} Formatted date (e.g., "Jan 15, 2026")
 */
export function formatDate(timestamp) {
  if (!timestamp) {
    return '';
  }
  return format(new Date(timestamp), 'MMM d, yyyy');
}

/**
 * Format a timestamp as a date with time
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {string} Formatted date with time (e.g., "Jan 15, 2026 at 3:45 PM")
 */
export function formatDateTime(timestamp) {
  if (!timestamp) {
    return '';
  }
  return format(new Date(timestamp), "MMM d, yyyy 'at' h:mm a");
}
