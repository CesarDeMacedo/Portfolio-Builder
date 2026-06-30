import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dataPath = path.join(root, 'src/templates/oodiSmartBuildingData.json')
const project = JSON.parse(await readFile(dataPath, 'utf8'))

const expectedTitles = [
  'OODI SMART BUILDING INTELLIGENCE',
  'FROM FRAGMENTED DATA TO A CLEAR BUILDING STORY',
  'A CONNECTED VIEW OF BUILDING PERFORMANCE',
  'UTILITY-AWARE RESOURCE PERFORMANCE',
  'BUILDING INTELLIGENCE THROUGH SPATIAL STORYTELLING',
  'DETERMINISTIC INSIGHTS WITHOUT UNSUPPORTED CLAIMS',
  'CLEAR DISTINCTION BETWEEN REAL AND CONCEPTUAL DATA',
  'FROM PRODUCT CONCEPT TO DEPLOYED MVP',
]

assert.equal(project.templateId, 'oodi-smart-building')
assert.equal(project.pages.length, 8)
assert.equal(project.settings.projectName, 'Oodi Smart Building Case Study')
assert.equal(project.settings.portfolioTitle, 'Oodi Smart Building Intelligence')
assert.equal(project.settings.authorName, 'Cesar De Macedo')
assert.equal(project.settings.pageSize, '16:9')
assert.equal(project.settings.exportQuality, 'linkedin')

for (const [index, page] of project.pages.entries()) {
  const pageNumber = String(index + 1).padStart(2, '0')
  assert.equal(page.pageNumber, pageNumber)
  assert.equal(page.wspDigital.pageNumber, pageNumber)
  assert.equal(page.title, expectedTitles[index])
  assert.equal(page.wspDigital.title, expectedTitles[index])
  assert.equal(page.keyFocus.length, 5)
  assert.equal(page.wspDigital.keyFocusItems.length, 5)
  assert.equal(page.heroImage, undefined)
  assert.equal(page.wspDigital.heroImage, undefined)
  assert.equal(page.theme.backgroundColor, '#031226')
  assert.equal(page.theme.primaryColor, '#F5F8FC')
  assert.equal(page.theme.accentColor, '#35CFFF')
  assert.equal(page.theme.textColor, '#A8BCD5')
}

const serialized = JSON.stringify(project)
assert.equal(/\bStantec\b/i.test(serialized), false)
assert.equal(/\bWSP\b/i.test(serialized), false)
assert.equal(/verified energy savings|measured ROI|connected BMS|live digital twin/i.test(serialized), false)

const [registry, types, app, css, renderer] = await Promise.all([
  readFile(path.join(root, 'src/templates/index.ts'), 'utf8'),
  readFile(path.join(root, 'src/types.ts'), 'utf8'),
  readFile(path.join(root, 'src/App.tsx'), 'utf8'),
  readFile(path.join(root, 'src/index.css'), 'utf8'),
  readFile(path.join(root, 'src/wspDigitalAdvisoryPage.tsx'), 'utf8'),
])

assert.match(registry, /oodiSmartBuildingTemplate/)
assert.match(types, /'oodi-smart-building'/)
assert.match(app, /'oodi-smart-building': 'Oodi Smart Building Case Study'/)
assert.match(app, /themeVariant="oodi"/)
assert.match(css, /--oodi-bg/)
assert.match(css, /--oodi-panel/)
assert.match(css, /--oodi-panel-raised/)
assert.match(css, /--oodi-accent-secondary/)
assert.match(css, /--oodi-warm-accent/)
assert.match(renderer, /oodi-digital-canvas/)

console.log('Oodi template verified: 8 editable pages, isolated theme, one hero image slot per page')
