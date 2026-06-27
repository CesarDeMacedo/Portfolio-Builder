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
