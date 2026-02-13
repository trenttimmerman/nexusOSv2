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

### Added
- **Designer V3: High-Voltage Design with Few-Shot Training** (commit: 167b8df)
  - Implemented contextual training: AI now studies 2 random header examples from /headers-examples/ before generating
  - Pre-selected 5 high-quality examples (Header1, 12, 18, 22, 28) with advanced patterns:
    - Scroll detection with useState/useEffect hooks
    - Marquee animations with CSS keyframes
    - GSAP ScrollTrigger integration
    - Glassmorphism with backdrop-blur effects
    - Gradient borders and text effects
  - Few-shot examples injected into prompt under "REFERENCE STANDARDS" section
  - Forces Gemini to match complexity level of premium headers
  - Anti-Boring Protocol requirements fully enforced:
    - NO FLAT COLORS: Must use gradients, alpha backgrounds, or textured patterns
    - MANDATORY HOVER EFFECTS: Every link/button requires hover: states (scale, glow, gradient transitions)
    - SCROLL ANIMATIONS: Support for data-[scrolled=true]: dynamic behaviors
    - MICRO-INTERACTIONS: active:scale-95 tactile feedback on all buttons
    - ANIMATION SPEED: Configurable via animationSpeed prop (slow/medium/fast)
  - HeaderConfig schema already includes scrollBehavior (static|sticky|hide-on-scroll|glass-on-scroll) and animationSpeed
  - Rule #8 enforcement: Headers MUST include gradients OR glassmorphism + hover effects on all interactive elements
- **Designer V3: Radical Header Generation** (commit: 860146f)
  - Implemented 3-Persona Strategy to enforce design diversity
  - Three incompatible design philosophies: Purist (minimalism), Alchemist (glass/depth), Brutalist (bold/asymmetric)
  - Prevents AI from defaulting to generic "Bootstrap-style" headers
  - Enforcement rules: no duplicate navActiveStyle, at least one dark background, different feature sets per variant
  - Increased Gemini temperature from 0.7 → 0.9 for higher creativity
  - Added comprehensive Coffee Roastery example ("Ember & Ash") demonstrating radical differences
  - Enhanced prompt with persona-specific layout requirements and trend references

### Fixed
- **AI API**: Escaped markdown code fences in template literal (commit: 1206608)
  - CRITICAL FIX: SyntaxError "Missing initializer in const declaration"
  - Root cause: HEADER_AGENT_PROMPT contained unescaped triple backticks (```) for code examples
  - These triple backticks prematurely closed the JavaScript template literal
  - Node.js ESM parser failed when loading the module in Vercel serverless
  - Solution: Escaped all code fence markers as \`\`\` within the template literal
  - Fixed hover effects, scroll behavior, micro-interactions, and header showcase examples
  - Local build verification: npm run build passes successfully
- **Build**: Fixed invalid Vercel configuration syntax (commit: 60d4a9c)
  - CRITICAL FIX: Removed invalid `runtime: "nodejs20.x"` from vercel.json
  - That syntax is for AWS Lambda, not Vercel - caused build error "Function Runtimes must have a valid version"
  - Vercel uses Node.js runtime by default for .ts files in api/ directory
  - Kept memory: 1024 configuration which is valid for Vercel
  - Build now proceeds correctly
- **AI API**: Enhanced error diagnostics for FUNCTION_INVOCATION_FAILED debugging (commit: 32ac4e4)
  - Added module initialization logging to identify serverless cold start failures
  - Enhanced catch block with detailed error information: name, message, stack trace, timestamp
  - Multi-level fallback for response handling: JSON → plain text → end() as last resort
  - Version bump to v2.1.0 to force fresh Vercel deployment (clear cache)
  - Diagnostic console.logs track module loading sequence for Vercel logs analysis
  - If module loads, logs will appear in Vercel; if not, error is at import/initialization level
- **AI API**: Fixed try-catch nesting causing FUNCTION_INVOCATION_FAILED (commit: 35d6651)
  - CRITICAL FIX: Corrected improperly nested try-catch blocks in serverless handler
  - After inlining examples, code had invalid structure with double-nested try blocks
  - Removed redundant inner try-catch, kept single comprehensive top-level try-catch
  - Consolidated error handling into one catch block with proper JSON responses
  - Serverless function now has valid JavaScript syntax and proper error boundaries
- **AI API**: Fixed FUNCTION_INVOCATION_FAILED with inlined few-shot examples (commit: 7c90a65)
  - CRITICAL FIX: Removed fs/promises file system access that was crashing Vercel serverless functions
  - Vercel serverless functions cannot use readFile() to load header examples at runtime
  - Solution: Inlined 3 complete header examples directly in code as FEW_SHOT_EXAMPLES constant
  - Examples showcase: glassmorphism, scroll detection, marquee animations, neon brutalist styling
  - Serverless function now fully self-contained with no file system dependencies
  - Few-shot training still active and working in production
  - Fixed syntax error from incomplete code replacement (broken "con---" line)
- **Designer V3**: Added missing handleCompleteWizard function (commit: aee0ef6)
  - Fixes ReferenceError when saving header in Designer V3 wizard
  - Returns final header config (customized or selected) to onComplete callback
  - Includes fallback to onCancel if no config available
- **AI API**: Comprehensive error handling for Vercel serverless (commit: 5086186)
  - Added top-level try-catch to prevent FUNCTION_INVOCATION_FAILED errors
  - Improved error messages with Vercel setup instructions
  - Added VercelRequest/VercelResponse types for proper serverless handling
  - API now always returns JSON, never opaque Vercel errors
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
