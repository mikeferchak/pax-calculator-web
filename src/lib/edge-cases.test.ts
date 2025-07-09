/**
 * Tests for Edge Cases and Error Conditions
 *
 * Tests unusual inputs, boundary conditions, and error scenarios
 * to ensure robust error handling.
 */

import { describe, it, expect } from 'vitest';
import {
	calculatePaxTime,
	parseTimeString,
	formatTime,
	validatePaxIndex
} from './pax-calculator.js';
import type { SoloClass, PaxIndex } from './types.js';

// Mock classes for edge case testing
const mockClass1: SoloClass = {
	code: 'TEST1',
	name: 'Test Class 1',
	paxIndex: 0.5,
	isActive: true
};

const mockClass2: SoloClass = {
	code: 'TEST2',
	name: 'Test Class 2',
	paxIndex: 1.5,
	isActive: true
};

describe('Edge Cases - PAX Calculations', () => {
	it('should handle very small time values', () => {
		const result = calculatePaxTime(0.001, mockClass1, mockClass2);
		// 0.001 * (0.5 / 1.5) = 0.001 * (1/3) = 0.000333..., rounds to 0.000
		const rawExpected = 0.001 * (mockClass1.paxIndex / mockClass2.paxIndex);
		const expected = Number(rawExpected.toFixed(3)); // This becomes 0 due to rounding
		expect(result.outputTime).toBe(expected);
		expect(result.outputTime).toBe(0); // Explicitly test that it rounds to 0
	});

	it('should handle very large time values', () => {
		const result = calculatePaxTime(99999.999, mockClass1, mockClass2);
		expect(result.outputTime).toBeGreaterThan(0);
		// 99999.999 * (0.5 / 1.5) = 99999.999 * (1/3) = 33333.333
		const expected = 99999.999 * (mockClass1.paxIndex / mockClass2.paxIndex);
		expect(result.outputTime).toBeCloseTo(expected, 3);
	});

	it('should handle extreme PAX ratios', () => {
		const slowClass: SoloClass = { ...mockClass1, paxIndex: 0.7 };
		const fastClass: SoloClass = { ...mockClass2, paxIndex: 1.0 };

		const result = calculatePaxTime(60.0, slowClass, fastClass);
		expect(result.outputTime).toBeCloseTo(42.0, 3); // 60 * (0.7 / 1.0)
	});

	it('should handle floating point precision issues', () => {
		const class1: SoloClass = { ...mockClass1, paxIndex: 0.844 };
		const class2: SoloClass = { ...mockClass2, paxIndex: 0.83 };

		const result = calculatePaxTime(0.1, class1, class2);
		expect(result.outputTime).toBeCloseTo(0.102, 3);
		expect(result.timeDifference).toBeCloseTo(0.002, 3);
	});

	it('should handle nearly identical PAX values', () => {
		const class1: SoloClass = { ...mockClass1, paxIndex: 0.844 };
		const class2: SoloClass = { ...mockClass2, paxIndex: 0.8441 };

		const result = calculatePaxTime(60.0, class1, class2);
		expect(Math.abs(result.timeDifference)).toBeLessThan(0.01);
	});
});

describe('Edge Cases - Time Parsing', () => {
	it('should handle minimal valid inputs', () => {
		expect(parseTimeString('0')).toBe(0);
		expect(parseTimeString('0.0')).toBe(0);
		expect(parseTimeString('0.001')).toBe(0.001);
		expect(parseTimeString('0:00.001')).toBe(0.001);
	});

	it('should handle maximum reasonable inputs', () => {
		expect(parseTimeString('999')).toBe(999);
		expect(parseTimeString('999.999')).toBe(999.999);
		expect(parseTimeString('59:59.999')).toBe(3599.999);
		expect(parseTimeString('23:59:59.999')).toBe(86399.999);
	});

	it('should handle edge cases in millisecond parsing', () => {
		expect(parseTimeString('1.1')).toBe(1.1);
		expect(parseTimeString('1.12')).toBe(1.12);
		expect(parseTimeString('1.123')).toBe(1.123);
		expect(parseTimeString('1:01.1')).toBe(61.1);
		expect(parseTimeString('1:01.12')).toBe(61.12);
	});

	it('should handle leading zeros', () => {
		expect(parseTimeString('01.123')).toBe(1.123);
		expect(parseTimeString('01:01.123')).toBe(61.123);
		expect(parseTimeString('01:01:01.123')).toBe(3661.123);
	});

	it('should handle boundary cases for minutes and seconds', () => {
		expect(parseTimeString('0:00.000')).toBe(0);
		expect(parseTimeString('0:59.999')).toBe(59.999);
		expect(parseTimeString('59:59.999')).toBe(3599.999);
	});

	it('should parse time components as given (no validation)', () => {
		// Our parser doesn't validate ranges, it just parses the format
		expect(parseTimeString('60:00.000')).toBe(3600); // 60 minutes = 3600 seconds
		expect(parseTimeString('1:60.000')).toBe(120); // 1:60 = 120 seconds (though invalid time)
		expect(parseTimeString('25:00:00.000')).toBe(90000); // 25 hours = 90000 seconds
	});

	it('should handle very long strings', () => {
		const longInvalidString = 'a'.repeat(1000);
		expect(() => parseTimeString(longInvalidString)).toThrow();
	});

	it('should handle special characters', () => {
		expect(() => parseTimeString('1.2.3')).toThrow();
		expect(() => parseTimeString('1:2:3:4')).toThrow();
		expect(() => parseTimeString('1h2m3s')).toThrow();
		expect(() => parseTimeString('1 minute')).toThrow();
	});
});

describe('Edge Cases - Time Formatting', () => {
	it('should handle very small values', () => {
		expect(formatTime(0)).toBe('0.000');
		expect(formatTime(0.001)).toBe('0.001');
		expect(formatTime(0.0001)).toBe('0.000'); // Rounds to 3 decimals
	});

	it('should handle very large values', () => {
		expect(formatTime(99999.999)).toBe('99999.999');
		expect(formatTime(999999.123456)).toBe('999999.123');
	});

	it('should handle floating point edge cases', () => {
		expect(formatTime(0.9995)).toBe('1.000'); // Rounds up
		expect(formatTime(0.9994)).toBe('0.999'); // Rounds down
	});
});

describe('Edge Cases - Data Validation', () => {
	it('should handle empty PAX index', () => {
		const emptyIndex: PaxIndex = {
			year: 2024,
			indexType: 'Solo',
			version: '1.0.0',
			releaseDate: '2024-01-01',
			lastUpdated: '2024-01-01',
			classGroups: [],
			classesByCode: {}
		};

		const result = validatePaxIndex(emptyIndex);
		expect(result.isValid).toBe(false);
		expect(result.errors).toContain('No class groups found');
	});

	it('should handle malformed class groups', () => {
		const malformedIndex: PaxIndex = {
			year: 2024,
			indexType: 'Solo',
			version: '1.0.0',
			releaseDate: '2024-01-01',
			lastUpdated: '2024-01-01',
			classGroups: [
				{
					id: '',
					name: '',
					description: 'Empty group',
					classes: []
				}
			],
			classesByCode: {}
		};

		const result = validatePaxIndex(malformedIndex);
		expect(result.isValid).toBe(false);
		expect(result.errors.some((err) => err.includes('missing id or name'))).toBe(true);
	});

	it('should handle malformed classes', () => {
		const malformedIndex: PaxIndex = {
			year: 2024,
			indexType: 'Solo',
			version: '1.0.0',
			releaseDate: '2024-01-01',
			lastUpdated: '2024-01-01',
			classGroups: [
				{
					id: 'test',
					name: 'Test',
					description: 'Test group',
					classes: [
						{
							code: '',
							name: '',
							paxIndex: 0.8,
							isActive: true
						}
					]
				}
			],
			classesByCode: {}
		};

		const result = validatePaxIndex(malformedIndex);
		expect(result.isValid).toBe(false);
		expect(result.errors.some((err) => err.includes('missing code or name'))).toBe(true);
	});

	it('should handle extreme PAX values', () => {
		const extremeIndex: PaxIndex = {
			year: 2024,
			indexType: 'Solo',
			version: '1.0.0',
			releaseDate: '2024-01-01',
			lastUpdated: '2024-01-01',
			classGroups: [
				{
					id: 'test',
					name: 'Test',
					description: 'Test group',
					classes: [
						{
							code: 'EXTREME',
							name: 'Extreme Class',
							paxIndex: 2.0, // Way outside normal range
							isActive: true
						}
					]
				}
			],
			classesByCode: {
				EXTREME: {
					code: 'EXTREME',
					name: 'Extreme Class',
					paxIndex: 2.0,
					isActive: true
				}
			}
		};

		const result = validatePaxIndex(extremeIndex);
		expect(result.warnings).toContain('PAX index outside typical range for EXTREME: 2');
	});

	it('should handle future years', () => {
		const futureIndex: PaxIndex = {
			year: 3000,
			indexType: 'Solo',
			version: '1.0.0',
			releaseDate: '3000-01-01',
			lastUpdated: '3000-01-01',
			classGroups: [],
			classesByCode: {}
		};

		const result = validatePaxIndex(futureIndex);
		expect(result.isValid).toBe(false);
		expect(result.errors).toContain('Invalid year: 3000');
	});

	it('should handle negative PAX values', () => {
		const negativeIndex: PaxIndex = {
			year: 2024,
			indexType: 'Solo',
			version: '1.0.0',
			releaseDate: '2024-01-01',
			lastUpdated: '2024-01-01',
			classGroups: [
				{
					id: 'test',
					name: 'Test',
					description: 'Test group',
					classes: [
						{
							code: 'NEG',
							name: 'Negative Class',
							paxIndex: -0.5,
							isActive: true
						}
					]
				}
			],
			classesByCode: {}
		};

		const result = validatePaxIndex(negativeIndex);
		expect(result.isValid).toBe(false);
		expect(result.errors).toContain('Invalid PAX index for NEG: -0.5');
	});
});

describe('Edge Cases - Input Sanitization', () => {
	it('should handle Unicode characters in time strings', () => {
		expect(() => parseTimeString('6０.１２３')).toThrow(); // Full-width characters
		expect(() => parseTimeString('60․123')).toThrow(); // Different dot character
		expect(() => parseTimeString('60‥123')).toThrow(); // Two-dot leader
	});

	it('should handle null bytes and control characters', () => {
		expect(() => parseTimeString('60\u0000123')).toThrow(); // null byte
		expect(() => parseTimeString('60\n123')).toThrow(); // newline
		expect(() => parseTimeString('60\t123')).toThrow(); // tab
	});

	it('should handle very long time strings', () => {
		const longString = '1' + '.'.repeat(1000) + '1';
		expect(() => parseTimeString(longString)).toThrow();
	});
});
