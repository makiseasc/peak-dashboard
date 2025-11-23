/**
 * Date utilities for PEAK Dashboard
 * Handles timezone-aware date operations (CST/CDT)
 */

/**
 * Get today's date in CST/CDT timezone
 * CST = UTC-6, CDT = UTC-5 (daylight saving)
 */
export function getTodayCST(): string {
  const now = new Date();
  
  // Convert to CST/CDT (America/Chicago timezone)
  // CST is UTC-6, CDT is UTC-5
  const cstOffset = -6 * 60; // CST offset in minutes
  const cdtOffset = -5 * 60; // CDT offset in minutes
  
  // Check if daylight saving time is active (roughly March-November)
  const month = now.getUTCMonth();
  const isDST = month >= 2 && month <= 10; // March (2) to November (10)
  const offset = isDST ? cdtOffset : cstOffset;
  
  // Create date in CST/CDT
  const cstDate = new Date(now.getTime() + (offset * 60 * 1000));
  
  // Format as YYYY-MM-DD
  const year = cstDate.getUTCFullYear();
  const monthStr = String(cstDate.getUTCMonth() + 1).padStart(2, '0');
  const dayStr = String(cstDate.getUTCDate()).padStart(2, '0');
  
  return `${year}-${monthStr}-${dayStr}`;
}

/**
 * Get date string in YYYY-MM-DD format for a given date
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Check if a date string is today (in CST)
 */
export function isTodayCST(dateStr: string): boolean {
  return dateStr === getTodayCST();
}

/**
 * Check if a date string is in the past (in CST)
 */
export function isPastDate(dateStr: string): boolean {
  return dateStr < getTodayCST();
}

/**
 * Check if a date string is in the future (in CST)
 */
export function isFutureDate(dateStr: string): boolean {
  return dateStr > getTodayCST();
}

/**
 * Get date string for N days ago (in CST)
 */
export function getDaysAgoCST(days: number): string {
  const todayStr = getTodayCST();
  const [year, month, day] = todayStr.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  targetDate.setDate(targetDate.getDate() - days);
  return formatDate(targetDate);
}

/**
 * Get date string for N days from now (in CST)
 */
export function getDaysFromNowCST(days: number): string {
  const todayStr = getTodayCST();
  const [year, month, day] = todayStr.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  targetDate.setDate(targetDate.getDate() + days);
  return formatDate(targetDate);
}

