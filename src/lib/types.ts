/**
 * PAX Calculator Data Types
 *
 * Based on the native app structure, these types define the core data models
 * for PAX calculations across Solo and ProSolo events.
 */

/**
 * Represents a racing class with its PAX index value
 */
export interface SoloClass {
	/** Class code (e.g., "SS", "AS", "BS") */
	code: string;
	/** Display name for the class */
	name: string;
	/** PAX index value (typically 0.7-1.0) */
	paxIndex: number;
	/** Whether this class is available in the current index */
	isActive: boolean;
}

/**
 * Groups of related racing classes
 */
export interface SoloClassGroup {
	/** Group identifier */
	id: string;
	/** Display name for the group */
	name: string;
	/** Description of the group */
	description: string;
	/** Classes within this group */
	classes: SoloClass[];
}

/**
 * Index type for different event formats
 */
export type IndexType = 'Solo' | 'ProSolo';

/**
 * View mode for the calculator interface
 */
export type ViewMode = 'Direct' | 'List';

/**
 * Complete PAX index dataset for a specific year and event type
 */
export interface PaxIndex {
	/** Year of the index (e.g., 2024, 2025) */
	year: number;
	/** Event type (Solo or ProSolo) */
	indexType: IndexType;
	/** Version/revision identifier */
	version: string;
	/** Release date */
	releaseDate: string;
	/** Last updated date */
	lastUpdated: string;
	/** All class groups in this index */
	classGroups: SoloClassGroup[];
	/** Flat map of all classes by code for quick lookup */
	classesByCode: Record<string, SoloClass>;
}

/**
 * Metadata about available PAX indices
 */
export interface PaxIndexMetadata {
	/** Available indices */
	indices: PaxIndex[];
	/** Currently selected index */
	currentIndex: PaxIndex | undefined;
	/** Last check for updates */
	lastUpdateCheck: string;
	/** Whether updates are available */
	hasUpdates: boolean;
}

/**
 * User preferences for PAX calculator
 */
export interface UserPreferences {
	/** Preferred index type */
	indexType: IndexType;
	/** Preferred view mode */
	viewMode: ViewMode;
	/** Selected input class */
	inputClass: string | undefined;
	/** Selected output class */
	outputClass: string | undefined;
	/** Last entered time */
	lastTime: string;
	/** Whether to auto-update to latest index */
	autoUpdate: boolean;
	/** Pinned index version (if not auto-updating) */
	pinnedVersion: string | undefined;
}

/**
 * Result of a PAX calculation
 */
export interface PaxCalculationResult {
	/** Original input time */
	inputTime: number;
	/** Input class */
	inputClass: SoloClass;
	/** Calculated output time */
	outputTime: number;
	/** Output class */
	outputClass: SoloClass;
	/** Time difference (output - input) */
	timeDifference: number;
	/** Whether the output time is faster (negative difference) */
	isFaster: boolean;
	/** Calculation timestamp */
	calculatedAt: string;
}

/**
 * Validation result for PAX data
 */
export interface PaxValidationResult {
	/** Whether the data is valid */
	isValid: boolean;
	/** Validation errors */
	errors: string[];
	/** Validation warnings */
	warnings: string[];
	/** Number of classes validated */
	classCount: number;
	/** Number of groups validated */
	groupCount: number;
}

/**
 * Update notification for new PAX indices
 */
export interface PaxUpdateNotification {
	/** Available update version */
	version: string;
	/** Index type being updated */
	indexType: IndexType;
	/** Release date of update */
	releaseDate: string;
	/** Summary of changes */
	changesSummary: string;
	/** Whether this is a major update */
	isMajorUpdate: boolean;
}
