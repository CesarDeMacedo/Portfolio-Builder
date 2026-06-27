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
