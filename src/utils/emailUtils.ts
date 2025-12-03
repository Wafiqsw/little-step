/**
 * Email Utilities
 * Handles standardization and validation of email addresses
 */

/**
 * Normalizes an email address to lowercase and trims whitespace
 * Ensures consistent format for comparison and storage
 */
export const normalizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

/**
 * Validates if an email address is in valid format
 * Uses a standard email regex pattern
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Compares two email addresses after normalizing them
 * Returns true if they represent the same email
 */
export const compareEmails = (email1: string, email2: string): boolean => {
  const normalized1 = normalizeEmail(email1);
  const normalized2 = normalizeEmail(email2);
  return normalized1 === normalized2;
};

/**
 * Formats email address for display (lowercase, trimmed)
 */
export const formatEmailDisplay = (email: string): string => {
  return normalizeEmail(email);
};
