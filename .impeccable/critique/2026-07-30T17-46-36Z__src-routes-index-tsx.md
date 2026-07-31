---
target: homepage (src/routes/index.tsx)
total_score: 30
p0_count: 1
p1_count: 2
timestamp: 2026-07-30T17-46-36Z
slug: src-routes-index-tsx
---
# Design Critique: LigaD1 Landing Page

**Target:** `src/routes/index.tsx` — Homepage / Landing Page

**Method:** Dual-agent (A: Design Review · B: Detector + CLI)

---

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|:-----:|-----------|
| 1 | Visibility of System Status | 3 | Skeleton loaders present; ticker auto-scroll has no visible pause/play control (hover pause not discoverable on touch) |
| 2 | Match System / Real World | 4 | Terminology matches soccer league conventions; "LigaD1", "The Heart of Mexican Soccer" reads naturally |
| 3 | User Control and Freedom | 3 | Hero nav controls exist; no stop/pause for auto-playing ticker beyond `prefers-reduced-motion` |
| 4 | Consistency and Standards | 3 | Design token system consistent; global scrollbar hiding (styles.css:299-307) violates platform convention |
| 5 | Error Prevention | 3 | Nested fallback chains for all data; CMS theme fallbacks prevent layout collapse |
| 6 | Recognition Rather Than Recall | 4 | Fixed navbar, clear section headings, consistent card patterns |
| 7 | Flexibility and Efficiency | 2 | No skip-to-content link, no keyboard shortcuts, no homepage customization |
| 8 | Aesthetic and Minimalist Design | 3 | Clean overall; News/Highlights are structurally identical; "OUR DIVISIONS" split-color heading adds visual noise |
| 9 | Error Recovery | 4 | Error component with "Try again" and "Go home"; inline retry per section |
| 10 | Help and Documentation | 2 | Contact info only; no FAQ, help center, or onboarding |
| **Total** | | **30/40** | **Good** |

---

## Anti-Patterns Verdict

This landing page is **not obviously AI-generated**. It has a clear brand identity (green/red soccer league), well-structured sections, real imagery, and thoughtful error handling. However, three anti-patterns pull it down:

**LLM Assessment — AI Slop & Brand Register Check:**

| Pattern | Verdict | Detail |
|---------|---------|--------|
| Side-stripe borders | ✅ Clean | No accent border-left/right stripes |
| Gradient text | ✅ Clean | No `background-clip: text` |
| Glassmorphism | ✅ Mostly clean | One defensible blur use on mobile modal backdrop |
| Hero-metric template | ✅ Clean | No big-number + tiny-label pattern |
| Identical card grids | ❌ **FAIL** | News (L330-355) and Highlights (L361-389) are copy-paste identical: 3-col grid, NewsCard, "View All" link |
| Eyebrow over every section | ✅ Clean | `cb-eyebrow` used once on About, not repeated |
| Numbered section markers | ✅ Clean | None present |
| Ghost-card (border + shadow) | ❌ **FAIL** | `cb-card`/`cb-panel` base class applies `border: 1px solid` AND is combined with `cb-shadow-panel` (`box-shadow`) — the exact pattern banned |
| Over-rounding | ✅ Clean | Radii max out at 16px |
| Hand-drawn SVG | ✅ Clean | None |
| Stripe/pattern backgrounds | ✅ Clean | None |
| Zero imagery | ✅ Clean | Hero images, About image, news photos, sponsor logos all present |
| Editorial-magazine aesthetic | ✅ Clean | Clearly a sports site, not editorial |
| Hidden scrollbars | ❌ **FAIL** | Global scrollbar hiding + `scrollbarWidth: "none"` on Top Scorers section |

**Deterministic Scan:** `detect.mjs` returned **0 findings** across all scanned files. The automated detector did not flag any pattern-level issues. This confirms the problems are structural and aesthetic — requiring human judgment.

---

## Overall Impression

This is a competent, production-ready sports league site with a clear identity. The design token system and API fallback architecture are genuinely well-engineered. The core weakness is a lack of visual differentiation between sections that should feel distinct (News vs Highlights), a ghost-card anti-pattern baked into the foundation, and a few UX roughness spots (ticker conflict, hidden scrollbars, heavy sponsor borders). The page would benefit most from intentional section variety and design-system cleanup rather than a full redesign.

---

## What's Working

1. **Robust data architecture.** Nested fallback chains (`home?.divisions || divisionsData`) at every data point, CMS-driven theming via `PublicThemeGate`, skeleton loaders that prevent layout shift. Production resilience done right.

2. **Clean, consistent token system.** The `--cb-*` CSS variable system is well-named, well-organized, and used consistently throughout. The runtime theme override via inline styles on `.cb-page` is a sophisticated pattern.

3. **Good emotional pacing for the first half.** Hero → Ticker overlay → About → Divisions flows naturally. The green/red color scheme is appropriately energetic for a soccer league.

---

## Priority Issues

### P0 — Ghost-card pattern in core design system
**Location:** `styles.css:153-158` (`.cb-card`, `.cb-panel`) + `cb-shadow-panel` (styles.css:256-258); used in `NewsCard.tsx:15`, `ScoreTicker.tsx:28`
**What:** The base card/panel class applies `border: 1px solid var(--cb-border-subtle)` and is consistently paired with `box-shadow` via `cb-shadow-panel`. This is the "ghost-card" anti-pattern.
**Why it matters:** It's the single most recognizable AI-slop tell in this codebase. Every card in the system ships with this pattern, making the entire design feel derivative.
**Fix:** Remove `border` from `.cb-card`/`.cb-panel` base, or remove `box-shadow` from the `cb-shadow-panel` utility. Choose one visual treatment per element.
**Suggested command:** `$impeccable polish`

### P1 — Identical News and Highlights grids
**Location:** `index.tsx:330-355` (News) and `index.tsx:361-389` (Highlights)
**What:** Two adjacent sections using the exact same component, grid, link pattern — only the data source differs.
**Why it matters:** Creates visual fatigue and devaluation. A user scrolling from News to Highlights feels repetition, not discovery. Highlights should feel visually distinct (video thumbnails, featured layout, carousel).
**Fix:** Differentiate Highlights with a featured/large-card layout, embedded video previews, or a horizontal scroll carousel instead of the 3-column grid.
**Suggested command:** `$impeccable layout` or `$impeccable delight`

### P1 — Hidden scrollbars (global + Top Scorers)
**Location:** `styles.css:299-307` (global `scrollbar-width: none` rules); `index.tsx:427` (`scrollbarWidth: "none"`)
**What:** All scrollbars are hidden globally. The Top Scorers section depends entirely on horizontal scroll but provides zero visual affordance that more content exists rightward.
**Why it matters:** WCAG 2.1 failure — users must be able to perceive overflow content. On touch devices, there's no scrollbar to indicate scrollability. Users will miss content.
**Fix:** Remove global scrollbar hiding. Style scrollbars as `thin` rather than `none`. Add fade-edge gradient or chevron affordance to Top Scorers.
**Suggested command:** `$impeccable audit`

### P2 — Ticker overlay and missing label/controls
**Location:** `index.tsx:208-230`; `ScoreTicker.tsx`
**What:** The score ticker is positioned `absolute inset-x-0 top-0` over the hero, creating visual competition. It auto-scrolls with no label ("Recent Results") and no accessible pause control.
**Why it matters:** A first-time visitor must parse flashing scores while reading the hero headline. On touch devices, the `:hover` pause doesn't work. The ticker adds cognitive load to the page's most important moment.
**Fix:** Add a visible label, a pause/play button, or move it below the hero. Consider making it static on mobile.
**Suggested command:** `$impeccable polish`

### P2 — Sponsors section double heavy border
**Location:** `index.tsx:468`: `border-t-4 border-b-4 border-[var(--cb-brand-accent)]`
**What:** 4px top AND 4px bottom accent borders on the sponsors section — the heaviest border treatment on the page.
**Why it matters:** Creates an abrupt visual slam at the end of the user's scroll journey. Rather than a graceful closing note, the page ends with a heavy double border.
**Fix:** Use a single top border with generous padding below, or switch to a background color change / soft separator.
**Suggested command:** `$impeccable polish`

---

## Persona Red Flags

### Jordan (First-timer)

**Walkthrough:**
1. Hero makes a strong first impression. "View Schedule" CTA is clear.
2. ❌ Ticker starts auto-scrolling — Jordan must parse scores AND read the hero headline simultaneously. Two competing information sources.
3. ❌ "OUR DIVISIONS" split-color heading reads as two separate thoughts momentarily.
4. ❌ Top Scorers: Unclear that more content exists rightward (no scrollbar, no arrow affordance).
5. ❌ News → Highlights: identical sections create a "did I already see this?" moment.
6. ❌ Sponsors appear without context about their relationship to the league.

### Casey (Mobile / Distracted)

**Walkthrough:**
1. ✅ Touch targets at 44×44px pass the minimum.
2. ❌ Hamburger icon (24px lucide-react icon) is small; white-on-green contrast varies by green shade.
3. ❌ MobileAppPrompt full-screen overlay fires on mount with no delay — interrupts the very first interaction. (`MobileAppPrompt.tsx:17-45`)
4. ❌ Top Scorers horizontal scroll: zero visual affordance that content extends rightward.
5. ❌ 3-column grids collapse to 1-column (good), but `md:grid-cols-3` breakpoint means tablets get 3 cramped columns for news/highlights.
6. ❌ Ticker overlays hero, taking vertical space and competing for attention on a small screen.

### Riley (Stress-tester)

**Walkthrough:**
1. ✅ API failure gracefully degrades to fallback data and retry buttons. Robust.
2. ❌ Empty sections vanish silently — if data loads slowly, heading appears then disappears. No empty-state messaging.
3. ❌ Long team/division names have no `text-overflow: ellipsis` — could overflow card boundaries (`index.tsx:299-301`).
4. ❌ `color-mix()` (used in gradients, shadows, and overlays) lands in CSS 2023 — older browsers fall back to a solid color, losing the gradient effect.
5. ❌ Unicode soccer ball (`String.fromCharCode(9917)`) renders as different glyphs across platforms — on some systems it's a generic box.
6. ✅ `prefers-reduced-motion` correctly stops ticker and marquee animations.

---

## Minor Observations

1. **Unicode soccer ball at `index.tsx:447`** (`String.fromCharCode(9917)`) is unreliable across platforms. Use an SVG or lucide icon.
2. **No `scroll-margin`** on section anchor targets. Fixed navbar (68px) will obscure linked sections.
3. **Hero fallback slides** are static images. When API provides slides without headlines, hardcoded fallback copy ("The Heart of Mexican Soccer") overlays API images — potential visual mismatch.
4. **About image `alt` text** is just `"About"` (line 267) — should describe the image.
5. **`--cb-space-32` and `--cb-space-48`** are token-system exceptions (non-standard spacing values not using the named scale). Consider consolidating.
6. **`getCompletedMatches` function name** has a typo: "Matches" not "Matches".
7. **Sponsors section** has no loading skeleton — brief flash if data arrives after paint.

---

## Questions to Consider

1. **Do News and Highlights earn their separation?** They use the same component, same grid, same layout. Can they merge into one "Latest" section with filter tabs, or does the current duplication suggest the IA needs rethinking?

2. **What problem does the ticker solve?** It overlays the hero, auto-scrolls without consent, and shows raw scores with no context. Would a static "Recent Results" list below the hero serve the same purpose better?

3. **What note should the page end on?** Currently, Sponsors (heavy red borders) is the last section before the footer. Would a community CTA — "Join the League" or newsletter signup — create a stronger closing?

4. **Where is the local visual culture?** The palette is green/red/white (correct for Mexican soccer), but the typography (DM Sans) and layout feel generically "modern sports." Could the design carry more visual connection to its community?
