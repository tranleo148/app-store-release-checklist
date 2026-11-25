# AGENTS.md

Guidance for AI coding agents (Claude Code, Codex, Cursor, etc.) working in this repository.

## Communication Language

- **Always reply to the user in Vietnamese** in the chat session (responses, explanations,
  summaries, status updates, questions).
- **Keep everything else in English**: code, comments, naming (variables/functions/files),
  file contents, commit messages, branch names, PR titles/descriptions, prompts sent to
  subagents, and documentation files.

## Project Overview

Public, shareable checklists for a first store release of a mobile app, published with GitHub Pages
(Jekyll) at https://tranleo148.github.io/app-store-release-checklist/. The repo keeps its old name on
purpose: renaming it would break the Pages URL already shared.

- One folder per checklist, listed under `checklists` in `_config.yml` (slug + tab name, in tab order):
  `app-store/` (iOS) and `google-play/` (Android). In each, `index.md` is Vietnamese and `en.md` English; keep
  the two in step, same sections and items. The checklists are the one place where content is in Vietnamese.
  The markdown holds no language links: the layout's VI / EN switch does that.
- A new checklist: its folder, an entry in `checklists` (slug, tab `name`, `platform` for the changelog pill),
  and an icon in `_includes/checklist-icon.html`; the tabs, language switch, download name and changelog pills
  follow from the slug.
- Redirect stubs, kept so shared links work: `index.html` (site root) → `app-store/`, `en/index.html` and
  `en.html` → `app-store/en.html` (the App Store checklist lived at the root before the split).
- Keep the checklist generic: no app, company, project or person names, no ids, keys, prices or dates.
- `README.md`, `AGENTS.md`, `CLAUDE.md` and the license files are excluded from the site in `_config.yml`.
- Licenses: the checklist content is CC BY 4.0 (`LICENSE`, official text, so GitHub detects it); the site
  code (layout, includes, CSS, JS) is MIT (`LICENSE-CODE`). Do not edit `LICENSE`.
- `_layouts/default.html` wraps every page: a sticky header with the toolbar (VI / EN switch to the same page
  in the other language; on checklist pages, download the page's `.md` from the raw file; a GitHub link styled
  as a Star button; theme switch that follows the system until the reader picks one) and the checklist tabs
  (links with `aria-current` on the current one, none on the changelog pages), footer
  (author credit from `author` in `_config.yml`, CC BY 4.0 link, changelog, feedback). Styles in
  `assets/css/site.css`, scripts in `assets/js/site.js`.
- UI strings for both languages live in `_includes/i18n.html`; a new English page sets `lang: en` in its
  front matter.
- No build step: pushing `main` publishes the site.

### Changelog

- One changelog for every checklist. Every commit that changes a checklist's content adds an entry at the top
  of `_data/changelog.yml` in the same commit: date, type (`added` / `changed` / `fixed` / `removed`),
  `platforms` (the checklist folders it applies to, e.g. `[app-store]`; leave it out when it applies to all),
  one line in `vi` and one in `en`, and an optional `anchor` (the changed section's heading id on each page,
  only for entries with one platform).
  Changes to the site only (layout, styles, scripts) get no entry, unless they change how readers reach a
  checklist (URLs, navigation): those get an entry without `platforms`.
- Each entry starts with a pill per platform (the checklist's icon and its `platform` name from `_config.yml`).
  Every checklist page shows the same 5 newest entries in the recent-changes box under its title, always open
  (`_includes/changelog-list.html`, used by `_layouts/default.html`); `changelog.md` / `changelog-en.md`
  list them all.
- Renaming a section heading changes its id: update the `anchor` values that point at it.

## Git Workflow

### Commit Style

Use simple traditional commit messages: a short imperative sentence describing what changed —
no `type:` prefix, no scopes (this repo does **not** use Conventional Commits).

**Scope prefix:** when a change touches only one platform/area, prefix the message with it in
square brackets. Omit the prefix for shared code or changes spanning several areas.

| Files touched | Prefix |
|---------------|--------|
| Only `app-store/` (and its changelog entry) | `[App Store] ` |
| Only `google-play/` (and its changelog entry) | `[Google Play] ` |
| Several checklists, home pages, site code, or repo files | none |

Examples:
- `Add the App Compliance step for China mainland`
- `[Google Play] Fix wording in the in-app purchase section`

Never add AI attribution or references to AI tools in commit messages.

### Branch Style

`<type>/<kebab-description>` — full words, not abbreviations. Types: `feature`, `bugfix`,
`hotfix`, `refactor`, `chore`.

- Good: `feature/device-registration-language-timezone`
- Good: `bugfix/notification-channel-crash`
- Avoid: `feat/...`, `fix/...` (short Conventional Commits forms)
- Avoid: a bare name or a person's name

`hotfix/` is only for an urgent patch going straight to production, not for ordinary bug fixes.

### Branches & PRs

- The owner commits directly to `main` (a docs-only repo; every push publishes the site).
- Contributions from others come as pull requests to `main`; review the generic-content rule above
  before merging.
