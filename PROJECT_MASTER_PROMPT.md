# PROJECT_MASTER_PROMPT — creative-ai-hub (LUCID/LAB)

## Canonical product
LUCID/LAB is the existing single-page creative prompt preparation desk. Its actual frontend is React/Vite in `client/src/pages/Home.tsx`, supported by `client/src/lib/` and the lightweight Express static server. It is a local, browser-first tool for creating and organizing briefs for imagery, video, voice and music, and discovering external providers. It is NOT a local image-generation model or a universal cloud media-rendering backend.

## Highest useful potential
- Reusable media-specific prompt editor with useful formats, camera, styling, mood and negative instructions and accessible keyboard/touch controls.
- A **real recoverable local preset library** preserving both prompt contents and editable settings. Backward compatibility with historic name-only saved entries must be honest: those names cannot restore missing prompts.
- Reliable category filters and search for external creative providers, separate from the active editor medium. Price/free credit claims are dated or qualified and linked to verified official sources.
- Copy/export in text/JSON/Markdown with clipboard fallback and no misrepresentation of external providers as connected.
- User privacy by default: local-only storage, explicit consent before sending creative briefs to paid APIs, quotas, retention controls, and no private media upload without a clear action.
- Optional later provider integrations through secure server-side adapters, scoped tokens, rate limits and real request/error tracking, never hardcoded browser secrets.
- Stable UI under malformed localStorage, denied storage permission, exhausted quota, image loading failures, low-motion preference and narrow screens.

## Implementation phases
1. Fix the existing directory filter and persistent presets: full prompt/settings, safe decoding, honest legacy entries, loading/removal and regression tests (this branch).
2. Add browser E2E tests for saving, restarting the browser, restoring and editing presets, with accessible keyboard controls and status feedback.
3. Add per-media prompt schemas, export flows, real source provenance for vendor claims, robust offline/local modes.
4. Integrate approved external media providers only with verified API contracts, secrets, spending controls and download rights.
5. Release only after `pnpm install --frozen-lockfile`, `pnpm check`, `pnpm test`, `pnpm build`, visual/accessible mobile checks, and privacy review.

## Agent contract
Read current functionality before proposing work; implement actual usable changes and tests in this repository, no duplicate repos or speculative backend. Preserve original creative direction and existing local data. Use draft PRs if CI or browser tests aren't verified. Never claim paid provider availability or publish private prompts by default. No deployment or merge without evidence.
