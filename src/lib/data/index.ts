/**
 * PAX Data Index
 * Exports all available PAX indices for the application
 */

export { solo2024 } from './solo2024.js';
export { prosolo2024 } from './prosolo2024.js';

import { solo2024 } from './solo2024.js';
import { prosolo2024 } from './prosolo2024.js';
import type { PaxIndex, IndexType } from '../types.js';

/**
 * All available PAX indices
 */
export const allIndices: PaxIndex[] = [solo2024, prosolo2024];

/**
 * Get index by type and year
 */
export function getIndexByTypeAndYear(indexType: IndexType, year: number): PaxIndex | undefined {
	return allIndices.find((index) => index.indexType === indexType && index.year === year);
}

/**
 * Get latest index for a given type
 */
export function getLatestIndex(indexType: IndexType): PaxIndex | undefined {
	return allIndices
		.filter((index) => index.indexType === indexType)
		.sort((a, b) => b.year - a.year)[0];
}

/**
 * Get all available years for a given index type
 */
export function getAvailableYears(indexType: IndexType): number[] {
	return allIndices
		.filter((index) => index.indexType === indexType)
		.map((index) => index.year)
		.sort((a, b) => b - a);
}
