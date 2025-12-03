/**
 * Phone Number Utilities
 * Handles standardization and validation of phone numbers for Malaysia
 */

/**
 * Normalizes a phone number to local Malaysian format: 0XXXXXXXXX
 * Handles various input formats:
 * - 0123456789 → 0123456789 (10 digits)
 * - 01234567890 → 01234567890 (11 digits)
 * - +60123456789 → 0123456789
 * - 6012-345-6789 → 0123456789
 * - 012 345 6789 → 0123456789
 */
export const normalizePhoneNumber = (phoneNumber: string): string => {
  // Remove everything except digits
  let cleaned = phoneNumber.replace(/\D/g, '');

  // Handle different input formats
  if (cleaned.startsWith('60')) {
    // International format (60123456789 or +60123456789)
    // Remove country code and add leading 0
    return '0' + cleaned.substring(2);
  } else if (cleaned.startsWith('0')) {
    // Already in local format (0123456789)
    return cleaned;
  } else {
    // No country code, no leading 0 (123456789)
    // Add leading 0
    return '0' + cleaned;
  }
};


/**
 * Compares two phone numbers after normalizing them
 * Returns true if they represent the same number
 */
export const comparePhoneNumbers = (phone1: string, phone2: string): boolean => {
  const normalized1 = normalizePhoneNumber(phone1)
  const normalized2 = normalizePhoneNumber(phone2)
  return normalized1 === normalized2
}

/**
 * Formats phone number for display: 012-345 6789 or 012-3456 7890
 * Optional, can be used for nice display in UI
 */
export const formatPhoneNumberDisplay = (phoneNumber: string): string => {
  const normalized = normalizePhoneNumber(phoneNumber)

  // Format based on length
  // 10 digits: 012-345 6789
  // 11 digits: 012-3456 7890
  if (normalized.length === 10) {
    const part1 = normalized.substring(0, 3)
    const part2 = normalized.substring(3, 6)
    const part3 = normalized.substring(6)
    return `${part1} -${part2} ${part3} `
  } else if (normalized.length === 11) {
    const part1 = normalized.substring(0, 3)
    const part2 = normalized.substring(3, 7)
    const part3 = normalized.substring(7)
    return `${part1} -${part2} ${part3} `
  }

  // If different length, just return as-is
  return normalized
}

/**
 * Validates if a phone number is in valid Malaysian format
 * Malaysian mobile numbers:
 * - 10 digits total: 01X-XXX XXXX (e.g., 012-345 6789)
 * - 11 digits total: 01X-XXXX XXXX (e.g., 012-3456 7890)
 * After normalization: 01XXXXXXXX (10 digits) or 01XXXXXXXXX (11 digits)
 */
export const isValidMalaysianPhoneNumber = (phoneNumber: string): boolean => {
  const normalized = normalizePhoneNumber(phoneNumber)

  // Check format: starts with 01 followed by 8-9 more digits
  // This supports both:
  // - 01XXXXXXXX (10 digits total)
  // - 01XXXXXXXXX (11 digits total)
  const regex = /^01[0-9]{8,9}$/
  return regex.test(normalized)
}

/**
 * Converts local format to international format for display
 * 0123456789 → +60 12-345 6789
 */
export const toInternationalFormat = (phoneNumber: string): string => {
  const normalized = normalizePhoneNumber(phoneNumber)
  // Remove leading 0 and add +60
  const withoutZero = normalized.substring(1)

  if (withoutZero.length === 9) {
    const part1 = withoutZero.substring(0, 2)
    const part2 = withoutZero.substring(2, 5)
    const part3 = withoutZero.substring(5)
    return `+ 60 ${part1} -${part2} ${part3} `
  } else if (withoutZero.length === 10) {
    const part1 = withoutZero.substring(0, 2)
    const part2 = withoutZero.substring(2, 6)
    const part3 = withoutZero.substring(6)
    return `+ 60 ${part1} -${part2} ${part3} `
  }

  return `+ 60 ${withoutZero} `
}

/**
 * Extracts just the digits from a phone number in local format with leading 0
 * Useful for display: 0123456789 or 01234567890
 */
export const getLocalFormat = (phoneNumber: string): string => {
  return normalizePhoneNumber(phoneNumber)
}
