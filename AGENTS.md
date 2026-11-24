# AGENTS.md

Guidance for AI coding agents (Claude Code, Codex, Cursor, etc.) working in this repository.

## Communication Language

- **Always reply to the user in Vietnamese** in the chat session (responses, explanations,
  summaries, status updates, questions).
- **Keep everything else in English**: code, comments, naming (variables/functions/files),
  file contents, commit messages, branch names, PR titles/descriptions, prompts sent to
  subagents, and documentation files.

## Project Overview

A public, shareable checklist for a first App Store (iOS) release, published with GitHub Pages
(Jekyll, default theme) at https://tranleo148.github.io/app-store-release-checklist/.

- `index.md` is the Vietnamese page (site home), `en.md` the English one; keep both in step, same sections
  and items. These two pages are the one place where content is written in Vietnamese.
- Keep the checklist generic: no app, company, project or person names, no ids, keys, prices or dates.
- `README.md`, `AGENTS.md` and `CLAUDE.md` are excluded from the site in `_config.yml`.
- No build step: pushing `main` publishes the site.

## Git Workflow

### Commit Style

Use simple traditional commit messages: a short imperative sentence describing what changed —
no `type:` prefix, no scopes (this repo does **not** use Conventional Commits).

**Scope prefix:** when a change touches only one platform/area, prefix the message with it in
square brackets. Omit the prefix for shared code or changes spanning several areas.

| Files touched | Prefix |
|---------------|--------|
| Only `index.md` (Vietnamese page) | `[VI] ` |
| Only `en.md` (English page) | `[EN] ` |
| Both pages, site config, or repo files | none |

Examples:
- `Add the App Compliance step for China mainland`
- `[VI] Fix wording in the in-app purchase section`

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
