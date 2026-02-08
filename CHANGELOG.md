# Changelog

All notable changes to the WebPilot Commerce OS platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Daily Operations Protocol for structured development workflow
- KNOWN_ISSUES.md for active bug tracking
- CHANGELOG.md for deployment history

### Changed

### Fixed

### Removed

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
