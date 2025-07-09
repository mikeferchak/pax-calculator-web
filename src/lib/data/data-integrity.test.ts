/**
 * Tests for PAX Data Integrity
 *
 * Validates that our PAX data files are structured correctly
 * and contain valid data according to our type definitions.
 */

import { describe, it, expect } from 'vitest';
import { solo2024 } from './solo2024.js';
import { prosolo2024 } from './prosolo2024.js';
import { allIndices, getIndexByTypeAndYear, getLatestIndex, getAvailableYears } from './index.js';
import { validatePaxIndex } from '../pax-calculator.js';

describe('Solo 2024 Data Integrity', () => {
	it('should have correct metadata', () => {
		expect(solo2024.year).toBe(2024);
		expect(solo2024.indexType).toBe('Solo');
		expect(solo2024.version).toBe('2024.1.0');
		expect(solo2024.releaseDate).toBeDefined();
		expect(solo2024.lastUpdated).toBeDefined();
	});

	it('should pass validation', () => {
		const result = validatePaxIndex(solo2024);

		expect(result.isValid).toBe(true);
		expect(result.errors).toHaveLength(0);
		expect(result.classCount).toBeGreaterThan(0);
		expect(result.groupCount).toBeGreaterThan(0);
	});

	it('should have all required class groups', () => {
		const groupIds = solo2024.classGroups.map((group) => group.id);

		expect(groupIds).toContain('street');
		expect(groupIds).toContain('street-touring');
		expect(groupIds).toContain('street-prepared');
		expect(groupIds).toContain('street-modified');
		expect(groupIds).toContain('prepared');
		expect(groupIds).toContain('modified');
		expect(groupIds).toContain('spec');
		expect(groupIds).toContain('supplemental');
		expect(groupIds).toContain('cam');
	});

	it('should have expected street classes', () => {
		const streetGroup = solo2024.classGroups.find((g) => g.id === 'street');
		const classCodes = streetGroup?.classes.map((c) => c.code) || [];

		expect(classCodes).toContain('SS');
		expect(classCodes).toContain('AS');
		expect(classCodes).toContain('BS');
		expect(classCodes).toContain('CS');
		expect(classCodes).toContain('DS');
		expect(classCodes).toContain('ES');
		expect(classCodes).toContain('FS');
		expect(classCodes).toContain('GS');
		expect(classCodes).toContain('HS');
	});

	it('should have valid PAX indices', () => {
		const allClasses = solo2024.classGroups.flatMap((group) => group.classes);

		for (const soloClass of allClasses) {
			expect(soloClass.paxIndex).toBeGreaterThan(0);
			expect(soloClass.paxIndex).toBeLessThanOrEqual(1.0);
			expect(soloClass.code).toBeDefined();
			expect(soloClass.name).toBeDefined();
			expect(typeof soloClass.isActive).toBe('boolean');
		}
	});

	it('should have consistent classesByCode lookup', () => {
		const allClasses = solo2024.classGroups.flatMap((group) => group.classes);

		expect(Object.keys(solo2024.classesByCode)).toHaveLength(allClasses.length);

		for (const soloClass of allClasses) {
			expect(solo2024.classesByCode[soloClass.code]).toBe(soloClass);
		}
	});

	it('should have no duplicate class codes', () => {
		const allClasses = solo2024.classGroups.flatMap((group) => group.classes);
		const classCodes = allClasses.map((c) => c.code);
		const uniqueCodes = [...new Set(classCodes)];

		expect(classCodes).toHaveLength(uniqueCodes.length);
	});
});

describe('ProSolo 2024 Data Integrity', () => {
	it('should have correct metadata', () => {
		expect(prosolo2024.year).toBe(2024);
		expect(prosolo2024.indexType).toBe('ProSolo');
		expect(prosolo2024.version).toBe('2024.1.0');
		expect(prosolo2024.releaseDate).toBeDefined();
		expect(prosolo2024.lastUpdated).toBeDefined();
	});

	it('should pass validation', () => {
		const result = validatePaxIndex(prosolo2024);

		expect(result.isValid).toBe(true);
		expect(result.errors).toHaveLength(0);
		expect(result.classCount).toBeGreaterThan(0);
		expect(result.groupCount).toBeGreaterThan(0);
	});

	it('should have ProSolo-specific classes', () => {
		const streetTouringGroup = prosolo2024.classGroups.find((g) => g.id === 'street-touring');
		const classCodes = streetTouringGroup?.classes.map((c) => c.code) || [];

		// ProSolo has different street touring classes
		expect(classCodes).toContain('AST');
		expect(classCodes).toContain('BST');
		expect(classCodes).toContain('CST');
		expect(classCodes).toContain('DST');
		expect(classCodes).toContain('EST');
		expect(classCodes).toContain('GST');
		expect(classCodes).toContain('SST');
	});

	it('should have valid PAX indices', () => {
		const allClasses = prosolo2024.classGroups.flatMap((group) => group.classes);

		for (const soloClass of allClasses) {
			expect(soloClass.paxIndex).toBeGreaterThan(0);
			expect(soloClass.paxIndex).toBeLessThanOrEqual(1.0);
			expect(soloClass.code).toBeDefined();
			expect(soloClass.name).toBeDefined();
			expect(typeof soloClass.isActive).toBe('boolean');
		}
	});

	it('should have consistent classesByCode lookup', () => {
		const allClasses = prosolo2024.classGroups.flatMap((group) => group.classes);

		expect(Object.keys(prosolo2024.classesByCode)).toHaveLength(allClasses.length);

		for (const soloClass of allClasses) {
			expect(prosolo2024.classesByCode[soloClass.code]).toBe(soloClass);
		}
	});

	it('should have Club Spec classes', () => {
		const clubSpecGroup = prosolo2024.classGroups.find((g) => g.id === 'club-spec');
		expect(clubSpecGroup).toBeDefined();

		const classCodes = clubSpecGroup?.classes.map((c) => c.code) || [];
		expect(classCodes).toContain('CSM');
	});
});

describe('Data Index Functions', () => {
	it('should include both indices in allIndices', () => {
		expect(allIndices).toHaveLength(2);
		expect(allIndices).toContain(solo2024);
		expect(allIndices).toContain(prosolo2024);
	});

	it('should find index by type and year', () => {
		expect(getIndexByTypeAndYear('Solo', 2024)).toBe(solo2024);
		expect(getIndexByTypeAndYear('ProSolo', 2024)).toBe(prosolo2024);
		expect(getIndexByTypeAndYear('Solo', 2023)).toBeUndefined();
		expect(getIndexByTypeAndYear('ProSolo', 2023)).toBeUndefined();
	});

	it('should get latest index for each type', () => {
		expect(getLatestIndex('Solo')).toBe(solo2024);
		expect(getLatestIndex('ProSolo')).toBe(prosolo2024);
	});

	it('should get available years for each type', () => {
		expect(getAvailableYears('Solo')).toEqual([2024]);
		expect(getAvailableYears('ProSolo')).toEqual([2024]);
	});
});

describe('Data Consistency Between Indices', () => {
	it('should have similar base classes in both indices', () => {
		const soloStreetClasses =
			solo2024.classGroups.find((g) => g.id === 'street')?.classes.map((c) => c.code) || [];
		const prosoloStreetClasses =
			prosolo2024.classGroups.find((g) => g.id === 'street')?.classes.map((c) => c.code) || [];

		// Street classes should be mostly the same
		const commonClasses = ['SS', 'AS', 'BS', 'CS', 'DS', 'ES', 'FS', 'GS', 'HS'];

		for (const classCode of commonClasses) {
			expect(soloStreetClasses).toContain(classCode);
			expect(prosoloStreetClasses).toContain(classCode);
		}
	});

	it('should have different street touring classes', () => {
		const soloSTClasses =
			solo2024.classGroups.find((g) => g.id === 'street-touring')?.classes.map((c) => c.code) || [];
		const prosoloSTClasses =
			prosolo2024.classGroups.find((g) => g.id === 'street-touring')?.classes.map((c) => c.code) ||
			[];

		// Solo has STR, STS, STU, STX, STH
		expect(soloSTClasses).toContain('STR');
		expect(soloSTClasses).toContain('STS');
		expect(soloSTClasses).toContain('STU');
		expect(soloSTClasses).toContain('STX');
		expect(soloSTClasses).toContain('STH');

		// ProSolo has AST, BST, CST, DST, EST, GST, SST
		expect(prosoloSTClasses).toContain('AST');
		expect(prosoloSTClasses).toContain('BST');
		expect(prosoloSTClasses).toContain('CST');
		expect(prosoloSTClasses).toContain('DST');
		expect(prosoloSTClasses).toContain('EST');
		expect(prosoloSTClasses).toContain('GST');
		expect(prosoloSTClasses).toContain('SST');
	});

	it('should have similar PAX values for common classes', () => {
		const commonClasses = ['SS', 'AS', 'BS', 'CS', 'DS', 'ES', 'FS', 'GS', 'HS'];

		for (const classCode of commonClasses) {
			const soloClass = solo2024.classesByCode[classCode];
			const prosoloClass = prosolo2024.classesByCode[classCode];

			expect(soloClass).toBeDefined();
			expect(prosoloClass).toBeDefined();

			// PAX values should be similar (within 0.1 difference)
			expect(Math.abs(soloClass.paxIndex - prosoloClass.paxIndex)).toBeLessThan(0.1);
		}
	});

	it('should have all classes marked as active', () => {
		const soloClasses = solo2024.classGroups.flatMap((group) => group.classes);
		const prosoloClasses = prosolo2024.classGroups.flatMap((group) => group.classes);

		for (const soloClass of soloClasses) {
			expect(soloClass.isActive).toBe(true);
		}

		for (const soloClass of prosoloClasses) {
			expect(soloClass.isActive).toBe(true);
		}
	});
});

describe('PAX Index Ranges', () => {
	it('should have AM class with PAX index 1.000', () => {
		const soloAM = solo2024.classesByCode['AM'];
		const prosoloAM = prosolo2024.classesByCode['AM'];

		expect(soloAM.paxIndex).toBe(1.0);
		expect(prosoloAM.paxIndex).toBe(1.0);
	});

	it('should have reasonable PAX index distribution', () => {
		const soloIndices = solo2024.classGroups
			.flatMap((group) => group.classes)
			.map((c) => c.paxIndex);

		const minPax = Math.min(...soloIndices);
		const maxPax = Math.max(...soloIndices);

		expect(minPax).toBeGreaterThan(0.7);
		expect(maxPax).toBeLessThanOrEqual(1.0);
		expect(maxPax).toBe(1.0); // AM should be the baseline
	});
});
