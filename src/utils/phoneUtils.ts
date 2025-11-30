/**
 * Phone Number Utilities
 * Handles standardization and validation of phone numbers for Malaysia
 */

/**
 * Normalizes a phone number to standard format: +60XXXXXXXXX
 * Handles various input formats:
 * - 0123456789 → +60123456789
 * - 019832034 → +60199832034
 * - +60123456789 → +60123456789
 * - 6012-345-6789 → +60123456789
 * - 012 345 6789 → +60123456789
 */
export const normalizePhoneNumber = (phoneNumber: string): string => {
    // Remove all non-digit characters except +
    let cleaned = phoneNumber.replace(/[^\d+]/g, '')

    // Remove + if it exists, we'll add it back later
    cleaned = cleaned.replace(/\+/g, '')

    // If number starts with 60 (country code), use as is
    if (cleaned.startsWith('60')) {
        return `+${cleaned}`
    }

    // If number starts with 0 (local format), remove it and add country code
    if (cleaned.startsWith('0')) {
        return `+60${cleaned.substring(1)}`
    }

    // If number doesn't start with 0 or 60, assume it's missing both
    // Add country code directly
    return `+60${cleaned}`
}

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
 * Formats phone number for display: +60 12-345 6789
 * Optional, can be used for nice display in UI
 */
export const formatPhoneNumberDisplay = (phoneNumber: string): string => {
    const normalized = normalizePhoneNumber(phoneNumber)

    // Remove +60 prefix for formatting
    const withoutCountryCode = normalized.replace('+60', '')

    // Format as: +60 XX-XXX XXXX or +60 XXX-XXX XXX
    if (withoutCountryCode.length >= 9) {
        const part1 = withoutCountryCode.substring(0, 2)
        const part2 = withoutCountryCode.substring(2, 5)
        const part3 = withoutCountryCode.substring(5)
        return `+60 ${part1}-${part2} ${part3}`
    }

    // If shorter, just return with +60
    return `+60 ${withoutCountryCode}`
}

/**
 * Validates if a phone number is in valid Malaysian format
 * Malaysian mobile numbers: 10-11 digits starting with 01
 * After normalization: +6010XXXXXXXX or +6011XXXXXXXX
 */
export const isValidMalaysianPhoneNumber = (phoneNumber: string): boolean => {
    const normalized = normalizePhoneNumber(phoneNumber)

    // Check format: +60 followed by 10-11 digits starting with 1
    const regex = /^\+601[0-9]{8,9}$/
    return regex.test(normalized)
}

/**
 * Extracts just the digits from a phone number (no country code, no formatting)
 * Useful for display in local format: 012-345 6789
 */
export const getLocalFormat = (phoneNumber: string): string => {
    const normalized = normalizePhoneNumber(phoneNumber)
    // Remove +60 and add leading 0 back
    return '0' + normalized.replace('+60', '')
}
