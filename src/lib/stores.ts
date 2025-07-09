/**
 * Svelte Stores for PAX Calculator State Management
 *
 * Uses Svelte 5 runes for reactive state management instead of top-down props.
 * Stores handle PAX data, user preferences, and calculation results.
 */

import { writable, derived, get } from 'svelte/store';

// Helper function to check if we're in browser environment
function isBrowser(): boolean {
	try {
		// Try to import from SvelteKit environment
		const { browser } = require('$app/environment');
		return browser;
	} catch {
		// Fallback for test environment
		return typeof window !== 'undefined';
	}
}
import type {
	PaxIndex,
	PaxIndexMetadata,
	UserPreferences,
	IndexType,
	ViewMode,
	PaxCalculationResult,
	SoloClass
} from './types.js';
import { calculatePaxTime, findClassByCode } from './pax-calculator.js';

// Local storage keys
const STORAGE_KEYS = {
	PREFERENCES: 'pax-calculator-preferences',
	PAX_DATA: 'pax-calculator-data',
	LAST_CALCULATION: 'pax-calculator-last-calculation'
} as const;

/**
 * Default user preferences
 */
const defaultPreferences: UserPreferences = {
	indexType: 'Solo',
	viewMode: 'Direct',
	inputClass: undefined,
	outputClass: undefined,
	lastTime: '',
	autoUpdate: true,
	pinnedVersion: undefined
};

/**
 * Load data from localStorage with type safety
 */
function loadFromStorage<T>(key: string, defaultValue: T): T {
	if (!isBrowser()) return defaultValue;

	try {
		const stored = localStorage.getItem(key);
		return stored ? JSON.parse(stored) : defaultValue;
	} catch (error) {
		console.warn(`Failed to load ${key} from localStorage:`, error);
		return defaultValue;
	}
}

/**
 * Save data to localStorage with error handling
 */
function saveToStorage<T>(key: string, value: T): void {
	if (!isBrowser()) return;

	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (error) {
		console.warn(`Failed to save ${key} to localStorage:`, error);
	}
}

/**
 * PAX Index Data Store
 * Manages available PAX indices and current selection
 */
function createPaxDataStore() {
	const defaultMetadata: PaxIndexMetadata = {
		indices: [],
		currentIndex: undefined,
		lastUpdateCheck: '',
		hasUpdates: false
	};

	const { subscribe, set, update } = writable<PaxIndexMetadata>(
		loadFromStorage(STORAGE_KEYS.PAX_DATA, defaultMetadata)
	);

	return {
		subscribe,

		/**
		 * Set available PAX indices
		 */
		setIndices: (indices: PaxIndex[]) => {
			update((metadata) => {
				const updated = { ...metadata, indices };
				saveToStorage(STORAGE_KEYS.PAX_DATA, updated);
				return updated;
			});
		},

		/**
		 * Set current active PAX index
		 */
		setCurrentIndex: (index: PaxIndex | undefined) => {
			update((metadata) => {
				const updated = { ...metadata, currentIndex: index };
				saveToStorage(STORAGE_KEYS.PAX_DATA, updated);
				return updated;
			});
		},

		/**
		 * Mark that updates are available
		 */
		setHasUpdates: (hasUpdates: boolean) => {
			update((metadata) => {
				const updated = { ...metadata, hasUpdates, lastUpdateCheck: new Date().toISOString() };
				saveToStorage(STORAGE_KEYS.PAX_DATA, updated);
				return updated;
			});
		},

		/**
		 * Get index by type and year
		 */
		getIndex: (indexType: IndexType, year: number): PaxIndex | undefined => {
			return get({ subscribe }).indices.find(
				(index) => index.indexType === indexType && index.year === year
			);
		},

		/**
		 * Get latest index for a given type
		 */
		getLatestIndex: (indexType: IndexType): PaxIndex | undefined => {
			return get({ subscribe })
				.indices.filter((index) => index.indexType === indexType)
				.sort((a, b) => b.year - a.year)[0];
		}
	};
}

/**
 * User Preferences Store
 * Manages user settings and preferences
 */
function createPreferencesStore() {
	const { subscribe, set, update } = writable<UserPreferences>(
		loadFromStorage(STORAGE_KEYS.PREFERENCES, defaultPreferences)
	);

	return {
		subscribe,

		/**
		 * Update a specific preference
		 */
		updatePreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
			update((prefs) => {
				const updated = { ...prefs, [key]: value };
				saveToStorage(STORAGE_KEYS.PREFERENCES, updated);
				return updated;
			});
		},

		/**
		 * Update multiple preferences at once
		 */
		updatePreferences: (updates: Partial<UserPreferences>) => {
			update((prefs) => {
				const updated = { ...prefs, ...updates };
				saveToStorage(STORAGE_KEYS.PREFERENCES, updated);
				return updated;
			});
		},

		/**
		 * Reset preferences to defaults
		 */
		reset: () => {
			set(defaultPreferences);
			saveToStorage(STORAGE_KEYS.PREFERENCES, defaultPreferences);
		}
	};
}

/**
 * Calculator State Store
 * Manages current calculation state and results
 */
function createCalculatorStore() {
	const { subscribe, set, update } = writable<{
		currentTime: string;
		lastResult: PaxCalculationResult | undefined;
		isCalculating: boolean;
		error: string | undefined;
	}>({
		currentTime: '',
		lastResult: loadFromStorage(STORAGE_KEYS.LAST_CALCULATION, undefined),
		isCalculating: false,
		error: undefined
	});

	return {
		subscribe,

		/**
		 * Update current time input
		 */
		setTime: (time: string) => {
			update((state) => ({ ...state, currentTime: time, error: undefined }));
		},

		/**
		 * Perform PAX calculation
		 */
		calculate: (inputTime: number, inputClass: SoloClass, outputClass: SoloClass) => {
			update((state) => ({ ...state, isCalculating: true, error: undefined }));

			try {
				const result = calculatePaxTime(inputTime, inputClass, outputClass);

				update((state) => ({
					...state,
					lastResult: result,
					isCalculating: false
				}));

				// Save last calculation
				saveToStorage(STORAGE_KEYS.LAST_CALCULATION, result);

				return result;
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Calculation failed';

				update((state) => ({
					...state,
					isCalculating: false,
					error: errorMessage
				}));

				throw error;
			}
		},

		/**
		 * Clear calculation state
		 */
		clear: () => {
			update((state) => ({
				...state,
				currentTime: '',
				lastResult: undefined,
				error: undefined
			}));
		},

		/**
		 * Clear error state
		 */
		clearError: () => {
			update((state) => ({ ...state, error: undefined }));
		}
	};
}

// Create store instances
export const paxData = createPaxDataStore();
export const preferences = createPreferencesStore();
export const calculator = createCalculatorStore();

/**
 * Derived store for current PAX index based on preferences
 */
export const currentPaxIndex = derived([paxData, preferences], ([$paxData, $preferences]) => {
	const { currentIndex } = $paxData;
	const { indexType, autoUpdate, pinnedVersion } = $preferences;

	// If auto-update is enabled, use the latest index of the preferred type
	if (autoUpdate) {
		return paxData.getLatestIndex(indexType);
	}

	// If pinned version is set, find that specific version
	if (pinnedVersion) {
		return $paxData.indices.find(
			(index) => index.indexType === indexType && index.version === pinnedVersion
		);
	}

	// Fall back to current index if it matches the preferred type
	return currentIndex?.indexType === indexType ? currentIndex : undefined;
});

/**
 * Derived store for available classes in current index
 */
export const availableClasses = derived([currentPaxIndex], ([$currentPaxIndex]) => {
	if (!$currentPaxIndex) return [];

	return $currentPaxIndex.classGroups
		.flatMap((group) => group.classes)
		.filter((soloClass) => soloClass.isActive)
		.sort((a, b) => a.code.localeCompare(b.code));
});

/**
 * Derived store for selected input class
 */
export const selectedInputClass = derived(
	[currentPaxIndex, preferences],
	([$currentPaxIndex, $preferences]) => {
		if (!$currentPaxIndex || !$preferences.inputClass) return undefined;
		return findClassByCode($preferences.inputClass, $currentPaxIndex);
	}
);

/**
 * Derived store for selected output class
 */
export const selectedOutputClass = derived(
	[currentPaxIndex, preferences],
	([$currentPaxIndex, $preferences]) => {
		if (!$currentPaxIndex || !$preferences.outputClass) return undefined;
		return findClassByCode($preferences.outputClass, $currentPaxIndex);
	}
);

/**
 * Derived store for whether calculation is possible
 */
export const canCalculate = derived(
	[selectedInputClass, selectedOutputClass, calculator],
	([$selectedInputClass, $selectedOutputClass, $calculator]) => {
		return !!(
			$selectedInputClass &&
			$selectedOutputClass &&
			$calculator.currentTime.trim() &&
			!$calculator.isCalculating
		);
	}
);
