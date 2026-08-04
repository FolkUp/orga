# orga/translations/ — Multi-language translation packages

**Established:** 2026-08-03 (S2SCOOP cont+42, Летов cycle EN cascade) → extended cont+43 EXT (kn.5 RU master mirror)
**Purpose:** Non-code source-of-truth packages для human translators (`/translator` fornit + external native readers per Vier-Augen/Quatro Olhos/Four-Eyes protocol) working on FolkUp content translation.

## Structure

```
orga/translations/
├── README.md                      (this file — umbrella index)
├── en/                            (EN target language)
│   ├── README.md                  (EN umbrella — packages inventory + protocol)
│   ├── underground/               (underground.folkup.life longform translations)
│   │   └── letov-storonka/        (Летов cycle 10-story package cont+42)
│   │       ├── README.md          (voice-formula + cultural notes + dispatch protocol)
│   │       └── source-ru/         (10 RU sources verbatim)
│   └── kn5/                       (books: kn.5 «Чужими руками»)
│       └── source-ru/             (RU master mirror для body EN cross-check cont+43 EXT)
│           ├── NOTE-cross-check-2026-08-04.md
│           └── master-v1.0.1.md   (byte-identical portal master copy)
```

**Future expected:** `en/kn2/`, `en/kn3/`, `en/kn4/`, `en/kn6/`, `en/kn7/` (body EN cascade per Iskra S253 §A4 полоса Lolik), plus DE/PT/other target languages когда pipeline расширится (per translator fornit per-language modules — see `~/.claude/skills/translator/SKILL.md`).

## Protocol

**Package = source-ru + README + optional cross-check NOTEs**
- **source-ru/*.md** — RU verbatim originals (либо copy portal/astro master OR verbatim canon)
- **README.md** — voice-formula (archetype % distribution) + ordered list + cultural translation notes + anti-AI-pattern discipline + dispatch protocol + license note
- **NOTE-*.md** — cross-check rationale, refresh triggers, snapshot metadata

**Dispatch pattern:**
1. Alisa (session PM) packages source-ru + README из canonical SoT
2. POMETKA к translator fornit (Lolik EN / Bolik DE / etc) через Drive bridge с location + brief
3. Translator ships titles + drafts back через bridge KVITANCIYA к Iskra (editorial gate)
4. Iskra 4-eyes gate → native speaker verification (Кнут DE / Quatro Olhos PT / Four-Eyes EN when established)
5. Ratification → deploy к target site OR book release

**Refresh trigger:** снапшот frozen at package creation time. Когда canonical source меняется (portal rebuild / astro content update) — Alisa OR translator ping через POMETKA + refresh mirror OR patch.

## Ownership

- **Structure + placement:** Alisa (session PM, PM route)
- **Content authoring source-ru:** original creators (Andrey byline Команданте FolkUp for essays / creator credit per work)
- **Content translation:** `/translator` fornit modules per-language
- **Ratification:** `/gutenberg` (books) OR `/lesnik` (orga longform) + Iskra editorial + native reader
- **Legal:** CC BY-SA 4.0 (Content) — see per-package README + LICENSE в repo root

## Cross-references

- `vault/memory/gdrive-channel-canonical.md` — bridge protocol Drive coordination
- `~/.claude/skills/translator/SKILL.md` — translator fornit modules
- `vault/BACKLOG.yaml` — translation pipeline tickets (TRANSLATE-EN-LETOV-STORONKA-001 etc)
- `~/.claude/rules/brand-rule-fornit-voice-procedure.md` — TIER 1 fornit materialization protocol (translator was materialized under this)

// Alisa · «полка для языков — заведена; каждой книге свой карман, каждой рукописи свой оригинал под рукой»
