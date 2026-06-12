# Agent Guide

## Project

Portfolio Builder is a Vite + React + TypeScript app for creating editable portfolio and case-study pages, then exporting them as PNG or PDF.

The current default project is a 6-page editable infrastructure digital twin portfolio rebuilt from a saved PDF reference. It is defined as the default project template in `src/templates/infrastructureDigitalTwin.ts`. The default hero assets live in `public/editable-rebuild/`.

## Stack

- React
- TypeScript
- Vite
- Zustand with `localStorage` persistence
- `html2canvas`, `dom-to-image-more`, and `jspdf` for exports
- `lucide-react` for icons
- Tailwind CSS import plus custom CSS in `src/index.css`

## Commands

- `npm run dev` - start the local Vite dev server
- `npm run build` - TypeScript and production build verification
- `npm run lint` - ESLint verification

When a local app URL is needed, use:

```txt
http://127.0.0.1:5173
```

## Important Files

- `src/App.tsx` - main UI, sidebar controls, preview, and portfolio page renderer
- `src/store.ts` - Zustand state, project actions, unsaved-change tracking, persistence migration
- `src/defaults.ts` - default constants, page factory, normalization helpers, default template entry point
- `src/templates/` - project template registry and template definitions
- `src/types.ts` - shared TypeScript types for projects and pages
- `src/exportUtils.ts` - PNG and PDF export helpers
- `src/fileUtils.ts` - JSON/image file helpers
- `src/canvas.ts` - page size dimensions
- `src/index.css` - app and portfolio layout styling
- `public/editable-rebuild/` - default project hero assets

## Data And Backup Rules

The app persists the current working project in browser storage under this key:

```txt
black-lab-portfolio-builder
```

Do not treat `localStorage` as a durable backup. The user-facing durable backup workflow is:

- **Save Backup** downloads a timestamped project JSON file.
- **Load Project** imports a previously saved project JSON file.
- **New Project** starts from the default editable project.
- **Duplicate Project** clones the current project with new page IDs.

Do not clear or overwrite `localStorage` unless the user explicitly asks. If the UI shows unexpected pages, first inspect the Git state and explain that browser storage can override the committed defaults.

## Editing Guidance

- Keep pages editable through the existing `PortfolioPage` data model whenever possible.
- Avoid replacing editable pages with full-page screenshots unless the user explicitly asks for visual-only recovery.
- If adding default project images, place them in `public/` and reference them with root-relative paths such as `/editable-rebuild/hero_01.jpg`.
- New reusable layouts should be added as project templates in `src/templates/`.
- Register templates from `src/templates/index.ts`.
- Keep `src/defaults.ts` focused on factories, normalization, and delegating the default project to `defaultProjectTemplate`.
- Preserve `Save Backup` and `Load Project` behavior when changing store persistence.
- If changing persisted state shape, bump the Zustand persist `version` in `src/store.ts` and add/update `migrate`.
- Do not commit `node_modules`, `dist`, logs, generated PDFs, or user Downloads files.

## Verification

Before claiming a code change is complete, run:

```bash
npm run build
npm run lint
```

For UI changes, also verify the local app manually or with Playwright when practical. Key checks:

- The app loads at `http://127.0.0.1:5173`.
- The default project shows 6 pages.
- `Save Backup` downloads a JSON file.
- `Load Project` can restore a saved JSON file.
- `New Project` and `Duplicate Project` keep pages editable.

## Git Workflow

- Check `git status --short` before committing.
- Commit source changes and any public assets required by defaults.
- Use clear commit messages, for example:

```txt
feat: add project backup workflow
docs: add agent guide
```
