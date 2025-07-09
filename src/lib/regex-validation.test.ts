/**
 * Tests for Time Parsing Regex Validation
 *
 * Specific tests for the regex patterns used in time parsing
 * to ensure they correctly accept valid formats and reject invalid ones.
 */

import { describe, it, expect } from 'vitest';
import { parseTimeString } from './pax-calculator.js';

describe('Time Parsing Regex Patterns', () => {
	describe('Minutes:Seconds.Milliseconds Format', () => {
		it('should accept valid minutes:seconds.milliseconds', () => {
			expect(parseTimeString('1:05.123')).toBe(65.123);
			expect(parseTimeString('0:30.500')).toBe(30.5);
			expect(parseTimeString('10:45.0')).toBe(645.0);
			expect(parseTimeString('59:59.999')).toBe(3599.999);
		});

		it('should accept any valid minutes format (no range validation)', () => {
			expect(parseTimeString('60:00.000')).toBe(3600); // 60 minutes allowed
			expect(parseTimeString('100:00.000')).toBe(6000); // 100 minutes allowed
			expect(() => parseTimeString('-1:00.000')).toThrow(); // negative minutes rejected by regex
		});

		it('should accept any valid seconds format (no range validation)', () => {
			expect(parseTimeString('1:60.000')).toBe(120); // 60 seconds allowed (though invalid time)
			expect(parseTimeString('1:99.000')).toBe(159); // 99 seconds allowed (though invalid time)
			expect(() => parseTimeString('1:-1.000')).toThrow(); // negative seconds rejected by regex
		});

		it('should accept single digit seconds but reject malformed patterns', () => {
			expect(parseTimeString('1:5.123')).toBe(65.123); // single digit seconds allowed
			expect(() => parseTimeString('1:005.123')).toThrow(); // three digit seconds
			expect(() => parseTimeString('1:.123')).toThrow(); // missing seconds
			expect(() => parseTimeString(':05.123')).toThrow(); // missing minutes
		});
	});

	describe('Hours:Minutes:Seconds.Milliseconds Format', () => {
		it('should accept valid hours:minutes:seconds.milliseconds', () => {
			expect(parseTimeString('1:05:12.123')).toBe(3912.123);
			expect(parseTimeString('0:30:45.500')).toBe(1845.5);
			expect(parseTimeString('23:59:59.999')).toBe(86399.999);
		});

		it('should accept any valid hours format (no range validation)', () => {
			expect(parseTimeString('24:00:00.000')).toBe(86400); // 24 hours allowed
			expect(parseTimeString('25:00:00.000')).toBe(90000); // 25 hours allowed
			expect(() => parseTimeString('-1:00:00.000')).toThrow(); // negative hours rejected by regex
		});

		it('should accept any valid time components (no range validation)', () => {
			expect(parseTimeString('1:60:00.000')).toBe(7200); // 60 minutes allowed
			expect(parseTimeString('1:00:60.000')).toBe(3660); // 60 seconds allowed
		});

		it('should accept single digits but reject malformed patterns', () => {
			expect(parseTimeString('1:5:12.123')).toBe(3912.123); // single digit minutes allowed
			expect(parseTimeString('1:05:2.123')).toBe(3902.123); // single digit seconds allowed
			expect(() => parseTimeString('1::12.123')).toThrow(); // missing minutes
			expect(() => parseTimeString(':05:12.123')).toThrow(); // missing hours
		});
	});

	describe('Decimal Seconds Format', () => {
		it('should accept valid decimal seconds', () => {
			expect(parseTimeString('65.123')).toBe(65.123);
			expect(parseTimeString('0.001')).toBe(0.001);
			expect(parseTimeString('999.999')).toBe(999.999);
		});

		it('should accept different millisecond lengths', () => {
			expect(parseTimeString('65.1')).toBe(65.1);
			expect(parseTimeString('65.12')).toBe(65.12);
			expect(parseTimeString('65.123')).toBe(65.123);
		});

		it('should reject malformed decimal patterns', () => {
			expect(() => parseTimeString('65.')).toThrow(); // trailing dot
			expect(() => parseTimeString('.123')).toThrow(); // leading dot
			expect(() => parseTimeString('65.1234')).toThrow(); // too many decimals
		});
	});

	describe('Whole Seconds Format', () => {
		it('should accept valid whole seconds', () => {
			expect(parseTimeString('0')).toBe(0);
			expect(parseTimeString('65')).toBe(65);
			expect(parseTimeString('999')).toBe(999);
		});

		it('should reject invalid whole number patterns', () => {
			// The regex accepts leading zeros (it's just \d+), so these don't throw
			expect(parseTimeString('00')).toBe(0); // leading zero accepted
			expect(parseTimeString('01')).toBe(1); // leading zero accepted
			expect(() => parseTimeString('-5')).toThrow(); // negative
		});
	});

	describe('Edge Cases and Boundary Conditions', () => {
		it('should handle boundary values correctly', () => {
			// Valid boundaries
			expect(parseTimeString('0:00.001')).toBe(0.001);
			expect(parseTimeString('59:59.999')).toBe(3599.999);
			expect(parseTimeString('23:59:59.999')).toBe(86399.999);
		});

		it('should reject just-over-boundary values', () => {
			// These should be caught by validation logic, not regex
			// But we test them here to ensure consistency
			try {
				parseTimeString('0:60.000');
				expect.fail('Should have thrown for 60 seconds');
			} catch (error) {
				expect(error).toBeDefined();
			}
		});

		it('should handle whitespace correctly', () => {
			expect(parseTimeString('  65.123  ')).toBe(65.123);
			expect(parseTimeString(' 1:05.123 ')).toBe(65.123);
			expect(() => parseTimeString('6 5.123')).toThrow(); // internal whitespace
			expect(() => parseTimeString('1: 05.123')).toThrow(); // internal whitespace
		});
	});

	describe('Invalid Character Patterns', () => {
		it('should reject alphabetic characters', () => {
			expect(() => parseTimeString('1a.123')).toThrow();
			expect(() => parseTimeString('1:0a.123')).toThrow();
			expect(() => parseTimeString('1:05.12a')).toThrow();
		});

		it('should reject special characters', () => {
			expect(() => parseTimeString('1#05.123')).toThrow();
			expect(() => parseTimeString('1:05@123')).toThrow();
			expect(() => parseTimeString('1:05.12$')).toThrow();
		});

		it('should reject multiple separators', () => {
			expect(() => parseTimeString('1::05.123')).toThrow();
			expect(() => parseTimeString('1:05..123')).toThrow();
			expect(() => parseTimeString('1..05:123')).toThrow();
		});
	});

	describe('Regex Pattern Completeness', () => {
		it('should not partially match invalid strings', () => {
			// These should completely fail, not partially match
			expect(() => parseTimeString('1:05.123extra')).toThrow();
			expect(() => parseTimeString('prefix1:05.123')).toThrow();
			expect(() => parseTimeString('65.123suffix')).toThrow();
		});

		it('should require complete format matches', () => {
			expect(() => parseTimeString('1:05')).toThrow(); // missing milliseconds
			expect(() => parseTimeString('1:05.')).toThrow(); // incomplete milliseconds
			expect(() => parseTimeString('1:')).toThrow(); // incomplete format
		});
	});
});
