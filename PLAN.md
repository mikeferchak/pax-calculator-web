# PAX Calculator Development Plan

## Project Vision
Build a mobile-first PAX calculator for autocross racers that works offline in low-signal environments with high contrast for outdoor use.

## Current Status
- SvelteKit app with basic structure
- Placeholder routes: `/`, `/compare/`, `/list/`, `/settings/`
- PWA boilerplate implemented
- Tailwind CSS v4 and Svelte 5 with runes

## Phase 1: Foundation & Research
- [ ] Analyze current codebase structure
- [ ] Research PAX data from https://www.solotime.info/pax/
- [ ] Define data models for PAX calculations
- [ ] Plan offline-first architecture

## Phase 2: Core Features
- [ ] Implement PAX data loading and storage
- [ ] Build direct comparison mode (`/compare/`)
- [ ] Build list mode (`/list/`)
- [ ] Add settings page for PAX year selection

## Phase 2.5: Automatic PAX Updates (NEW WEB FEATURE)
- [ ] Build GitHub Action for Solo PAX scraping/parsing from solotime.info
- [ ] Build GitHub Action for ProSolo PDF parsing from SCCA downloads
- [ ] Create clever ProSolo DOCX URL discovery system (URL changes annually)
- [ ] Build DOCX parser to extract PSI values from Microsoft Word format
- [ ] Create data validation and JSON generation workflow
- [ ] Design versioned PAX index storage system
- [ ] Build index selection UI with version dropdown
- [ ] Implement "Latest" vs pinned version preference
- [ ] Add update notification system
- [ ] Create mid-season revision naming (e.g., "Solo 2025 (2025.06.25 revision)")

## Phase 3: PWA & Offline
- [ ] Enhance service worker for offline functionality
- [ ] Implement data caching strategies
- [ ] Add app installation prompts
- [ ] Test offline scenarios

## Phase 4: UX & Polish
- [ ] Optimize for bright sunlight (high contrast)
- [ ] Mobile-first responsive design
- [ ] Performance optimization
- [ ] Testing and validation

## Key Technical Decisions
- **Offline First**: All calculations must work without internet
- **PWA**: Service worker for app-like experience
- **Data Source**: Annual PAX index from solotime.info
- **Storage**: Local storage for PAX data and user preferences
- **UI Framework**: Svelte 5 + Tailwind CSS v4
- **Auto-Updates**: GitHub Action generates versioned PAX indices
- **Version Control**: Users select from available indices (Latest/Pinned)

## Target Features
1. **Direct Comparison**: Input time + class → output adjusted time for target class
2. **List Mode**: Compare multiple times/classes simultaneously
3. **Settings**: PAX year selection, theme preferences
4. **Offline Support**: Full functionality without network
5. **High Contrast**: Optimized for outdoor/sunlight use
6. **Version Selection**: Choose PAX index version (Latest/Pinned) with update notifications

## Automatic PAX Update Challenges & Solutions

### Challenge 1: Solo PAX Data (solotime.info)
**Problem**: Hand-written HTML with potential typos and malformed markup
**Solution**: 
- Robust HTML parsing with fallback strategies
- Data validation against expected ranges (0.7-1.0)
- Structure validation (class names, groupings)
- Manual verification UI before applying updates
- Rollback capability if data is corrupted

### Challenge 2: ProSolo PSI Data (SCCA DOCX)
**Problem**: 
- DOCX format in Microsoft Word XML
- Changing URLs each year (document ID changes)
- Manual document creation prone to formatting changes

**Solution**:
- **URL Discovery**: Search SCCA downloads page for "ProSolo" + current year patterns
- **DOCX Parsing**: Unzip → extract document.xml → parse structured XML
- **Flexible Parsing**: Handle text split across multiple XML elements
- **Pattern Matching**: Look for "ProSolo Index (PSI) Factors:" section
- **Validation**: Cross-reference with known class structure

### Challenge 3: Version Management
**Problem**: Need to handle multiple index versions and allow user choice
**Solution**:
- **Static JSON Storage**: Generate versioned files (solo-2025.json, prosolo-2025.json)
- **Metadata File**: Track available versions with release dates
- **User Preference**: Store "Latest" vs specific version choice
- **Update Notifications**: Show when new versions available

### Challenge 4: Data Quality & Validation
**Problem**: Both sources are manually created and error-prone
**Solution**:
- **Range Validation**: PSI values should be 0.7-1.0
- **Structure Validation**: Expected class names and groupings
- **Diff Analysis**: Compare changes between versions
- **Manual Approval**: Review significant changes before auto-applying
- **Fallback Data**: Keep last known good version as backup

### Challenge 5: Deployment & Distribution
**Problem**: Need to distribute updated indices to web app users
**Solution**:
- **GitHub Actions**: Monthly scraping workflow
- **Static Assets**: Store JSON files in public directory
- **CDN Distribution**: Serve via Vercel static hosting
- **Cache Strategy**: Service worker caching with version checks
- **Graceful Degradation**: Work offline with last cached version

### Implementation Strategy
1. **GitHub Action Workflow**: Runs monthly, handles both sources
2. **Data Validation Pipeline**: Multi-stage validation with human review
3. **Version Control**: Git-based versioning with tagged releases
4. **Frontend Integration**: Fetch available versions, user preference management
5. **Monitoring**: Alerts for parsing failures or significant data changes