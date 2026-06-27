# Stantec Default Template Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the complete ten-page Stantec project exported from Portfolio Builder the editable default for the Stantec template.

**Architecture:** A deterministic Node import script converts the user backup into a small JSON template snapshot and ten static JPEG assets. The Stantec template factory clones that snapshot and assigns fresh page IDs through the existing `createPage` factory, preserving editability and avoiding Base64 data in the application bundle.

**Tech Stack:** Node.js, React, TypeScript, Vite, Zustand, JSON template data, static JPEG assets

---

## File Map

- Create `scripts/import-stantec-backup.mjs`: validate and convert an exported Stantec backup.
- Create `scripts/verify-stantec-default.mjs`: enforce snapshot and asset integrity.
- Create `src/templates/stantecVisualizationData.json`: normalized source-of-truth project data without page IDs or Base64 images.
- Modify `src/templates/stantecVisualization.ts`: build editable projects from the normalized snapshot.
- Modify `package.json`: expose import and verification commands.
- Create `public/stantec-visualization/page-01.jpg` through `page-10.jpg`: decoded hero images.

### Task 1: Add deterministic import and integrity tooling

**Files:**
- Create: `scripts/import-stantec-backup.mjs`
- Create: `scripts/verify-stantec-default.mjs`
- Modify: `package.json`

- [ ] **Step 1: Add the verification script before generated data exists**

Create `scripts/verify-stantec-default.mjs` with Node assertions that:

```js
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dataPath = path.join(root, 'src/templates/stantecVisualizationData.json')
const project = JSON.parse(await readFile(dataPath, 'utf8'))

assert.equal(project.templateId, 'stantec-visualization')
assert.equal(project.pages.length, 10)
assert.equal(project.settings.projectName, 'Stantec Visualization Portfolio')
assert.equal(project.settings.portfolioTitle, 'Stantec – Visualization Artist Portfolio')
assert.equal(project.settings.authorName, 'Cesar De Macedo')
assert.equal(project.settings.pageSize, '16:9')
assert.equal(project.settings.exportQuality, 'linkedin')

for (const [index, page] of project.pages.entries()) {
  const pageNumber = String(index + 1).padStart(2, '0')
  const expectedImage = `/stantec-visualization/page-${pageNumber}.jpg`
  assert.equal(page.pageNumber, pageNumber)
  assert.equal(page.id, undefined)
  assert.equal(page.heroImage, expectedImage)
  assert.equal(page.wspDigital.heroImage, expectedImage)
  assert.equal(JSON.stringify(page).includes('data:image/'), false)

  const image = await readFile(path.join(root, 'public', expectedImage))
  assert.equal(image[0], 0xff)
  assert.equal(image[1], 0xd8)
  assert.equal(image.at(-2), 0xff)
  assert.equal(image.at(-1), 0xd9)
}

console.log('Stantec default template verified: 10 editable pages and 10 JPEG assets')
```

- [ ] **Step 2: Register the commands**

Add these entries to `package.json` scripts:

```json
"import:stantec": "node scripts/import-stantec-backup.mjs",
"verify:stantec": "node scripts/verify-stantec-default.mjs"
```

- [ ] **Step 3: Run the verification and confirm the expected failure**

Run: `npm run verify:stantec`

Expected: FAIL because `src/templates/stantecVisualizationData.json` does not exist yet.

- [ ] **Step 4: Add the backup importer**

Create `scripts/import-stantec-backup.mjs`:

```js
import assert from 'node:assert/strict'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const sourcePath = process.argv[2]
assert(sourcePath, 'Usage: npm run import:stantec -- <backup.json>')

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const project = JSON.parse(await readFile(path.resolve(sourcePath), 'utf8'))

assert.equal(project.templateId, 'stantec-visualization')
assert.equal(project.version, 1)
assert.equal(project.pages?.length, 10)

const assetDirectory = path.join(root, 'public/stantec-visualization')
await mkdir(assetDirectory, { recursive: true })

for (const [index, page] of project.pages.entries()) {
  const pageNumber = String(index + 1).padStart(2, '0')
  assert.equal(page.pageNumber, pageNumber)
  assert.equal(page.heroImage, page.wspDigital?.heroImage)

  const match = /^data:image\/jpeg;base64,(.+)$/s.exec(page.heroImage)
  assert(match, `Page ${pageNumber} must contain a JPEG data URL`)

  const fileName = `page-${pageNumber}.jpg`
  const publicPath = `/stantec-visualization/${fileName}`
  await writeFile(path.join(assetDirectory, fileName), Buffer.from(match[1], 'base64'))

  delete page.id
  page.heroImage = publicPath
  page.wspDigital.heroImage = publicPath
}

await writeFile(
  path.join(root, 'src/templates/stantecVisualizationData.json'),
  `${JSON.stringify(project, null, 2)}\n`,
)

console.log('Imported Stantec template data and 10 hero images')
```

- [ ] **Step 5: Commit the tooling**

```bash
git add package.json scripts/import-stantec-backup.mjs scripts/verify-stantec-default.mjs
git commit -m "chore: add Stantec template import verification"
```

### Task 2: Generate the exact saved template and wire the factory

**Files:**
- Create: `src/templates/stantecVisualizationData.json`
- Create: `public/stantec-visualization/page-01.jpg`
- Create: `public/stantec-visualization/page-02.jpg`
- Create: `public/stantec-visualization/page-03.jpg`
- Create: `public/stantec-visualization/page-04.jpg`
- Create: `public/stantec-visualization/page-05.jpg`
- Create: `public/stantec-visualization/page-06.jpg`
- Create: `public/stantec-visualization/page-07.jpg`
- Create: `public/stantec-visualization/page-08.jpg`
- Create: `public/stantec-visualization/page-09.jpg`
- Create: `public/stantec-visualization/page-10.jpg`
- Modify: `src/templates/stantecVisualization.ts`

- [ ] **Step 1: Import the approved browser backup**

Run:

```powershell
npm run import:stantec -- "C:\Users\cesar\Downloads\Stantec_Visualization_Portfolio_202606271918_project.json"
```

Expected: `Imported Stantec template data and 10 hero images`.

- [ ] **Step 2: Replace hand-maintained page data with the generated snapshot**

Replace `src/templates/stantecVisualization.ts` with:

```ts
import type { PortfolioPage, PortfolioProject } from '../types'
import stantecVisualizationData from './stantecVisualizationData.json'
import type { ProjectTemplate } from './types'

type StantecTemplateData = Omit<PortfolioProject, 'pages'> & {
  pages: Array<Omit<PortfolioPage, 'id'>>
}

const templateData = stantecVisualizationData as unknown as StantecTemplateData

export const stantecVisualizationTemplate: ProjectTemplate = {
  id: 'stantec-visualization',
  name: 'Stantec Visualization Portfolio',
  description: 'Ten-page visualization portfolio focused on infrastructure, visual simulation, immersive experiences, and technical communication.',
  createProject: ({ createPage }) => ({
    version: 1,
    templateId: 'stantec-visualization',
    settings: structuredClone(templateData.settings),
    defaultPageLayout: templateData.defaultPageLayout
      ? structuredClone(templateData.defaultPageLayout)
      : undefined,
    pages: templateData.pages.map((page) => createPage(structuredClone(page))),
  }),
}
```

- [ ] **Step 3: Run the focused integrity check**

Run: `npm run verify:stantec`

Expected: `Stantec default template verified: 10 editable pages and 10 JPEG assets`.

- [ ] **Step 4: Run static verification**

Run: `npm run build`

Expected: TypeScript and Vite build complete successfully.

Run: `npm run lint`

Expected: ESLint exits successfully with no errors.

- [ ] **Step 5: Commit the generated default**

```bash
git add src/templates/stantecVisualization.ts src/templates/stantecVisualizationData.json public/stantec-visualization
git commit -m "feat: make saved Stantec portfolio the template default"
```

### Task 3: Verify the user-visible workflow

**Files:**
- Verify only; no source changes expected.

- [ ] **Step 1: Start the application**

Run: `npm run dev -- --host 127.0.0.1`

Expected: Vite serves the app at `http://127.0.0.1:5173/`.

- [ ] **Step 2: Create a fresh Stantec project without clearing storage**

Use the template selector and New Project workflow. Do not clear or overwrite `localStorage` manually.

Expected: `Stantec Visualization Portfolio` opens with ten pages, export quality `linkedin`, and the saved project metadata.

- [ ] **Step 3: Inspect all pages**

Open pages 01 through 10.

Expected: each page is editable and displays its matching JPEG without missing-image indicators. Page text, focus items, footer fields, typography, image settings, and layout match the exported backup.

- [ ] **Step 4: Exercise persistence workflows**

Use Duplicate Project, Save Backup, and Load Project on the fresh Stantec project.

Expected: duplication creates fresh page IDs, backup download succeeds, and loading restores the same ten editable pages.

- [ ] **Step 5: Run final verification**

Run:

```bash
npm run verify:stantec
npm run build
npm run lint
```

Expected: all three commands exit successfully.
