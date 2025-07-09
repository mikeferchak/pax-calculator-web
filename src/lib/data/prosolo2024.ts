/**
 * ProSolo PAX Index Data for 2024
 * Based on official SCCA ProSolo rules and PSI values
 */

import type { PaxIndex, SoloClassGroup } from '../types.js';

// Street Category Classes
const streetClasses: SoloClassGroup = {
	id: 'street',
	name: 'Street',
	description: 'Street Category - Minimal modifications allowed',
	classes: [
		{ code: 'SS', name: 'Super Street', paxIndex: 0.844, isActive: true },
		{ code: 'AS', name: 'A Street', paxIndex: 0.83, isActive: true },
		{ code: 'BS', name: 'B Street', paxIndex: 0.821, isActive: true },
		{ code: 'CS', name: 'C Street', paxIndex: 0.806, isActive: true },
		{ code: 'DS', name: 'D Street', paxIndex: 0.806, isActive: true },
		{ code: 'ES', name: 'E Street', paxIndex: 0.787, isActive: true },
		{ code: 'FS', name: 'F Street', paxIndex: 0.815, isActive: true },
		{ code: 'GS', name: 'G Street', paxIndex: 0.787, isActive: true },
		{ code: 'HS', name: 'H Street', paxIndex: 0.776, isActive: true }
	]
};

// Street Touring Category Classes
const streetTouringClasses: SoloClassGroup = {
	id: 'street-touring',
	name: 'Street Touring',
	description: 'Street Touring Category - Limited modifications',
	classes: [
		{ code: 'AST', name: 'A Street Touring', paxIndex: 0.832, isActive: true },
		{ code: 'BST', name: 'B Street Touring', paxIndex: 0.83, isActive: true },
		{ code: 'CST', name: 'C Street Touring', paxIndex: 0.824, isActive: true },
		{ code: 'DST', name: 'D Street Touring', paxIndex: 0.814, isActive: true },
		{ code: 'EST', name: 'E Street Touring', paxIndex: 0.809, isActive: true },
		{ code: 'GST', name: 'G Street Touring', paxIndex: 0.81, isActive: true },
		{ code: 'SST', name: 'Super Street Touring', paxIndex: 0.833, isActive: true }
	]
};

// Street Prepared Category Classes
const streetPreparedClasses: SoloClassGroup = {
	id: 'street-prepared',
	name: 'Street Prepared',
	description: 'Street Prepared Category - Significant modifications allowed',
	classes: [
		{ code: 'SSP', name: 'Super Street Prepared', paxIndex: 0.863, isActive: true },
		{ code: 'CSP', name: 'C Street Prepared', paxIndex: 0.857, isActive: true },
		{ code: 'DSP', name: 'D Street Prepared', paxIndex: 0.847, isActive: true },
		{ code: 'ESP', name: 'E Street Prepared', paxIndex: 0.839, isActive: true },
		{ code: 'FSP', name: 'F Street Prepared', paxIndex: 0.826, isActive: true }
	]
};

// Street Modified Category Classes
const streetModifiedClasses: SoloClassGroup = {
	id: 'street-modified',
	name: 'Street Modified',
	description: 'Street Modified Category - Extensive modifications allowed',
	classes: [
		{ code: 'SSM', name: 'Super Street Modified', paxIndex: 0.878, isActive: true },
		{ code: 'SM', name: 'Street Modified', paxIndex: 0.869, isActive: true },
		{ code: 'SMF', name: 'Street Modified FWD', paxIndex: 0.855, isActive: true }
	]
};

// Prepared Category Classes
const preparedClasses: SoloClassGroup = {
	id: 'prepared',
	name: 'Prepared',
	description: 'Prepared Category - Race-prepared vehicles',
	classes: [
		{ code: 'AP', name: 'A Prepared', paxIndex: 0.891, isActive: true },
		{ code: 'BP', name: 'B Prepared', paxIndex: 0.865, isActive: true },
		{ code: 'CP', name: 'C Prepared', paxIndex: 0.865, isActive: true },
		{ code: 'DP', name: 'D Prepared', paxIndex: 0.865, isActive: true },
		{ code: 'EP', name: 'E Prepared', paxIndex: 0.858, isActive: true },
		{ code: 'FP', name: 'F Prepared', paxIndex: 0.877, isActive: true },
		{ code: 'XP', name: 'X Prepared', paxIndex: 0.891, isActive: true }
	]
};

// Modified Category Classes
const modifiedClasses: SoloClassGroup = {
	id: 'modified',
	name: 'Modified',
	description: 'Modified Category - Unlimited modifications',
	classes: [
		{ code: 'AM', name: 'A Modified', paxIndex: 1.0, isActive: true },
		{ code: 'BM', name: 'B Modified', paxIndex: 0.978, isActive: true },
		{ code: 'CM', name: 'C Modified', paxIndex: 0.897, isActive: true },
		{ code: 'DM', name: 'D Modified', paxIndex: 0.923, isActive: true },
		{ code: 'EM', name: 'E Modified', paxIndex: 0.933, isActive: true },
		{ code: 'FM', name: 'F Modified', paxIndex: 0.925, isActive: true }
	]
};

// Spec Category Classes
const specClasses: SoloClassGroup = {
	id: 'spec',
	name: 'Spec',
	description: 'Spec Category - Single-make classes',
	classes: [
		{ code: 'SSC', name: 'Solo Spec Coupe', paxIndex: 0.803, isActive: true },
		{ code: 'FSAE', name: 'Formula SAE', paxIndex: 0.98, isActive: true },
		{ code: 'KM', name: 'Kart Modified', paxIndex: 0.947, isActive: true },
		{ code: 'CSX', name: 'C Street eXperimental', paxIndex: 0.83, isActive: true }
	]
};

// Supplemental Category Classes
const supplementalClasses: SoloClassGroup = {
	id: 'supplemental',
	name: 'Supplemental',
	description: 'Supplemental Category - Special classes',
	classes: [
		{ code: 'XU', name: 'Xtreme Unlimited', paxIndex: 0.867, isActive: true },
		{ code: 'XA', name: 'Xtreme A', paxIndex: 0.849, isActive: true },
		{ code: 'XB', name: 'Xtreme B', paxIndex: 0.856, isActive: true },
		{ code: 'EVX', name: 'Electric Vehicle eXperimental', paxIndex: 0.83, isActive: true }
	]
};

// CAM Category Classes
const camClasses: SoloClassGroup = {
	id: 'cam',
	name: 'CAM',
	description: 'Classic American Muscle',
	classes: [
		{ code: 'CAM-T', name: 'CAM Traditional', paxIndex: 0.819, isActive: true },
		{ code: 'CAM-C', name: 'CAM Contemporary', paxIndex: 0.832, isActive: true },
		{ code: 'CAM-S', name: 'CAM Sport', paxIndex: 0.849, isActive: true }
	]
};

// Club Spec Classes
const clubSpecClasses: SoloClassGroup = {
	id: 'club-spec',
	name: 'Club Spec',
	description: 'Club Spec Classes',
	classes: [{ code: 'CSM', name: 'Club Spec Mustang', paxIndex: 0.83, isActive: true }]
};

// Create class lookup map
const allClasses = [
	...streetClasses.classes,
	...streetTouringClasses.classes,
	...streetPreparedClasses.classes,
	...streetModifiedClasses.classes,
	...preparedClasses.classes,
	...modifiedClasses.classes,
	...specClasses.classes,
	...supplementalClasses.classes,
	...camClasses.classes,
	...clubSpecClasses.classes
];

const classesByCode = allClasses.reduce(
	(acc, soloClass) => {
		acc[soloClass.code] = soloClass;
		return acc;
	},
	{} as Record<string, (typeof allClasses)[0]>
);

export const prosolo2024: PaxIndex = {
	year: 2024,
	indexType: 'ProSolo',
	version: '2024.1.0',
	releaseDate: '2024-01-01',
	lastUpdated: '2024-01-01',
	classGroups: [
		streetClasses,
		streetTouringClasses,
		streetPreparedClasses,
		streetModifiedClasses,
		preparedClasses,
		modifiedClasses,
		specClasses,
		supplementalClasses,
		camClasses,
		clubSpecClasses
	],
	classesByCode
};
