/**
 * PAX Calculator Functions
 *
 * Core calculation logic for converting times between racing classes
 * using PAX (Performance Adjustment eXchange) indices.
 */

import type { SoloClass, PaxCalculationResult, PaxIndex, PaxValidationResult } from './types.js';

/**
 * Calculate PAX-adjusted time from input class to output class
 * Formula: outputTime = inputTime * (inputPax / outputPax)
 */
export function calculatePaxTime(
	inputTime: number,
	inputClass: SoloClass,
	outputClass: SoloClass
): PaxCalculationResult {
	// Validate input time
	if (inputTime <= 0) {
		throw new Error('Input time must be greater than 0');
	}

	// Validate PAX indices
	if (inputClass.paxIndex <= 0 || outputClass.paxIndex <= 0) {
		throw new Error('PAX indices must be greater than 0');
	}

	// Calculate output time using PAX formula
	const outputTime = inputTime * (inputClass.paxIndex / outputClass.paxIndex);

	// Calculate difference (positive = slower, negative = faster)
	const timeDifference = outputTime - inputTime;

	return {
		inputTime,
		inputClass,
		outputTime: Number(outputTime.toFixed(3)), // Round to 3 decimal places
		outputClass,
		timeDifference: Number(timeDifference.toFixed(3)),
		isFaster: timeDifference < 0,
		calculatedAt: new Date().toISOString()
	};
}

/**
 * Parse time string to decimal seconds
 * Supports formats: "65.123", "1:05.123", "1:05:12.123"
 */
export function parseTimeString(timeString: string): number {
	if (!timeString || timeString.trim() === '') {
		throw new Error('Time string cannot be empty');
	}

	const cleaned = timeString.trim();

	// Check for minutes:seconds.milliseconds format (1:05.123)
	const minutesMatch = cleaned.match(/^(\d+):(\d{1,2})\.(\d{1,3})$/);
	if (minutesMatch) {
		const [, minutes, seconds, milliseconds] = minutesMatch;
		const totalSeconds = parseInt(minutes) * 60 + parseInt(seconds);
		const ms = parseInt(milliseconds.padEnd(3, '0'));
		return totalSeconds + ms / 1000;
	}

	// Check for hours:minutes:seconds.milliseconds format (1:05:12.123)
	const hoursMatch = cleaned.match(/^(\d+):(\d{1,2}):(\d{1,2})\.(\d{1,3})$/);
	if (hoursMatch) {
		const [, hours, minutes, seconds, milliseconds] = hoursMatch;
		const totalSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
		const ms = parseInt(milliseconds.padEnd(3, '0'));
		return totalSeconds + ms / 1000;
	}

	// Check for decimal seconds format (65.123)
	const decimalMatch = cleaned.match(/^(\d+)\.(\d{1,3})$/);
	if (decimalMatch) {
		const [, seconds, milliseconds] = decimalMatch;
		const ms = parseInt(milliseconds.padEnd(3, '0'));
		return parseInt(seconds) + ms / 1000;
	}

	// Check for whole seconds format (65)
	const wholeMatch = cleaned.match(/^(\d+)$/);
	if (wholeMatch) {
		return parseInt(wholeMatch[1]);
	}

	throw new Error(`Invalid time format: ${timeString}`);
}

/**
 * Format decimal seconds to display string
 * Always shows 3 decimal places for consistency
 */
export function formatTime(seconds: number): string {
	if (seconds < 0) {
		throw new Error('Time cannot be negative');
	}

	return seconds.toFixed(3);
}

/**
 * Get time difference display string with appropriate sign
 */
export function formatTimeDifference(difference: number): string {
	return `${difference > 0 ? '+' : ''}${difference.toFixed(3)}`;
}

/**
 * Find a class by code in the given PAX index
 */
export function findClassByCode(classCode: string, paxIndex: PaxIndex): SoloClass | undefined {
	return paxIndex.classesByCode[classCode];
}

/**
 * Get all active classes from a PAX index
 */
export function getActiveClasses(paxIndex: PaxIndex): SoloClass[] {
	return paxIndex.classGroups
		.flatMap((group) => group.classes)
		.filter((soloClass) => soloClass.isActive);
}

/**
 * Validate PAX index data structure and values
 */
export function validatePaxIndex(paxIndex: PaxIndex): PaxValidationResult {
	const errors: string[] = [];
	const warnings: string[] = [];

	// Validate basic structure
	if (!paxIndex.year || paxIndex.year < 2000 || paxIndex.year > 2100) {
		errors.push(`Invalid year: ${paxIndex.year}`);
	}

	if (!paxIndex.indexType || !['Solo', 'ProSolo'].includes(paxIndex.indexType)) {
		errors.push(`Invalid index type: ${paxIndex.indexType}`);
	}

	if (!paxIndex.classGroups || paxIndex.classGroups.length === 0) {
		errors.push('No class groups found');
	}

	let classCount = 0;
	const seenCodes = new Set<string>();

	// Validate each class group
	for (const group of paxIndex.classGroups) {
		if (!group.id || !group.name) {
			errors.push(`Class group missing id or name: ${JSON.stringify(group)}`);
			continue;
		}

		// Validate classes in group
		for (const soloClass of group.classes) {
			classCount++;

			// Check for duplicate class codes
			if (seenCodes.has(soloClass.code)) {
				errors.push(`Duplicate class code: ${soloClass.code}`);
			}
			seenCodes.add(soloClass.code);

			// Validate class structure
			if (!soloClass.code || !soloClass.name) {
				errors.push(`Class missing code or name: ${JSON.stringify(soloClass)}`);
			}

			// Validate PAX index range (typical range is 0.7-1.0)
			if (soloClass.paxIndex < 0.7 || soloClass.paxIndex > 1.0) {
				warnings.push(
					`PAX index outside typical range for ${soloClass.code}: ${soloClass.paxIndex}`
				);
			}

			if (soloClass.paxIndex <= 0) {
				errors.push(`Invalid PAX index for ${soloClass.code}: ${soloClass.paxIndex}`);
			}
		}
	}

	// Validate classesByCode lookup matches classes
	if (Object.keys(paxIndex.classesByCode).length !== classCount) {
		errors.push(
			`Class lookup count mismatch: ${Object.keys(paxIndex.classesByCode).length} vs ${classCount}`
		);
	}

	return {
		isValid: errors.length === 0,
		errors,
		warnings,
		classCount,
		groupCount: paxIndex.classGroups.length
	};
}

/**
 * Easter egg function - check for special time values
 */
export function checkEasterEgg(timeString: string): string | undefined {
	// Check for "NICE" time (69.420)
	if (timeString.trim() === '69.420') {
		return 'NICE';
	}

	return undefined;
}
