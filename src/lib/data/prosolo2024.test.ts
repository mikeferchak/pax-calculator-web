/**
 * Tests for ProSolo 2024 PAX Data
 *
 * Specific tests for the ProSolo 2024 data structure and values.
 */

import { describe, it, expect } from 'vitest';
import { prosolo2024 } from './prosolo2024.js';

describe('ProSolo 2024 Specific Tests', () => {
	it('should have correct Super Street (SS) PAX value', () => {
		const ssClass = prosolo2024.classesByCode['SS'];
		expect(ssClass).toBeDefined();
		expect(ssClass.code).toBe('SS');
		expect(ssClass.name).toBe('Super Street');
		expect(ssClass.paxIndex).toBe(0.844);
		expect(ssClass.isActive).toBe(true);
	});

	it('should have ProSolo-specific Street Touring classes', () => {
		const stGroup = prosolo2024.classGroups.find((g) => g.id === 'street-touring');
		expect(stGroup).toBeDefined();

		const stCodes = stGroup!.classes.map((c) => c.code);
		expect(stCodes).toContain('AST');
		expect(stCodes).toContain('BST');
		expect(stCodes).toContain('CST');
		expect(stCodes).toContain('DST');
		expect(stCodes).toContain('EST');
		expect(stCodes).toContain('GST');
		expect(stCodes).toContain('SST');
	});

	it('should have Club Spec Mustang (CSM) class', () => {
		const csmClass = prosolo2024.classesByCode['CSM'];
		expect(csmClass).toBeDefined();
		expect(csmClass.name).toBe('Club Spec Mustang');
		expect(csmClass.paxIndex).toBe(0.83);

		const clubSpecGroup = prosolo2024.classGroups.find((g) => g.id === 'club-spec');
		expect(clubSpecGroup).toBeDefined();
		expect(clubSpecGroup!.classes).toContain(csmClass);
	});

	it('should have CSX class in spec category', () => {
		const csxClass = prosolo2024.classesByCode['CSX'];
		expect(csxClass).toBeDefined();
		expect(csxClass.name).toBe('C Street eXperimental');
		expect(csxClass.paxIndex).toBe(0.83);

		const specGroup = prosolo2024.classGroups.find((g) => g.id === 'spec');
		expect(specGroup!.classes).toContain(csxClass);
	});

	it('should have A Modified as baseline (1.000)', () => {
		const amClass = prosolo2024.classesByCode['AM'];
		expect(amClass).toBeDefined();
		expect(amClass.paxIndex).toBe(1.0);
	});

	it('should have H Street as lowest PAX', () => {
		const hsClass = prosolo2024.classesByCode['HS'];
		expect(hsClass).toBeDefined();
		expect(hsClass.paxIndex).toBe(0.776);

		// Verify it's the lowest
		const allIndices = prosolo2024.classGroups.flatMap((g) => g.classes).map((c) => c.paxIndex);
		const minIndex = Math.min(...allIndices);
		expect(hsClass.paxIndex).toBe(minIndex);
	});

	it('should not have XS class (Solo-only)', () => {
		const xsClass = prosolo2024.classesByCode['XS'];
		expect(xsClass).toBeUndefined();
	});

	it('should have proper class count per group', () => {
		const expectedCounts = {
			street: 9, // SS, AS, BS, CS, DS, ES, FS, GS, HS
			'street-touring': 7, // AST, BST, CST, DST, EST, GST, SST
			'street-prepared': 5, // SSP, CSP, DSP, ESP, FSP
			'street-modified': 3, // SSM, SM, SMF
			prepared: 7, // AP, BP, CP, DP, EP, FP, XP
			modified: 6, // AM, BM, CM, DM, EM, FM
			spec: 4, // SSC, FSAE, KM, CSX
			supplemental: 4, // XU, XA, XB, EVX
			cam: 3, // CAM-T, CAM-C, CAM-S
			'club-spec': 1 // CSM
		};

		for (const group of prosolo2024.classGroups) {
			expect(group.classes).toHaveLength(expectedCounts[group.id as keyof typeof expectedCounts]);
		}
	});

	it('should have different Street Touring classes than Solo', () => {
		const stGroup = prosolo2024.classGroups.find((g) => g.id === 'street-touring');
		const stCodes = stGroup!.classes.map((c) => c.code);

		// ProSolo ST classes
		expect(stCodes).toContain('AST');
		expect(stCodes).toContain('BST');
		expect(stCodes).toContain('CST');
		expect(stCodes).toContain('DST');
		expect(stCodes).toContain('EST');
		expect(stCodes).toContain('GST');
		expect(stCodes).toContain('SST');

		// Should not have Solo ST classes
		expect(stCodes).not.toContain('STR');
		expect(stCodes).not.toContain('STS');
		expect(stCodes).not.toContain('STU');
		expect(stCodes).not.toContain('STX');
		expect(stCodes).not.toContain('STH');
	});

	it('should have all classes marked as active', () => {
		const allClasses = prosolo2024.classGroups.flatMap((g) => g.classes);
		expect(allClasses.every((c) => c.isActive)).toBe(true);
	});

	it('should have unique class codes', () => {
		const allCodes = prosolo2024.classGroups.flatMap((g) => g.classes.map((c) => c.code));
		const uniqueCodes = new Set(allCodes);
		expect(allCodes).toHaveLength(uniqueCodes.size);
	});

	it('should have reasonable PAX distribution', () => {
		const allIndices = prosolo2024.classGroups.flatMap((g) => g.classes).map((c) => c.paxIndex);

		// Check range
		expect(Math.min(...allIndices)).toBeGreaterThanOrEqual(0.7);
		expect(Math.max(...allIndices)).toBeLessThanOrEqual(1.0);

		// Check that we have variety
		const uniqueIndices = new Set(allIndices);
		expect(uniqueIndices.size).toBeGreaterThan(10); // Should have many different values
	});

	it('should have BST class with specific PAX value', () => {
		const bstClass = prosolo2024.classesByCode['BST'];
		expect(bstClass).toBeDefined();
		expect(bstClass.name).toBe('B Street Touring');
		expect(bstClass.paxIndex).toBe(0.83);
	});

	it('should have Solo Spec Coupe (SSC) class', () => {
		const sscClass = prosolo2024.classesByCode['SSC'];
		expect(sscClass).toBeDefined();
		expect(sscClass.name).toBe('Solo Spec Coupe');
		expect(sscClass.paxIndex).toBe(0.803);

		const specGroup = prosolo2024.classGroups.find((g) => g.id === 'spec');
		expect(specGroup!.classes).toContain(sscClass);
	});
});
