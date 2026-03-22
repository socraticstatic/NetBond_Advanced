# Lessons Learned

## 2026-03-22

### 1. Fix the root cause, not the symptom
**Correction:** User asked to standardize tables TWICE. I fixed BaseTable's border but missed EnhancedTable and all section wrappers. Then fixed some wrappers but missed others.
**Rule:** When fixing a pattern issue, grep the ENTIRE codebase for ALL instances. Do not fix one file and declare done.
**How to apply:** `grep -rn "pattern" src/` before and after fixing. Count instances. Fix ALL of them.

### 2. Build shared components FIRST, not inline patches
**Correction:** User asked for consistent search/filter bars. I patched individual files with inline changes instead of building a shared SearchFilterBar component upfront.
**Rule:** If the same UI pattern appears in 3+ places, create a shared component BEFORE touching any instance. Then wire all instances to use it.
**How to apply:** Count how many files have the pattern. If >= 3, create the component first.

### 3. Verify by looking at EVERY affected page, not just one
**Correction:** Declared table borders "fixed" after checking only the Pools list view. Links, VNFs, Cloud Routers still had double borders.
**Rule:** After any shared component change, screenshot EVERY page that uses it. Not just the one you're looking at.
**How to apply:** List all consumers of the changed component. Visit each one. Screenshot.

### 4. Don't declare done until the user's actual complaint is resolved
**Correction:** User said "Create Connection doesn't right-align." I measured bounding boxes and said they matched. The visual problem was that the search bar was fixed-width leaving dead space.
**Rule:** Look at the screenshot with the user's eyes. If something looks wrong, it IS wrong. Don't argue with measurements.

### 5. Read the behavioral guidelines at session start
**Correction:** Had the guidelines in memory but didn't actively follow them. No lessons file. No self-improvement loop.
**Rule:** Read feedback_behavioral_guidelines.md at the start of every session. Create tasks/lessons.md immediately.
