/**
 * Tests for Solo 2024 PAX Data
 *
 * Specific tests for the Solo 2024 data structure and values.
 */

import { describe, it, expect } from 'vitest';
import { solo2024 } from './solo2024.js';

describe('Solo 2024 Specific Tests', () => {
	it('should have correct Super Street (SS) PAX value', () => {
		const ssClass = solo2024.classesByCode['SS'];
		expect(ssClass).toBeDefined();
		expect(ssClass.code).toBe('SS');
		expect(ssClass.name).toBe('Super Street');
		expect(ssClass.paxIndex).toBe(0.844);
		expect(ssClass.isActive).toBe(true);
	});

	it('should have all expected Street Touring classes', () => {
		const stGroup = solo2024.classGroups.find((g) => g.id === 'street-touring');
		expect(stGroup).toBeDefined();

		const stCodes = stGroup!.classes.map((c) => c.code);
		expect(stCodes).toEqual(['STR', 'STS', 'STU', 'STX', 'STH']);
	});

	it('should have CAM classes', () => {
		const camGroup = solo2024.classGroups.find((g) => g.id === 'cam');
		expect(camGroup).toBeDefined();
		expect(camGroup!.name).toBe('CAM');
		expect(camGroup!.description).toBe('Classic American Muscle');

		const camCodes = camGroup!.classes.map((c) => c.code);
		expect(camCodes).toContain('CAM-T');
		expect(camCodes).toContain('CAM-C');
		expect(camCodes).toContain('CAM-S');
	});

	it('should have A Modified as baseline (1.000)', () => {
		const amClass = solo2024.classesByCode['AM'];
		expect(amClass).toBeDefined();
		expect(amClass.paxIndex).toBe(1.0);
	});

	it('should have H Street as lowest PAX', () => {
		const hsClass = solo2024.classesByCode['HS'];
		expect(hsClass).toBeDefined();
		expect(hsClass.paxIndex).toBe(0.776);

		// Verify it's the lowest
		const allIndices = solo2024.classGroups.flatMap((g) => g.classes).map((c) => c.paxIndex);
		const minIndex = Math.min(...allIndices);
		expect(hsClass.paxIndex).toBe(minIndex);
	});

	it('should have proper class count per group', () => {
		const expectedCounts = {
			street: 9, // SS, AS, BS, CS, DS, ES, FS, GS, HS
			'street-touring': 5, // STR, STS, STU, STX, STH
			'street-prepared': 7, // SSP, ASP, BSP, CSP, DSP, ESP, FSP
			'street-modified': 3, // SSM, SM, SMF
			prepared: 7, // AP, BP, CP, DP, EP, FP, XP
			modified: 6, // AM, BM, CM, DM, EM, FM
			spec: 3, // SSC, FSAE, KM
			supplemental: 5, // XS, XU, XA, XB, EVX
			cam: 3 // CAM-T, CAM-C, CAM-S
		};

		for (const group of solo2024.classGroups) {
			expect(group.classes).toHaveLength(expectedCounts[group.id as keyof typeof expectedCounts]);
		}
	});

	it('should have XS class in supplemental category', () => {
		const xsClass = solo2024.classesByCode['XS'];
		expect(xsClass).toBeDefined();
		expect(xsClass.name).toBe('Xtreme Street');
		expect(xsClass.paxIndex).toBe(0.867);

		const supplementalGroup = solo2024.classGroups.find((g) => g.id === 'supplemental');
		expect(supplementalGroup!.classes).toContain(xsClass);
	});

	it('should have all classes marked as active', () => {
		const allClasses = solo2024.classGroups.flatMap((g) => g.classes);
		expect(allClasses.every((c) => c.isActive)).toBe(true);
	});

	it('should have unique class codes', () => {
		const allCodes = solo2024.classGroups.flatMap((g) => g.classes.map((c) => c.code));
		const uniqueCodes = new Set(allCodes);
		expect(allCodes).toHaveLength(uniqueCodes.size);
	});

	it('should have reasonable PAX distribution', () => {
		const allIndices = solo2024.classGroups.flatMap((g) => g.classes).map((c) => c.paxIndex);

		// Check range
		expect(Math.min(...allIndices)).toBeGreaterThanOrEqual(0.7);
		expect(Math.max(...allIndices)).toBeLessThanOrEqual(1.0);

		// Check that we have variety
		const uniqueIndices = new Set(allIndices);
		expect(uniqueIndices.size).toBeGreaterThan(10); // Should have many different values
	});
});
