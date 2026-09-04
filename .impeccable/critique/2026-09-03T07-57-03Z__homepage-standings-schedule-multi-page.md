---
target: homepage + standings + schedule (multi-page)
total_score: 19
max_score: 36
na_heuristics: 10
p0_count: 1
p1_count: 2
timestamp: 2026-09-03T07-57-03Z
slug: homepage-standings-schedule-multi-page
---
Method: dual-agent (A: a3f6be30240afac65 · B: aba32a3955ca78a2f)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Standings table silently drops the Wins column with no error surfaced — the system doesn't know its own data is wrong. |
| 2 | Match System / Real World | 2 | Standings header reads `# / Team / P / W / L / GF / GA / GD / PTS` (9 cols) but each row renders only 8 cells, so every stat from W onward sits under the wrong label. |
| 3 | User Control and Freedom | 2 | Schedule division/season filters have no reset and aren't reflected in the URL — filtered view is lost on refresh, back-nav, or share. |
| 4 | Consistency and Standards | 3 | Token system (`--cb-*` vars) is applied consistently across all three routes; loses a point because the schedule's division `Select` uses different chrome than the standings page's pill-tabs for the same concept. |
| 5 | Error Prevention | 2 | Few error-prone inputs exist, but the standings column-shift bug is a preventable, shipped error — `wins` exists on the type and is simply never rendered. |
| 6 | Recognition Rather Than Recall | 2 | Nothing on `/schedule` reminds you which division/season you're viewing once you scroll past the filter bar. |
| 7 | Flexibility and Efficiency | 1 | No shortcuts, no "jump to my team," no deep-linkable filters, no dense/compact view for repeat matchday checking. |
| 8 | Aesthetic and Minimalist Design | 3 | Clean, restrained navy/red/white palette with consistent radii; the homepage's six full stacked sections (Ticker/Hero → About → Divisions → Top Scorers → News → Highlights → Sponsors) have no pacing break. |
| 9 | Error Recovery | 2 | Home, standings, and schedule all show an identical generic "This section could not load" + full-page-reload Retry — consistent but not diagnostic. |
| 10 | Help and Documentation | n/a | Genuinely inapplicable — a sports score/standings/schedule site needs no help system beyond the existing standings legend caption. |
| **Total** | | **19/36** | **Acceptable (53%)** |

## Design Specificity Verdict

**LLM assessment**: This reads as a themed template more than a purpose-built sports product. The homepage's layout language — hero carousel → about split → card grid → horizontal-scroll strip → 3-up grids → logo bar — is the generic marketing-site skeleton, interchangeable with a SaaS, restaurant, or league site; only copy and data are domain-specific. The one genuinely sport-native touch is the `ScoreTicker` marquee. But the two pages fans return to weekly — standings and schedule — are the plainest surfaces on the site: bare tables/cards with no "your team" affordance, no promotion/relegation cues, no live-match state, no streak/form indicators, no win/loss color coding on scores. The design investment appears inverted relative to actual usage frequency.

**Deterministic scan**: `detect.mjs --json` against `src/routes/index.tsx`, `src/routes/standings.tsx`, `src/routes/schedule.tsx`, and `src/components` returned exit code 0 — zero findings. The mechanical anti-pattern detector is clean; every issue below was caught by design review and manual source reading, not tooling. No false positives to report since there were no findings.

**Visual overlays**: Browser injection was attempted but could not produce usable evidence — see the note below. No user-visible overlay exists for this run.

**⚠️ Local-preview finding (from Assessment B):** Every route (`/`, `/standings`, `/schedule`) rendered a generic **"Site not found — We couldn't find a Clubucket site at this address"** block on `localhost:8080` (not port 3000 as configured in `.claude/launch.json` — Vite auto-bumped ports; note that config drift for later). This is caused by `src/routes/__root.tsx`'s root loader doing hostname-based multi-tenant lookup (`resolveOrganization()` in `src/lib/organization.ts`) against a live backend, which fails to resolve on `localhost`. The project ships a dev override (`VITE_ORGANIZATION_SLUG`) that's currently commented out in `.env`. Because this is an environment/config change rather than a design defect, Assessment B did not enable it. **Practical effect on this critique:** all UI findings below come from source reading (Assessment A) and static analysis, not live-rendered screenshots, since the actual page content never rendered in the browser this run. Uncomment `VITE_ORGANIZATION_SLUG=ahmedabad-premier-league` in `.env` and restart the dev server if you want live browser verification of these findings or of any fixes.

## Overall Impression

The visual system (tokens, palette, spacing) is more disciplined than most first passes — this isn't a sloppy build. But it's under-invested in the two pages that matter most for retention (standings, schedule), and it currently ships a real data-integrity bug: the standings table's column headers and cell values are off by one, meaning wins/losses/goals/points are all displayed under the wrong label. On a league site, that's the single highest-trust surface showing visibly wrong information to every visitor. The biggest opportunity is inverting the effort: treat standings/schedule as the product's core loop (stakes, "my team," live state) rather than a template's afterthought data table.

## What's Working

1. **Design-token discipline** — `--cb-brand-primary`, `--cb-surface-*`, `--cb-text-*` are used consistently across all three routes and inline styles rather than ad-hoc hex values, so a rebrand or dark-mode pass is mechanically feasible.
2. **`ScoreTicker` marquee** (`src/components/ScoreTicker.tsx`) is the one component that feels sport-native — a continuously scrolling strip of recent results gives the homepage an immediate "live sports" pulse.
3. **Keyboard-accessible `MatchCard`** — `role="button"`, `tabIndex`, `onKeyDown` for Enter/Space, and a visible `focus-visible:ring-2` in `schedule.tsx`. Easy to skip, and it wasn't.

## Priority Issues

**[P0] Standings table displays the wrong stat under every column header from "W" onward**
- **Why it matters**: `src/routes/standings.tsx`'s `<thead>` defines 9 columns (`# / Team / P / W / L / GF / GA / GD / PTS`) but the `Row` component renders only 8 `<td>`s — it skips `r.wins` entirely. So Losses renders under the "W" header, Goals For under "L", Goals Against under "GF", Goal Difference under "GA", and Points under "GD" — leaving "PTS" empty. Every visitor checking their team's real standing sees misleading numbers on the site's highest-trust page.
- **Fix**: Add `<td>{r.wins}</td>` in the correct position in `Row` (after `played`, before `losses`), and better, drive both `<thead>` and `<tbody>` from one ordered column config so header/row can't drift again.
- **Suggested command**: `/impeccable audit` (data-correctness/regression class issue — flag for immediate fix, not a visual-polish pass)

**[P1] No "my team" or stakes-aware treatment on standings or schedule**
- **Why it matters**: Rows are visually uniform (only a hover shift) — no promotion/relegation line, no highlight for a followed team, no position-change indicator. Fans must manually scan every visit to answer "did we move up," and there's no payoff for climbing the table.
- **Fix**: Add a lightweight "follow team" affordance (even client-side/localStorage) that pins/highlights that row, plus a subtle divider at any promotion/relegation cutoff.
- **Suggested command**: `/impeccable delight` or `/impeccable shape` (new interaction, not a bug fix)

**[P1] Schedule filter state isn't persisted or shareable**
- **Why it matters**: `divisionId`, `seasonId`, `view`, and `page` are local `useState` with no URL sync — a filtered view (e.g. "Division 2 / Results / page 3") is lost on refresh, back-navigation, or when shared as a link, which kills the natural "send this link to a friend" use case for sports content.
- **Fix**: Sync filter state to search params via TanStack Router's `validateSearch`/`useSearch` so the URL is the source of truth.
- **Suggested command**: `/impeccable harden`

**[P2] Generic, non-diagnostic error states across all three pages**
- **Why it matters**: Home, standings, and schedule all show an identical "This section could not load" + full-page-reload Retry, with no distinction between network failure, empty season, or server error — ambiguous for a mobile user on a spotty connection, and a full reload is a blunt fix for one failed fetch.
- **Fix**: Differentiate copy by error type where the API distinguishes it, and retry only the failed query instead of reloading the whole page.
- **Suggested command**: `/impeccable clarify`

**[P3] Homepage has no in-page navigation across six stacked sections**
- **Why it matters**: Ticker/Hero → About → Divisions → Top Scorers → News → Highlights → Sponsors stack with no anchor links or sticky nav, increasing scroll burden for a returning visitor who wants one specific section.
- **Fix**: Add a slim sticky in-page nav, or at minimum deep-link the main Navbar items to each section's anchor.
- **Suggested command**: `/impeccable layout`

## Persona Red Flags

**Jordan (Confused First-Timer / parent checking their kid's team)**: Lands on `/standings`, sees the division tabs (fine), but the P0 column-shift bug means the numbers under "W" and "L" are wrong — Jordan may believe their team lost more games than it did, and "PTS," the number that matters most, has no value directly under its header at all. Worst failure point for this persona on the whole site.

**Casey (Distracted Mobile User checking scores on the go)**: On `/schedule`, the two `Select` filters (Division, Season) stack full-width on mobile and sit above the fold, pushing fixtures below the fold; the default season resolves asynchronously with placeholder text, so Casey may see an empty/loading state on first paint and assume the page is broken. Separately, `ScoreTicker`'s auto-scroll marquee only pauses on `:hover`, which doesn't exist on touch — Casey can't stop it to read one score and has to chase it across the screen.

**Sam (Accessibility-Dependent, screen reader / keyboard-only)**: The homepage `HeroSlider` auto-advances every 5 seconds via `setInterval` with no visible pause control (only prev/next chevrons that don't stop autoplay) — this violates WCAG 2.2.2 (Pause, Stop, Hide) for auto-moving content over 5 seconds. The standings table also has no `<caption>` or `scope` on its `<th>` cells, so a screen reader has no reliable column association even before the P0 misalignment compounds the confusion.

## Minor Observations

- `MatchCard` scores use different type size/weight for the "vs"/final score, but no win/loss color coding per team — a 3-1 result carries the same visual weight as a 0-0.
- `SponsorsSection` renders no fallback if a sponsor's `logoUrl` is missing — the sponsor's slot silently disappears rather than showing a text fallback, which could read as a dropped sponsorship to that sponsor.
- `EmptyState`'s default copy ("no items") is a generic i18n fallback; worth sport-specific copy per context (e.g. "No matches scheduled yet — check back after the draw").
- The standings legend caption explaining GD/PTS abbreviations is small (~11px) and muted-gray on white — worth an explicit contrast check since it's the only place those abbreviations are explained.
- `.claude/launch.json` names port 3000 for the dev server, but Vite is actually binding to 8080 this run — worth reconciling so future previews (and this skill's browser tooling) target the right port automatically.

## Questions to Consider

1. If a fan can't trust the Wins column today, what QA step let a header/row column-count mismatch ship on the one page whose entire job is reporting standings accurately?
2. The homepage carries six full sections of design effort, but the two pages fans return to weekly (standings, schedule) are the plainest tables on the site — should design investment follow usage frequency instead?
3. Every result — blowout or nail-biter — renders in the same neutral gray-black type. Is "restrained" the right choice for a product whose value proposition is competitive stakes and emotion?
