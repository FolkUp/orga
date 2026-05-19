# auth.ts — honest security review (2026-05-20)

Scope: `src/middleware/auth.ts` and how it actually behaves in the
currently-deployed build. Replaces the inaccurate Cooper-subagent report
that framed three documented Phase 3B in-progress states as "BLOCKING"
production vulnerabilities.

## The architectural fact that changes everything

`astro.config.mjs` ships with `output: 'static'`. Astro pre-renders every
route at build time, including `/api/ecosystem/health` and `/api/ecosystem/metadata`.
Look at the deployed artifact:

```
$ cat astro/dist/api/ecosystem/health
{"error":"AUTHENTICATION_REQUIRED","message":"Bearer token required for API access","ecosystem":["ORGA","DECL","DOCS","AGIL","DSHB"]}
```

That is a **static file**. nginx serves it byte-for-byte. The middleware in
`src/middleware/auth.ts` only ran once — during `npm run build` — and the
"no Authorization header" branch produced this response. After build, the
middleware is dormant: it does not execute on any production request.

Practical consequence:
- There is no runtime authentication to bypass — there is no runtime endpoint.
- Sending any `Authorization: Bearer …` header against `https://underground.folkup.life/api/ecosystem/health` will return the same hardcoded JSON 401 body, because nginx serves the file regardless of headers.
- Any "auth bypass / credential exposure / JWT vulnerability" framing about the live site is incorrect on its face.

The middleware code is groundwork for a future Phase 3C where `output` flips
to `'server'` (or a hybrid adapter) and the API endpoints become real. Until
that flip happens, the code in `auth.ts` is dead at runtime.

## Real findings, ranked by what they actually mean

### P2 — production-readiness, will matter only when `output` flips

| # | Where | What | Why it matters |
|---|-------|------|----------------|
| 1 | `auth.ts:25` | `JWT_SECRET: process.env.ORGA_API_SECRET \|\| 'dev-secret-change-in-production'` | Fallback string in source. Harmless now (no JWT verify runs). When Phase 3C ships, this fallback must be removed and the env var made strictly required, or any deployment without the env returns a happy "valid" answer using the dev secret. |
| 2 | `auth.ts:61-109` | `validateEcosystemToken` constructs `decoded` from scratch, ignoring `token` contents except `length < 10` | The "validation" is a mock by design (comment says so). Currently dead code. When uncomment-time arrives, replace with real JWT library (`jose` recommended over hand-rolled), enforce algorithm allow-list (`HS256` or asymmetric), validate `iss`/`aud`/`exp`/`nbf`. |
| 3 | `auth.ts:230-238` | `generateEcosystemToken` returns `phase3b-${project}-${perms}-${subject}-${Date.now()}` | Predictable, unsigned string. Useful as a placeholder. Replace with `jose.SignJWT` in Phase 3C; never ship this format to a real `Authorization: Bearer` flow. |
| 4 | `auth.ts:258-294` | In-memory `rateLimitStore = new Map(...)` | Resets on every container restart and is per-process. Fine for a single-instance Docker setup behind one nginx-proxy. If we ever horizontally scale or run multiple replicas, this becomes useless — switch to Redis or nginx `limit_req_zone`. Not a vulnerability, just architectural. |
| 5 | `auth.ts:296-302` | `console.log('Development ecosystem token:', ...)` when `NODE_ENV==='development'` | The logged token is unsigned placeholder, so today it leaks nothing useful. After Phase 3C this becomes a "secret in stdout" risk if dev tokens become real JWTs — gate behind an explicit `DEBUG_TOKENS` flag or remove. |

### P3 — clarity / dead code

| # | Where | What |
|---|-------|------|
| 6 | `auth.ts:31` | `process.env.ADDITIONAL_ORIGINS?.split(',') \|\| []` extends CORS whitelist from env. Fine as long as that env is set in trusted infrastructure (it is — self-hosted runner env). Not "environment variable injection" — that requires a user-controllable env, which doesn't exist here. |
| 7 | `auth.ts:215` | Origin echo properly checks against `ALLOWED_ORIGINS` whitelist before reflecting. Correct CORS pattern. |
| 8 | Whole file | The "Banking-level / Constitutional Framework" comments are decoration, no behaviour. Can be cut without losing function. |

### Not-findings

The following were flagged by the prior Cooper subagent as
"CRITICAL/BLOCKING" — they are none of those things in the current build:

- **"503 / VPS down / critical infrastructure failure"** — the live site was at 403 (now 200 after `docker restart`), nginx 1.29.8 was up, ORGA-DEPLOY-001 captures the root cause (stale bind-mount after `mv`-swap).
- **"No `.github/workflows` found"** — `.github/workflows/deploy.yml` exists and is well-designed (now patched to rsync-in-place).
- **"Authentication bypass vulnerability"** — there is no runtime authentication to bypass; see top of doc.
- **"Hardcoded production credential / credential exposure"** — `'dev-secret-change-in-production'` is a fallback string in dormant code. It will become a real concern in Phase 3C; today it secures nothing because nothing checks it.

## What to actually do, by priority

1. **When Phase 3C work starts (`output` flips to `server` or hybrid)** — every P2 item above becomes blocking. Resolve them in the same PR that flips the output mode, not afterwards.
2. **Now** — none of the P2 items requires action; the middleware doesn't run. Optionally: add a comment block at the top of `auth.ts` stating "DORMANT in `output: static` builds; activates with Phase 3C" so the next reader doesn't repeat the Cooper-subagent misreading.
3. **Decide consciously about `/api/ecosystem/*`** — right now those routes serve a hardcoded "Bearer required" 401 to everyone forever. If something is supposed to actually consume them across the FolkUp ecosystem, they don't work; flip to server output or rebuild them as Cloudflare Workers / a separate service. If they were placeholder for Phase 3C, that's fine — just document it.

## Methodology

- Read `src/middleware/auth.ts` end-to-end from disk (lines 1-303, this session).
- Read `astro.config.mjs` for output mode.
- Inspected `dist/api/ecosystem/health` and `metadata` as built artifacts on disk.
- No subagent narratives used; everything in this file is anchored to a line of source or a file on disk that can be re-checked.

— Alice, with `// Купер`-style scope discipline and no theater.
