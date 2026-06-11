import type { PortfolioProject } from './types'
import { normalizeProject as normalizePortfolioProject } from './defaults'

export function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Image could not be loaded'))
    image.src = src
  })
}

export async function readImageForProject(file: File) {
  const dataUrl = await readFileAsDataUrl(file)
  if (file.type === 'image/svg+xml') return dataUrl

  const image = await loadImage(dataUrl)
  const attempts = [
    { maxDimension: 3200, quality: 0.94 },
    { maxDimension: 2600, quality: 0.92 },
    { maxDimension: 2200, quality: 0.9 },
    { maxDimension: 1800, quality: 0.88 },
  ]

  for (const attempt of attempts) {
    const ratio = Math.min(1, attempt.maxDimension / Math.max(image.naturalWidth, image.naturalHeight))
    const width = Math.max(1, Math.round(image.naturalWidth * ratio))
    const height = Math.max(1, Math.round(image.naturalHeight * ratio))
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    if (!context) return dataUrl
    context.imageSmoothingEnabled = true
    context.imageSmoothingQuality = 'high'
    context.drawImage(image, 0, 0, width, height)
    const encoded = canvas.toDataURL('image/jpeg', attempt.quality)
    if (encoded.length < 3_500_000 || attempt === attempts[attempts.length - 1]) return encoded
  }

  return dataUrl
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function downloadText(text: string, filename: string) {
  downloadBlob(new Blob([text], { type: 'application/json;charset=utf-8' }), filename)
}

export function sanitizeFilename(value: string) {
  return value
    .trim()
    .replace(/[^a-z0-9-_ ]/gi, '')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '') || 'BlackLab'
}

export function datedPdfName(projectName: string) {
  const date = new Date().toISOString().slice(0, 10)
  return `${sanitizeFilename(projectName)}_Portfolio_${date}.pdf`
}

export function normalizeProject(candidate: PortfolioProject): PortfolioProject {
  if (!candidate || candidate.version !== 1 || !Array.isArray(candidate.pages) || candidate.pages.length === 0) {
    throw new Error('Invalid project JSON')
  }
  return normalizePortfolioProject(candidate)
}
