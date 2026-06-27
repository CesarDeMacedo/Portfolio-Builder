# Stantec Default Template Design

## Goal

Make the complete Stantec project currently saved through Portfolio Builder the default state of the `Stantec Visualization Portfolio` template. The saved project is the source of truth for all ten pages, including copy, layout, typography, project settings, and hero images.

## Source

Use the backup exported from the active browser project on June 27, 2026. It identifies itself as template `stantec-visualization`, contains ten editable pages, and includes one JPEG hero image per page as a data URL.

## Implementation Design

Extract each JPEG data URL into a static image under `public/stantec-visualization/`. Use stable, root-relative asset paths in the template instead of embedding Base64 data in TypeScript.

Update `src/templates/stantecVisualization.ts` so its project settings, default page layout, page content, page-specific layout, typography, focus items, footer fields, and image settings match the exported project. Preserve the existing `PortfolioPage` model and `createPage` factory so every page remains editable.

Do not load the backup JSON at runtime and do not change persisted browser state. Existing users may continue to see their locally persisted project; selecting the Stantec template or creating it as a new project must produce the updated default.

## Data Flow

The template factory creates the Stantec project from typed source data. Hero images resolve from `public/stantec-visualization/`. Zustand persistence continues to store user edits using the existing workflow, while Save Backup and Load Project remain unchanged.

## Validation

- Run `npm run build`.
- Run `npm run lint`.
- Open `http://127.0.0.1:5173/` and create or select the Stantec template.
- Confirm the default contains ten editable pages.
- Confirm every page displays its corresponding JPEG image.
- Compare project settings, content, layout, typography, focus items, and footer fields against the exported backup.
- Confirm Save Backup, Load Project, New Project, and Duplicate Project still operate through the existing controls.
- Confirm `linkedin` remains available as an export-quality option.

## Out of Scope

- Replacing editable pages with screenshots.
- Changing the default template for other project types.
- Clearing or overwriting the user's existing `localStorage` project.
- Refactoring unrelated application or export behavior.
