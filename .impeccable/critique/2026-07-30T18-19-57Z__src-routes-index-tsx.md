---
target: homepage (whole website)
total_score: 25
p0_count: 1
p1_count: 2
p2_count: 2
p3_count: 1
timestamp: 2026-07-30T18-19-57Z
slug: src-routes-index-tsx
---
# Critique: src/routes/index.tsx (LigaD1 Homepage)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Loading skeletons and error states present everywhere, but no progress indicator for page navigation or data pagination |
| 2 | Match Between System and Real World | 4 | n/a — speaks the user's language fluently |
| 3 | User Control and Freedom | 3 | No undo/cancel after form submission |
| 4 | Consistency and Standards | 3 | Headings use mix of cb-heading and inline style refs; View All pattern varies |
| 5 | Error Prevention | 2 | Form has only HTML5 required attrs — no email/phone validation, no confirmation |
| 6 | Recognition Rather Than Recall | 3 | n/a — main actions visible |
| 7 | Flexibility and Efficiency of Use | 2 | No search, no keyboard shortcuts, no recent/favorites |
| 8 | Aesthetic and Minimalist Design | 2 | Homepage stacks 8+ sections with near-equal visual weight |
| 9 | Help Users Recognize, Diagnose, and Recover from Errors | 2 | Generic error messages lack specific guidance |
| 10 | Help and Documentation | 1 | No help, FAQ, tooltips, or onboarding |
| **Total** | | **25/40** | **Acceptable** |

## Anti-Patterns Verdict

**LLM assessment**: Mixed. The site has a functional, data-driven skeleton that avoids the worst AI-tell patterns (glassmorphism, gradient text, numbered markers). But it falls into several template traps: identical card grids with icon+heading+text dominate the divisions/news/highlights sections, and the tiny uppercase tracked eyebrow (.cb-eyebrow) appears above virtually every section. DM Sans is on the reflex-reject list. Screen-size headings risk overflow at small viewports.

**Bans violated**: Identical card grids, tiny uppercase tracked eyebrows (pervasive), text overflow at small viewports, DM Sans (reflex-reject).

**Deterministic scan**: Clean — zero findings across 11 scanned files. 3 files with shell-special characters ($) in names could not be scanned. No automated issues detected.

**Browser visualization**: Skipped (user declined server/browser due to no visuals support).

## Overall Impression

A solid, well-engineered data-driven league site that handles every state (loading, error, empty) beautifully. The core product — schedule, standings, top scorers — works great. But as a brand/marketing surface, the homepage lacks hierarchy, visual distinction, and emotional punch. It reads more like an admin dashboard than a sports league that should excite fans.

## What's Working

1. **State handling**: Comprehensive loading skeletons, error boundaries with Retry, and empty states consistently implemented across every page — this is production-grade.
2. **Bold brand colors**: Green + red palette gives the league distinctive identity appropriate for sports, with clear inverse/muted/panel surface hierarchy.
3. **Data page UX**: Standings, schedule, and top scorers are well-structured with functional filtering, pagination, and tab controls.

## Priority Issues

### [P0] Screen-size headings (40px) used throughout without responsive scaling
- **What**: cb-font-size-screen (40px) on headings across all sections will overflow at 320-375px viewports
- **Why it matters**: Mobile users see clipped text, site looks broken on the most common device size
- **Fix**: Add clamp-based sizing: font-size: clamp(1.75rem, 5vw, 2.5rem) or responsive Tailwind prefixes
- **Suggested command**:  polish

### [P1] Homepage has 8 competing sections with identical visual weight — no primary action or hierarchy
- **What**: Hero, ticker, about, divisions, top scorers, news, highlights, sponsors — all with same padding and layout
- **Why it matters**: First-time visitors can't identify where to start; high bounce risk
- **Fix**: Reduce to 3-4 maximum, elevate the most important (schedule/standings), relegate secondary content to "view all" links
- **Suggested command**:  distill

### [P1] Tiny uppercase tracked eyebrow above every section (.cb-eyebrow)
- **What**: 12px uppercase with 0.05em tracking appears on about, divisions, news, highlights, schedule filters — the saturated 2023 AI scaffold
- **Why it matters**: Makes the site feel generic and templated; adds noise without information value
- **Fix**: Remove entirely or use 1-2 times per page max
- **Suggested command**:  quieter

### [P2] Identical card grid pattern across sections
- **What**: Same-sized icon box + uppercase heading + body text + chevron on divisions, echoed in news/highlights cards
- **Why it matters**: Visual monotony makes everything feel equally (un)important; reduces memorability
- **Fix**: Differentiate by content type — division cards with team count badges, news cards staggered, about cards horizontal
- **Suggested command**:  layout

### [P2] Registration form lacks inline validation and confirmation
- **What**: No type-specific validation for email/phone, no review step before submission
- **Why it matters**: Invalid data only caught via generic server error; no recovery path without full re-entry
- **Fix**: Add field-level validation (email, phone, password confirmation) and a review step
- **Suggested command**:  harden

### [P3] Hero slider navigation arrows too small for mobile
- **What**: w-11 h-11 (44px) arrows at extreme left/right edges
- **Why it matters**: Hard to tap reliably on mobile, especially with 5s auto-advance
- **Fix**: Increase to 48x48px+ with inset padding inside container
- **Suggested command**:  adapt

## Persona Red Flags

### Jordan (First-Timer)
- Homepage has no clear "start here" — 8 sections compete equally
- No onboarding or league summary above the fold
- Register CTA is ambiguous ("Register" — what? as a team? player? fan?)

### Riley (Stress Tester)
- No confirmation before form submission — accidental submit can't be undone
- Generic error messages don't distinguish network failure from validation error
- No input debouncing — rapid clicks could create duplicate inquiries

### Casey (Mobile User)
- 40px headings will overflow at 320px viewport width
- Schedule match cards with 5-column flex layout will be cramped on mobile
- Top scorers table with 4 columns has no horizontal scroll on sub-768px screens
- Hero slider arrows at extreme edges, too small for reliable thumb targeting

## Minor Observations
- ScoreTicker "Recent Results" uses tracking-[0.05em] while other uppercase elements use tracking-normal — inconsistent
- Hero should feel larger for a sports league (closer to 56-64px for screen headings)
- Green-on-green gradient for coach cards may have midpoint contrast issues
- Footer social links show muted icons with no link when config is missing — dead visual elements
- Standings table missing "Draws" (D) column — most soccer standings show D
- News and highlight detail pages are structurally identical — could share a component
- Container max 1200px is generous; article width mismatch feels unplanned

## Questions to Consider
- "What is the single most important action you want first-time visitors to take on the homepage?"
- "If the brand colors are green (#166534) and red (#dc2626), why does every section default to the same muted gray canvas (#f8fafc)?"
- "The site handles states beautifully for a web app — but as a brand/marketing site, should it optimize for emotional impact and imagery instead of data resilience?"
