/**
 * Tests for PAX Calculator Functions
 *
 * Comprehensive test suite covering all calculation functions,
 * time parsing, validation, and edge cases.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
	calculatePaxTime,
	parseTimeString,
	formatTime,
	formatTimeDifference,
	findClassByCode,
	getActiveClasses,
	validatePaxIndex,
	checkEasterEgg
} from './pax-calculator.js';
import type { SoloClass, PaxIndex } from './types.js';

// Mock data for testing
const mockSoloClass: SoloClass = {
	code: 'SS',
	name: 'Super Street',
	paxIndex: 0.844,
	isActive: true
};

const mockASClass: SoloClass = {
	code: 'AS',
	name: 'A Street',
	paxIndex: 0.83,
	isActive: true
};

const mockInactiveClass: SoloClass = {
	code: 'OLD',
	name: 'Old Class',
	paxIndex: 0.8,
	isActive: false
};

const mockPaxIndex: PaxIndex = {
	year: 2024,
	indexType: 'Solo',
	version: '2024.1.0',
	releaseDate: '2024-01-01',
	lastUpdated: '2024-01-01',
	classGroups: [
		{
			id: 'street',
			name: 'Street',
			description: 'Street Category',
			classes: [mockSoloClass, mockASClass, mockInactiveClass]
		}
	],
	classesByCode: {
		SS: mockSoloClass,
		AS: mockASClass,
		OLD: mockInactiveClass
	}
};

describe('calculatePaxTime', () => {
	it('should calculate PAX time correctly', () => {
		const result = calculatePaxTime(60.0, mockSoloClass, mockASClass);

		// Expected: 60.0 * (0.844 / 0.830) = 61.012
		const expectedTime = 60.0 * (0.844 / 0.83);
		expect(result.outputTime).toBeCloseTo(expectedTime, 3);
		expect(result.inputTime).toBe(60.0);
		expect(result.inputClass).toBe(mockSoloClass);
		expect(result.outputClass).toBe(mockASClass);
		expect(result.timeDifference).toBeCloseTo(expectedTime - 60.0, 3);
		expect(result.isFaster).toBe(false);
		expect(result.calculatedAt).toBeDefined();
	});

	it('should handle faster conversion (negative difference)', () => {
		const result = calculatePaxTime(60.0, mockASClass, mockSoloClass);

		// Expected: 60.0 * (0.830 / 0.844)
		const expectedTime = 60.0 * (0.83 / 0.844);
		expect(result.outputTime).toBeCloseTo(expectedTime, 3);
		expect(result.timeDifference).toBeCloseTo(expectedTime - 60.0, 3);
		expect(result.isFaster).toBe(true);
	});

	it('should handle same class conversion', () => {
		const result = calculatePaxTime(60.0, mockSoloClass, mockSoloClass);

		expect(result.outputTime).toBe(60.0);
		expect(result.timeDifference).toBe(0);
		expect(result.isFaster).toBe(false);
	});

	it('should throw error for invalid input time', () => {
		expect(() => calculatePaxTime(0, mockSoloClass, mockASClass)).toThrow(
			'Input time must be greater than 0'
		);
		expect(() => calculatePaxTime(-5, mockSoloClass, mockASClass)).toThrow(
			'Input time must be greater than 0'
		);
	});

	it('should throw error for invalid PAX indices', () => {
		const invalidClass = { ...mockSoloClass, paxIndex: 0 };
		expect(() => calculatePaxTime(60.0, invalidClass, mockASClass)).toThrow(
			'PAX indices must be greater than 0'
		);
		expect(() => calculatePaxTime(60.0, mockSoloClass, invalidClass)).toThrow(
			'PAX indices must be greater than 0'
		);
	});

	it('should round result to 3 decimal places', () => {
		const result = calculatePaxTime(12.3456789, mockSoloClass, mockASClass);

		// Check that result is rounded to 3 decimal places
		expect(result.outputTime.toString().split('.')[1]?.length).toBeLessThanOrEqual(3);
		expect(result.timeDifference.toString().split('.')[1]?.length).toBeLessThanOrEqual(3);
	});
});

describe('parseTimeString', () => {
	it('should parse decimal seconds format', () => {
		expect(parseTimeString('65.123')).toBe(65.123);
		expect(parseTimeString('12.5')).toBe(12.5);
		expect(parseTimeString('45.0')).toBe(45.0);
		expect(parseTimeString('123.456')).toBe(123.456);
	});

	it('should parse minutes:seconds.milliseconds format', () => {
		expect(parseTimeString('1:05.123')).toBe(65.123);
		expect(parseTimeString('2:30.500')).toBe(150.5);
		expect(parseTimeString('0:45.0')).toBe(45.0);
		expect(parseTimeString('10:00.000')).toBe(600.0);
	});

	it('should parse hours:minutes:seconds.milliseconds format', () => {
		expect(parseTimeString('1:05:12.123')).toBe(3912.123);
		expect(parseTimeString('0:02:30.500')).toBe(150.5);
		expect(parseTimeString('2:00:00.000')).toBe(7200.0);
	});

	it('should parse whole seconds format', () => {
		expect(parseTimeString('65')).toBe(65);
		expect(parseTimeString('123')).toBe(123);
		expect(parseTimeString('5')).toBe(5);
	});

	it('should handle milliseconds padding', () => {
		expect(parseTimeString('65.1')).toBe(65.1);
		expect(parseTimeString('65.12')).toBe(65.12);
		expect(parseTimeString('1:05.1')).toBe(65.1);
		expect(parseTimeString('1:05.12')).toBe(65.12);
	});

	it('should throw error for empty string', () => {
		expect(() => parseTimeString('')).toThrow('Time string cannot be empty');
		expect(() => parseTimeString('   ')).toThrow('Time string cannot be empty');
	});

	it('should throw error for invalid format', () => {
		expect(() => parseTimeString('invalid')).toThrow('Invalid time format');
		expect(() => parseTimeString('1:2:3:4')).toThrow('Invalid time format');
		expect(() => parseTimeString('abc.def')).toThrow('Invalid time format');
		expect(() => parseTimeString('12.')).toThrow('Invalid time format');
	});

	it('should handle whitespace', () => {
		expect(parseTimeString('  65.123  ')).toBe(65.123);
		expect(parseTimeString(' 1:05.123 ')).toBe(65.123);
	});
});

describe('formatTime', () => {
	it('should format time to 3 decimal places', () => {
		expect(formatTime(65.123)).toBe('65.123');
		expect(formatTime(12.5)).toBe('12.500');
		expect(formatTime(45)).toBe('45.000');
		expect(formatTime(123.456789)).toBe('123.457');
	});

	it('should throw error for negative time', () => {
		expect(() => formatTime(-5)).toThrow('Time cannot be negative');
	});

	it('should handle zero', () => {
		expect(formatTime(0)).toBe('0.000');
	});
});

describe('formatTimeDifference', () => {
	it('should format positive differences with + sign', () => {
		expect(formatTimeDifference(1.234)).toBe('+1.234');
		expect(formatTimeDifference(0.123)).toBe('+0.123');
	});

	it('should format negative differences with - sign', () => {
		expect(formatTimeDifference(-1.234)).toBe('-1.234');
		expect(formatTimeDifference(-0.123)).toBe('-0.123');
	});

	it('should format zero without sign', () => {
		expect(formatTimeDifference(0)).toBe('0.000');
	});

	it('should round to 3 decimal places', () => {
		expect(formatTimeDifference(1.23456789)).toBe('+1.235');
		expect(formatTimeDifference(-1.23456789)).toBe('-1.235');
	});
});

describe('findClassByCode', () => {
	it('should find existing class by code', () => {
		const result = findClassByCode('SS', mockPaxIndex);
		expect(result).toBe(mockSoloClass);
	});

	it('should return undefined for non-existing class', () => {
		const result = findClassByCode('NONEXISTENT', mockPaxIndex);
		expect(result).toBeUndefined();
	});

	it('should be case sensitive', () => {
		const result = findClassByCode('ss', mockPaxIndex);
		expect(result).toBeUndefined();
	});
});

describe('getActiveClasses', () => {
	it('should return only active classes', () => {
		const result = getActiveClasses(mockPaxIndex);

		expect(result).toHaveLength(2);
		expect(result).toContain(mockSoloClass);
		expect(result).toContain(mockASClass);
		expect(result).not.toContain(mockInactiveClass);
	});

	it('should handle empty class groups', () => {
		const emptyIndex: PaxIndex = {
			...mockPaxIndex,
			classGroups: []
		};

		const result = getActiveClasses(emptyIndex);
		expect(result).toHaveLength(0);
	});
});

describe('validatePaxIndex', () => {
	it('should validate correct PAX index', () => {
		const result = validatePaxIndex(mockPaxIndex);

		expect(result.isValid).toBe(true);
		expect(result.errors).toHaveLength(0);
		expect(result.classCount).toBe(3);
		expect(result.groupCount).toBe(1);
	});

	it('should catch invalid year', () => {
		const invalidIndex = { ...mockPaxIndex, year: 1999 };
		const result = validatePaxIndex(invalidIndex);

		expect(result.isValid).toBe(false);
		expect(result.errors).toContain('Invalid year: 1999');
	});

	it('should catch invalid index type', () => {
		const invalidIndex = { ...mockPaxIndex, indexType: 'Invalid' as any };
		const result = validatePaxIndex(invalidIndex);

		expect(result.isValid).toBe(false);
		expect(result.errors).toContain('Invalid index type: Invalid');
	});

	it('should catch missing class groups', () => {
		const invalidIndex = { ...mockPaxIndex, classGroups: [] };
		const result = validatePaxIndex(invalidIndex);

		expect(result.isValid).toBe(false);
		expect(result.errors).toContain('No class groups found');
	});

	it('should catch duplicate class codes', () => {
		const duplicateClass = { ...mockASClass, code: 'SS' };
		const invalidIndex: PaxIndex = {
			...mockPaxIndex,
			classGroups: [
				{
					id: 'test',
					name: 'Test',
					description: 'Test group',
					classes: [mockSoloClass, duplicateClass]
				}
			]
		};

		const result = validatePaxIndex(invalidIndex);

		expect(result.isValid).toBe(false);
		expect(result.errors).toContain('Duplicate class code: SS');
	});

	it('should catch invalid PAX indices', () => {
		const invalidClass = { ...mockSoloClass, paxIndex: 0 };
		const invalidIndex: PaxIndex = {
			...mockPaxIndex,
			classGroups: [
				{
					id: 'test',
					name: 'Test',
					description: 'Test group',
					classes: [invalidClass]
				}
			]
		};

		const result = validatePaxIndex(invalidIndex);

		expect(result.isValid).toBe(false);
		expect(result.errors).toContain('Invalid PAX index for SS: 0');
	});

	it('should generate warnings for PAX indices outside typical range', () => {
		const edgeClass = { ...mockSoloClass, paxIndex: 1.1 };
		const edgeIndex: PaxIndex = {
			...mockPaxIndex,
			classGroups: [
				{
					id: 'test',
					name: 'Test',
					description: 'Test group',
					classes: [edgeClass]
				}
			]
		};

		const result = validatePaxIndex(edgeIndex);

		expect(result.warnings).toContain('PAX index outside typical range for SS: 1.1');
	});
});

describe('checkEasterEgg', () => {
	it('should return "NICE" for 69.420', () => {
		expect(checkEasterEgg('69.420')).toBe('NICE');
	});

	it('should return undefined for other values', () => {
		expect(checkEasterEgg('69.421')).toBeUndefined();
		expect(checkEasterEgg('68.420')).toBeUndefined();
		expect(checkEasterEgg('65.123')).toBeUndefined();
		expect(checkEasterEgg('random')).toBeUndefined();
	});

	it('should handle whitespace', () => {
		expect(checkEasterEgg('  69.420  ')).toBe('NICE');
	});
});
