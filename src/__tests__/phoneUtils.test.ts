/**
 * Test file for phone number utilities
 * Run this to verify phone number normalization works correctly
 */

import {
    normalizePhoneNumber,
    isValidMalaysianPhoneNumber,
    comparePhoneNumbers,
    formatPhoneNumberDisplay,
    getLocalFormat
} from '../utils/phoneUtils';

console.log('=== Phone Number Normalization Tests ===\n');

// Test cases for normalization
const testCases = [
    { input: '0123456789', expected: '+60123456789', description: '10-digit local format' },
    { input: '01234567890', expected: '+601234567890', description: '11-digit local format' },
    { input: '0108030465', expected: '+60108030465', description: '10-digit starting with 010' },
    { input: '01080809090', expected: '+601080809090', description: '11-digit starting with 010' },
    { input: '+60123456789', expected: '+60123456789', description: 'Already in international format' },
    { input: '60123456789', expected: '+60123456789', description: 'International without +' },
    { input: '012-345-6789', expected: '+60123456789', description: 'With dashes' },
    { input: '012 345 6789', expected: '+60123456789', description: 'With spaces' },
];

console.log('Testing normalizePhoneNumber():');
testCases.forEach(({ input, expected, description }) => {
    const result = normalizePhoneNumber(input);
    const passed = result === expected;
    console.log(`  ${passed ? '✅' : '❌'} ${description}`);
    console.log(`     Input: ${input} → Output: ${result} (Expected: ${expected})`);
    if (!passed) {
        console.log(`     ⚠️  FAILED!`);
    }
});

console.log('\n=== Validation Tests ===\n');

// Test validation
const validationTests = [
    { input: '0123456789', shouldBeValid: true, description: '10-digit local' },
    { input: '01234567890', shouldBeValid: true, description: '11-digit local' },
    { input: '0108030465', shouldBeValid: true, description: '10-digit with 010' },
    { input: '01080809090', shouldBeValid: true, description: '11-digit with 010' },
    { input: '+60123456789', shouldBeValid: true, description: 'International format' },
    { input: '0223456789', shouldBeValid: false, description: 'Landline (starts with 02)' },
    { input: '012345', shouldBeValid: false, description: 'Too short' },
    { input: '012345678901234', shouldBeValid: false, description: 'Too long' },
];

console.log('Testing isValidMalaysianPhoneNumber():');
validationTests.forEach(({ input, shouldBeValid, description }) => {
    const result = isValidMalaysianPhoneNumber(input);
    const passed = result === shouldBeValid;
    console.log(`  ${passed ? '✅' : '❌'} ${description}`);
    console.log(`     Input: ${input} → Valid: ${result} (Expected: ${shouldBeValid})`);
    if (!passed) {
        console.log(`     ⚠️  FAILED!`);
    }
});

console.log('\n=== Comparison Tests ===\n');

// Test phone number comparison
const comparisonTests = [
    { phone1: '0123456789', phone2: '+60123456789', shouldMatch: true, description: 'Local vs International (10-digit)' },
    { phone1: '01234567890', phone2: '+601234567890', shouldMatch: true, description: 'Local vs International (11-digit)' },
    { phone1: '0108030465', phone2: '+60108030465', shouldMatch: true, description: 'Different formats, same number' },
    { phone1: '012-345-6789', phone2: '012 345 6789', shouldMatch: true, description: 'Different separators' },
    { phone1: '0123456789', phone2: '0129876543', shouldMatch: false, description: 'Different numbers' },
];

console.log('Testing comparePhoneNumbers():');
comparisonTests.forEach(({ phone1, phone2, shouldMatch, description }) => {
    const result = comparePhoneNumbers(phone1, phone2);
    const passed = result === shouldMatch;
    console.log(`  ${passed ? '✅' : '❌'} ${description}`);
    console.log(`     ${phone1} vs ${phone2} → Match: ${result} (Expected: ${shouldMatch})`);
    if (!passed) {
        console.log(`     ⚠️  FAILED!`);
    }
});

console.log('\n=== Formatting Tests ===\n');

// Test display formatting
const formatTests = [
    { input: '0123456789', description: '10-digit format' },
    { input: '01234567890', description: '11-digit format' },
    { input: '+60123456789', description: 'International format' },
];

console.log('Testing formatPhoneNumberDisplay():');
formatTests.forEach(({ input, description }) => {
    const result = formatPhoneNumberDisplay(input);
    console.log(`  ✓ ${description}: ${input} → ${result}`);
});

console.log('\n=== Local Format Tests ===\n');

console.log('Testing getLocalFormat():');
formatTests.forEach(({ input, description }) => {
    const result = getLocalFormat(input);
    console.log(`  ✓ ${description}: ${input} → ${result}`);
});

console.log('\n=== All tests complete ===');
