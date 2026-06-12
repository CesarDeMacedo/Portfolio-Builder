import html2canvas from 'html2canvas'
import { toPng } from 'dom-to-image-more'
import { jsPDF } from 'jspdf'
import { getCanvasSize, getExportScale } from './canvas'
import { datedPdfName, downloadBlob, sanitizeFilename } from './fileUtils'
import type { ExportQuality, PageSize, PortfolioProject } from './types'

const LINKEDIN_MAX_BYTES = 20 * 1024 * 1024

const pdfQualityPresets: Record<ExportQuality, { scale: ExportQuality; jpegQuality: number; targetBytes?: number }[]> = {
  linkedin: [
    { scale: 'linkedin', jpegQuality: 0.78, targetBytes: LINKEDIN_MAX_BYTES },
    { scale: 'linkedin', jpegQuality: 0.68, targetBytes: LINKEDIN_MAX_BYTES },
    { scale: 'web', jpegQuality: 0.58, targetBytes: LINKEDIN_MAX_BYTES },
    { scale: 'linkedin', jpegQuality: 0.5, targetBytes: LINKEDIN_MAX_BYTES },
  ],
  web: [{ scale: 'web', jpegQuality: 0.82 }],
  print: [{ scale: 'print', jpegQuality: 0.9 }],
  high: [{ scale: 'high', jpegQuality: 0.95 }],
}

const waitForPaint = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  })

export async function captureElement(element: HTMLElement, quality: ExportQuality) {
  const canvasElement = (element.classList.contains('portfolio-canvas')
    ? element
    : element.querySelector<HTMLElement>('.portfolio-canvas')) ?? element
  const width = canvasElement.offsetWidth
  const height = canvasElement.offsetHeight
  const scale = getExportScale(quality)
  document.body.classList.add('is-exporting')
  await waitForPaint()
  try {
    const dataUrl = await toPng(canvasElement, {
      width: Math.round(width * scale),
      height: Math.round(height * scale),
      cacheBust: true,
      style: {
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        width: `${width}px`,
        height: `${height}px`,
      },
    })
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('DOM image export failed'))
      img.src = dataUrl
    })
    const output = document.createElement('canvas')
    output.width = image.naturalWidth
    output.height = image.naturalHeight
    const context = output.getContext('2d')
    if (!context) throw new Error('Canvas export context failed')
    context.imageSmoothingEnabled = true
    context.imageSmoothingQuality = 'high'
    context.drawImage(image, 0, 0)
    return output
  } catch (error) {
    console.warn('DOM export failed, falling back to html2canvas.', error)
    return await html2canvas(canvasElement, {
      backgroundColor: null,
      scale: getExportScale(quality),
      useCORS: true,
      allowTaint: true,
      logging: false,
      width,
      height,
      windowWidth: width,
      windowHeight: height,
    })
  } finally {
    document.body.classList.remove('is-exporting')
  }
}

export async function exportCurrentPng(element: HTMLElement, projectName: string, quality: ExportQuality) {
  const canvas = await captureElement(element, quality)
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((value) => (value ? resolve(value) : reject(new Error('PNG export failed'))), 'image/png'),
  )
  downloadBlob(blob, `${sanitizeFilename(projectName)}_current_page.png`)
}

type PdfCaptureOptions = {
  project: PortfolioProject
  pageIds: string[]
  setActivePage: (id: string) => void
  getCanvasElement: () => HTMLElement | null
  restoreActivePage: string
}

async function buildPortfolioPdf(options: PdfCaptureOptions, captureQuality: ExportQuality, jpegQuality: number) {
  const { project, pageIds, setActivePage, getCanvasElement, restoreActivePage } = options
  const size = getCanvasSize(project.settings.pageSize as PageSize)
  const pdf = new jsPDF({
    orientation: size.width >= size.height ? 'landscape' : 'portrait',
    unit: 'px',
    format: [size.width, size.height],
    compress: true,
  })

  try {
    for (let index = 0; index < pageIds.length; index += 1) {
      setActivePage(pageIds[index])
      await waitForPaint()
      const element = getCanvasElement()
      if (!element) throw new Error('Preview canvas was not found')
      const canvas = await captureElement(element, captureQuality)
      const image = canvas.toDataURL('image/jpeg', jpegQuality)
      if (index > 0) pdf.addPage([size.width, size.height], size.width >= size.height ? 'landscape' : 'portrait')
      pdf.addImage(image, 'JPEG', 0, 0, size.width, size.height, undefined, 'FAST')
    }
  } finally {
    setActivePage(restoreActivePage)
    await waitForPaint()
  }

  return pdf
}

export async function exportPortfolioPdf(options: PdfCaptureOptions) {
  const quality = options.project.settings.exportQuality
  const attempts = pdfQualityPresets[quality]
  let bestPdf: jsPDF | undefined
  let bestBytes = Number.POSITIVE_INFINITY

  for (const attempt of attempts) {
    const pdf = await buildPortfolioPdf(options, attempt.scale, attempt.jpegQuality)
    const bytes = pdf.output('arraybuffer').byteLength
    bestPdf = pdf
    bestBytes = bytes
    if (!attempt.targetBytes || bytes <= attempt.targetBytes) break
  }

  if (!bestPdf) throw new Error('PDF export failed')

  if (quality === 'linkedin' && bestBytes > LINKEDIN_MAX_BYTES) {
    console.warn(`LinkedIn PDF is ${(bestBytes / 1024 / 1024).toFixed(1)} MB, above the 20 MB target.`)
  }

  const suffix = quality === 'linkedin' ? 'LinkedIn' : undefined
  bestPdf.save(datedPdfName(options.project.settings.projectName, suffix))
}
