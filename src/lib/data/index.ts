/**
 * PAX Data Index
 * Exports all available PAX indices for the application
 */

export { solo2024 } from './solo2024.js';
export { prosolo2024 } from './prosolo2024.js';

import { solo2024 } from './solo2024.js';
import { prosolo2024 } from './prosolo2024.js';
import type { PaxIndex } from '../types.js';

/**
 * All available PAX indices
 */
export const allIndices: PaxIndex[] = [
	solo2024,
	prosolo2024
];

/**
 * Get index by type and year
 */
export function getIndexByTypeAndYear(indexType: 'Solo' | 'ProSolo', year: number): PaxIndex | null {
	return allIndices.find(index => 
		index.indexType === indexType && index.year === year
	) || null;
}

/**
 * Get latest index for a given type
 */
export function getLatestIndex(indexType: 'Solo' | 'ProSolo'): PaxIndex | null {
	const filtered = allIndices.filter(index => index.indexType === indexType);
	return filtered.sort((a, b) => b.year - a.year)[0] || null;
}

/**
 * Get all available years for a given index type
 */
export function getAvailableYears(indexType: 'Solo' | 'ProSolo'): number[] {
	return allIndices
		.filter(index => index.indexType === indexType)
		.map(index => index.year)
		.sort((a, b) => b - a);
}