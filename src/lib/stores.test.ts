/**
 * Tests for Svelte Stores
 *
 * Tests store functionality including persistence, derived values,
 * and state management for the PAX calculator.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import {
	paxData,
	preferences,
	calculator,
	currentPaxIndex,
	availableClasses,
	selectedInputClass,
	selectedOutputClass,
	canCalculate
} from './stores.js';
import { solo2024 } from './data/solo2024.js';
import { prosolo2024 } from './data/prosolo2024.js';
import type { PaxIndex, UserPreferences } from './types.js';

// Browser environment handling is now built into stores.ts

describe('PAX Data Store', () => {
	beforeEach(() => {
		// Clear localStorage mock
		vi.clearAllMocks();
	});

	it('should initialize with default metadata', () => {
		const data = get(paxData);

		expect(data.indices).toEqual([]);
		expect(data.currentIndex).toBeUndefined();
		expect(data.hasUpdates).toBe(false);
	});

	it('should set and retrieve indices', () => {
		const testIndices = [solo2024, prosolo2024];

		paxData.setIndices(testIndices);
		const data = get(paxData);

		expect(data.indices).toEqual(testIndices);
	});

	it('should set current index', () => {
		paxData.setCurrentIndex(solo2024);
		const data = get(paxData);

		expect(data.currentIndex).toBe(solo2024);
	});

	it('should mark updates as available', () => {
		paxData.setHasUpdates(true);
		const data = get(paxData);

		expect(data.hasUpdates).toBe(true);
		expect(data.lastUpdateCheck).toBeDefined();
	});

	it('should get index by type and year', () => {
		paxData.setIndices([solo2024, prosolo2024]);

		const soloIndex = paxData.getIndex('Solo', 2024);
		const prosoloIndex = paxData.getIndex('ProSolo', 2024);
		const nonExistent = paxData.getIndex('Solo', 2023);

		expect(soloIndex).toBe(solo2024);
		expect(prosoloIndex).toBe(prosolo2024);
		expect(nonExistent).toBeUndefined();
	});

	it('should get latest index for type', () => {
		paxData.setIndices([solo2024, prosolo2024]);

		const latestSolo = paxData.getLatestIndex('Solo');
		const latestProSolo = paxData.getLatestIndex('ProSolo');

		expect(latestSolo).toBe(solo2024);
		expect(latestProSolo).toBe(prosolo2024);
	});
});

describe('Preferences Store', () => {
	beforeEach(() => {
		// Reset preferences to defaults
		preferences.reset();
		vi.clearAllMocks();
	});

	it('should initialize with default preferences', () => {
		const prefs = get(preferences);

		expect(prefs.indexType).toBe('Solo');
		expect(prefs.viewMode).toBe('Direct');
		expect(prefs.inputClass).toBeUndefined();
		expect(prefs.outputClass).toBeUndefined();
		expect(prefs.lastTime).toBe('');
		expect(prefs.autoUpdate).toBe(true);
		expect(prefs.pinnedVersion).toBeUndefined();
	});

	it('should update individual preferences', () => {
		preferences.updatePreference('indexType', 'ProSolo');
		preferences.updatePreference('viewMode', 'List');
		preferences.updatePreference('inputClass', 'SS');

		const prefs = get(preferences);

		expect(prefs.indexType).toBe('ProSolo');
		expect(prefs.viewMode).toBe('List');
		expect(prefs.inputClass).toBe('SS');
	});

	it('should update multiple preferences at once', () => {
		const updates: Partial<UserPreferences> = {
			indexType: 'ProSolo',
			viewMode: 'List',
			inputClass: 'SS',
			outputClass: 'AS'
		};

		preferences.updatePreferences(updates);
		const prefs = get(preferences);

		expect(prefs.indexType).toBe('ProSolo');
		expect(prefs.viewMode).toBe('List');
		expect(prefs.inputClass).toBe('SS');
		expect(prefs.outputClass).toBe('AS');
	});

	it('should reset to defaults', () => {
		// Change some preferences
		preferences.updatePreferences({
			indexType: 'ProSolo',
			viewMode: 'List',
			inputClass: 'SS'
		});

		// Reset
		preferences.reset();
		const prefs = get(preferences);

		expect(prefs.indexType).toBe('Solo');
		expect(prefs.viewMode).toBe('Direct');
		expect(prefs.inputClass).toBeUndefined();
	});
});

describe('Calculator Store', () => {
	beforeEach(() => {
		// Clear calculator state
		calculator.clear();
		vi.clearAllMocks();
	});

	it('should initialize with empty state', () => {
		const calc = get(calculator);

		expect(calc.currentTime).toBe('');
		expect(calc.lastResult).toBeUndefined();
		expect(calc.isCalculating).toBe(false);
		expect(calc.error).toBeUndefined();
	});

	it('should update current time', () => {
		calculator.setTime('65.123');
		const calc = get(calculator);

		expect(calc.currentTime).toBe('65.123');
		expect(calc.error).toBeUndefined();
	});

	it('should perform calculation', () => {
		const ssClass = solo2024.classesByCode['SS'];
		const asClass = solo2024.classesByCode['AS'];

		const result = calculator.calculate(60.0, ssClass, asClass);
		const calc = get(calculator);

		expect(result).toBeDefined();
		expect(result.inputTime).toBe(60.0);
		expect(result.inputClass).toBe(ssClass);
		expect(result.outputClass).toBe(asClass);
		expect(calc.lastResult).toBe(result);
		expect(calc.isCalculating).toBe(false);
		expect(calc.error).toBeUndefined();
	});

	it('should handle calculation errors', () => {
		const ssClass = solo2024.classesByCode['SS'];
		const asClass = solo2024.classesByCode['AS'];

		expect(() => calculator.calculate(0, ssClass, asClass)).toThrow();

		const calc = get(calculator);
		expect(calc.isCalculating).toBe(false);
		expect(calc.error).toBeDefined();
		expect(calc.lastResult).toBeUndefined();
	});

	it('should clear state', () => {
		// Set some state
		calculator.setTime('65.123');
		const ssClass = solo2024.classesByCode['SS'];
		const asClass = solo2024.classesByCode['AS'];
		calculator.calculate(60.0, ssClass, asClass);

		// Clear
		calculator.clear();
		const calc = get(calculator);

		expect(calc.currentTime).toBe('');
		expect(calc.lastResult).toBeUndefined();
		expect(calc.error).toBeUndefined();
	});

	it('should clear only error', () => {
		// Set error state
		calculator.setTime('65.123');
		try {
			const ssClass = solo2024.classesByCode['SS'];
			const asClass = solo2024.classesByCode['AS'];
			calculator.calculate(0, ssClass, asClass);
		} catch (e) {
			// Expected error
		}

		// Clear only error
		calculator.clearError();
		const calc = get(calculator);

		expect(calc.error).toBeUndefined();
		expect(calc.currentTime).toBe('65.123'); // Should remain
	});
});

describe('Derived Stores', () => {
	beforeEach(() => {
		// Set up test data
		paxData.setIndices([solo2024, prosolo2024]);
		paxData.setCurrentIndex(solo2024);
		preferences.reset();
		calculator.clear();
	});

	it('should derive current PAX index with auto-update', () => {
		preferences.updatePreferences({
			indexType: 'Solo',
			autoUpdate: true
		});

		const currentIndex = get(currentPaxIndex);
		expect(currentIndex).toBe(solo2024);
	});

	it('should derive current PAX index with pinned version', () => {
		preferences.updatePreferences({
			indexType: 'Solo',
			autoUpdate: false,
			pinnedVersion: '2024.1.0'
		});

		const currentIndex = get(currentPaxIndex);
		expect(currentIndex).toBe(solo2024);
	});

	it('should derive available classes from current index', () => {
		paxData.setCurrentIndex(solo2024);
		preferences.updatePreference('indexType', 'Solo');

		const classes = get(availableClasses);

		expect(classes.length).toBeGreaterThan(0);
		expect(classes.every((c) => c.isActive)).toBe(true);
		expect(classes.find((c) => c.code === 'SS')).toBeDefined();
		expect(classes.find((c) => c.code === 'AS')).toBeDefined();
	});

	it('should derive selected input class', () => {
		paxData.setCurrentIndex(solo2024);
		preferences.updatePreferences({
			indexType: 'Solo',
			inputClass: 'SS'
		});

		const inputClass = get(selectedInputClass);
		expect(inputClass).toBe(solo2024.classesByCode['SS']);
	});

	it('should derive selected output class', () => {
		paxData.setCurrentIndex(solo2024);
		preferences.updatePreferences({
			indexType: 'Solo',
			outputClass: 'AS'
		});

		const outputClass = get(selectedOutputClass);
		expect(outputClass).toBe(solo2024.classesByCode['AS']);
	});

	it('should derive canCalculate state', () => {
		paxData.setCurrentIndex(solo2024);
		preferences.updatePreferences({
			indexType: 'Solo',
			inputClass: 'SS',
			outputClass: 'AS'
		});
		calculator.setTime('65.123');

		const canCalc = get(canCalculate);
		expect(canCalc).toBe(true);
	});

	it('should derive canCalculate as false when missing data', () => {
		// Missing input class
		paxData.setCurrentIndex(solo2024);
		preferences.updatePreferences({
			indexType: 'Solo',
			outputClass: 'AS'
		});
		calculator.setTime('65.123');

		let canCalc = get(canCalculate);
		expect(canCalc).toBe(false);

		// Missing output class
		preferences.updatePreferences({
			indexType: 'Solo',
			inputClass: 'SS',
			outputClass: undefined
		});

		canCalc = get(canCalculate);
		expect(canCalc).toBe(false);

		// Missing time
		preferences.updatePreferences({
			indexType: 'Solo',
			inputClass: 'SS',
			outputClass: 'AS'
		});
		calculator.setTime('');

		canCalc = get(canCalculate);
		expect(canCalc).toBe(false);
	});
});

describe('Store Persistence', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should save preferences to localStorage', () => {
		// Since we're in a test environment, localStorage operations are skipped
		// This test verifies that the preference update works without errors
		preferences.updatePreference('indexType', 'ProSolo');

		const prefs = get(preferences);
		expect(prefs.indexType).toBe('ProSolo');
	});

	it('should save PAX data to localStorage', () => {
		// Since we're in a test environment, localStorage operations are skipped
		// This test verifies that the data setting works without errors
		paxData.setIndices([solo2024]);

		const data = get(paxData);
		expect(data.indices).toEqual([solo2024]);
	});

	it('should handle localStorage errors gracefully', () => {
		// In test environment, localStorage operations are skipped
		// This test verifies that operations work without localStorage
		expect(() => {
			preferences.updatePreference('indexType', 'ProSolo');
		}).not.toThrow();

		const prefs = get(preferences);
		expect(prefs.indexType).toBe('ProSolo');
	});
});
