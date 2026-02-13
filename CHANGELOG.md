# Changelog

All notable changes to the WebPilot Commerce OS platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

### Changed

### Fixed

### Removed

---

## [2026-02-13]

### Fixed
- **AI Integration**: Migrated to official @google/generative-ai SDK (commit: cf18767)
  - Replaced unofficial @google/genai package with Google's official SDK
  - Updated to use gemini-2.5-flash model (correct for 2026 timeline)
  - Fixed API syntax across 10 files: API endpoints, AI agents, React components
  - Confirmed VITE_GOOGLE_AI_API_KEY environment variable usage (correct for Vite)
  - Build passing: 14.53s, bundle 2,697 kB
- **AI Generation API**: Fixed Vercel serverless environment variable access (commit: fe0e20a)
  - Added fallback to check both VITE_GOOGLE_AI_API_KEY and GOOGLE_AI_API_KEY
  - VITE_ prefix is for client-side; serverless functions need regular env vars
  - Updated error messages with Vercel setup instructions
  - API now returns proper JSON errors instead of HTML error pages

---

## [2026-02-10]

### Added
- **Designer V3**: Complete AI-powered header generation wizard
  - 3-step wizard interface (Selection → Customization → Library Save)
  - AI header generation using Gemini 2.5-flash with comprehensive training prompt
  - Community header library with search and filter capabilities
  - Full-screen customization editor with 70+ editable properties
  - 8 new TypeScript components in `/components/designer/`
  - 3 new API endpoints for AI generation, library browsing, and saving
  - Database migration: `shared_header_library` table with RLS policies
  - Comprehensive documentation in HANDOFF_FEB9_DESIGNER_V3.md
- **AI Header Generation Enhancements**:
  - Live HeaderCanvas2026 preview rendering in selection cards (commit: e66bf50)
  - Full-screen storefront preview modal with scrollable content (commit: 6df30e9)
  - Auto-save all 3 generated headers to `shared_header_library` (commit: e318f01)
  - AI training prompt rewritten based on 36 real header examples (commit: de78509)
  - 7 header design archetypes: Clean Minimal, Dark Luxury, Bold & Colorful, Frosted Glass, Editorial/Brutalist, Full-Featured Professional, Warm Artisan

### Fixed
- **Critical Production Bugs** (see HANDOFF_FEB10_AI_HEADER_GENERATION.md):
  - FUNCTION_INVOCATION_FAILED: `import.meta.env` crashes in Node.js serverless runtime - replaced with `process.env` (commit: 8edff1c)
  - FUNCTION_INVOCATION_FAILED: Cross-directory imports causing Vercel bundler crashes - made generate-headers.ts fully self-contained (commit: bf46b90)
  - FUNCTION_INVOCATION_FAILED: Sibling .ts imports in api/ treated as handlers - inlined training prompt directly (commit: 192f4a0)
  - Cron job SyntaxError from dual ESM exports - removed named config export, moved to vercel.json (commit: 4ac1138)
- Header color fields rendering in Header Studio (commit: 9de9d07)
- TypeScript compilation errors in Designer V3 components (commit: 0bd93d6)
- Header data structure normalization from API responses (commit: c22b6fe)
- AI generation API error handling for dev environment (commits: 447ec89, db32882)
- JSON parse errors with helpful production-only messaging
- `mapConfigToHeaderData()` now spreads ALL style fields from AI response (commit: 93344bc)

---

## [2026-02-07]

### Added
- Daily Operations Protocol adapted for WebPilot
- Maintenance directory structure
- Comprehensive deployment and rollback procedures

---

## Usage Guidelines

### When to Update

Update this file **after every deployment** to production. This creates a historical record of changes.

### Categories

- **Added** - New features, components, or functionality
- **Changed** - Changes to existing functionality  
- **Fixed** - Bug fixes
- **Removed** - Removed features or deprecated code
- **Security** - Security-related changes
- **Performance** - Performance improvements

### Format

```markdown
## [YYYY-MM-DD]

### Fixed
- Brief description of fix (commit: abc123)
- Another fix description (commit: def456)

### Added
- New feature description (commit: ghi789)
```

### Examples

```markdown
## [2026-02-07]

### Fixed
- Email templates rendering incorrectly in Outlook clients (commit: a1b2c3d)
- RLS policy blocking customer data access in admin panel (commit: e4f5g6h)
- Component preview showing stale data in Design tab (commit: i7j8k9l)

### Added
- Customer analytics widget in admin dashboard (commit: m1n2o3p)
- Bulk product import via CSV (commit: q4r5s6t)

### Changed
- Updated AI generation prompts for better content quality (commit: u7v8w9x)
- Improved email campaign scheduling UI (commit: y1z2a3b)

### Performance
- Optimized Supabase queries in storefront rendering (commit: c4d5e6f)
- Added indexes to frequently queried tables (commit: g7h8i9j)
```

### Commit Hash

Include the short commit hash (first 7 characters) to link changes to git history.

```bash
# Get short commit hash
git log --oneline -1
# Example output: a1b2c3d fix(email): template rendering issue
```

### Major Sessions

For large development sessions, reference the HANDOFF document:

```markdown
### Added
- Complete welcome flow for new users - see HANDOFF_FEB7_WELCOME_FLOW.md (commit: k1l2m3n)
```

---

## Archive Policy

- Keep detailed entries for the last 90 days
- Summarize older entries by month
- Archive entries older than 1 year to `CHANGELOG_ARCHIVE.md`

---

## Related Files

- See `KNOWN_ISSUES.md` for active bugs
- See `maintenance/bugfixes/` for detailed bug reports
- See `HANDOFF_*.md` for session development notes
- See `.github/workflows/DAILY_OPERATIONS_PROTOCOL.md` for deployment workflow
