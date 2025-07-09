# PAX Data Extraction Summary

## Overview

Successfully extracted PAX data from the native iOS/macOS PAX Calculator app and converted it to TypeScript format for the web application.

## Source Files

- **Native App**: `/Users/ferchak/src/PaxCalculator/Shared/Data/`
  - `Solo2024.swift` - Solo event PAX indices
  - `ProSolo2024.swift` - ProSolo event PAX indices

## Generated Files

- **Web App**: `/Users/ferchak/src/pax-calculator-web/src/lib/data/`
  - `solo2024.ts` - Solo 2024 PAX index data
  - `prosolo2024.ts` - ProSolo 2024 PAX index data
  - `index.ts` - Data exports and utility functions

## Data Structure Mapping

### Swift to TypeScript Mapping

```swift
// Swift native app structure
let solo2024: [SoloClassGroup: [SoloClass: Double]] = [
    .Street: [
        .SS: 0.835,
        .AS: 0.824,
        // ...
    ]
]
```

```typescript
// TypeScript web app structure
export const solo2024: PaxIndex = {
    year: 2024,
    indexType: 'Solo',
    version: '2024.1',
    classGroups: [
        {
            id: 'street',
            name: 'Street',
            description: 'Street category classes...',
            classes: [
                { code: 'SS', name: 'Super Street', paxIndex: 0.835, isActive: true },
                { code: 'AS', name: 'A Street', paxIndex: 0.824, isActive: true },
                // ...
            ]
        }
    ],
    classesByCode: { 'SS': {...}, 'AS': {...} }
}
```

## Class Groups and Organization

### Solo 2024 Classes

| Group           | Classes                                              | Count |
| --------------- | ---------------------------------------------------- | ----- |
| Street          | SS, AS, BS, CS, DS, ES, FS, GS, HS                   | 9     |
| Street Touring  | STU, STR, STX, STS, STH, SST                         | 6     |
| Street Prepared | SSP, CSP, DSP, ESP, FSP                              | 5     |
| Street Modified | SSM, SM, SMF                                         | 3     |
| Prepared        | XP, CP, DP, EP, FP                                   | 5     |
| Modified        | AM, BM, CM, DM, EM, FM, KM                           | 7     |
| Spec            | CSM, CSX, SSC                                        | 3     |
| Supplemental    | CAM-C, CAM-T, CAM-S, FSAE, XA, XB, XU, EVX, HCS, HCR | 10    |

**Total Solo Classes**: 48

### ProSolo 2024 Classes

ProSolo includes all Solo classes plus additional 4-cylinder variants:

- Additional \*4 classes: SS4, AS4, BS4, DS4, FS4, STU4, STH4, SST4, SSP4, SSM4, SM4, XP4, FP4, XA4, XB4, XU4, EVX4
- Missing from ProSolo: HCS, HCR (Heritage Classic classes)

**Total ProSolo Classes**: 63

## PAX Index Ranges

### Solo 2024

- **Fastest**: AM (1.000) - A Modified
- **Slowest**: HS (0.786) - H Street
- **Range**: 0.786 - 1.000

### ProSolo 2024

- **Fastest**: AM (1.000) - A Modified
- **Slowest**: HS (0.777) - H Street
- **Range**: 0.777 - 1.000

## Key Differences: Solo vs ProSolo

1. **4-Cylinder Classes**: ProSolo includes separate indices for 4-cylinder variants
2. **PAX Values**: Generally different values between Solo and ProSolo for the same class
3. **Heritage Classes**: Solo includes HCS/HCR, ProSolo does not
4. **Supplemental EVX**: ProSolo includes EVX4 variant

## Data Quality Notes

### Validated Features

- ✅ All class codes properly mapped
- ✅ PAX indices within expected range (0.7-1.0)
- ✅ No duplicate class codes within each dataset
- ✅ Proper grouping maintained from original structure
- ✅ All classes marked as active

### Additional Processing

- **Class Names**: Expanded abbreviations to full names (e.g., "SS" → "Super Street")
- **Group Descriptions**: Added descriptive text for each category
- **Lookup Map**: Created `classesByCode` for O(1) class lookup
- **Metadata**: Added version, release date, and type information

## Usage in Web App

The extracted data is now ready for use in the web application:

```typescript
import { solo2024, prosolo2024, getPaxIndex } from '$lib/data';
import { calculatePaxTime } from '$lib/pax-calculator';

// Get a specific index
const soloIndex = getPaxIndex(2024, 'Solo');

// Find classes
const ssClass = soloIndex.classesByCode['SS'];
const asClass = soloIndex.classesByCode['AS'];

// Calculate PAX time
const result = calculatePaxTime(65.123, ssClass, asClass);
```

## Next Steps

1. **Integration**: Update the web app to use the extracted data
2. **Validation**: Run the built-in validation functions on the data
3. **UI Updates**: Update class selection components to use the new data structure
4. **Testing**: Verify calculations match the native app results
