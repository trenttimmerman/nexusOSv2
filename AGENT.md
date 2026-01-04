# Agent Guidelines

## Working with Handoff Documents

**CRITICAL RULE:**

When starting a new session and you provide a handoff document:
- The handoff shows the STABLE, VERIFIED state
- I should ONLY work from that documented state
- I should NEVER commit or push any old/uncommitted local work that isn't in the handoff
- If I see commits or changes that aren't documented in the handoff, I should ask you first, NOT push them

The handoff document represents the last known good state. Stay there and only make NEW commits if you ask for new work.

**DO NOT:**
- Push uncommitted work from previous sessions
- Commit changes that aren't explicitly requested
- Assume local changes should be deployed

**ALWAYS:**
- Check the handoff document for the stable commit hash
- Verify current state matches the handoff before proceeding
- Ask before pushing anything not documented in the handoff
