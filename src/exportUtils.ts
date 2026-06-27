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
      // Prepare link annotation coordinates for Page 10 (email and LinkedIn)
      const annotations: { x: number; y: number; w: number; h: number; url: string }[] = []
      try {
        const pageObj = project.pages.find((p) => p.id === pageIds[index])
        if (pageObj && pageObj.pageNumber === '10') {
          // locate the rendered footer elements inside the preview element
          const canvasElement = (element.classList && element.classList.contains('portfolio-canvas')
            ? element
            : (element.querySelector && element.querySelector('.portfolio-canvas')) ?? element) as HTMLElement
          const emailLinkEl = canvasElement.querySelector('.wsp-digital-email-link') as HTMLElement | null
          const linkedinLinkEl = canvasElement.querySelector('.wsp-digital-link-target') as HTMLElement | null

          const cRect = canvasElement.getBoundingClientRect()
          const previewScaleX = cRect.width / Math.max(1, canvasElement.offsetWidth)
          const previewScaleY = cRect.height / Math.max(1, canvasElement.offsetHeight)

          const normalizeRect = (rect: DOMRect) => ({
            x: (rect.left - cRect.left) / previewScaleX,
            y: (rect.top - cRect.top) / previewScaleY,
            width: rect.width / previewScaleX,
            height: rect.height / previewScaleY,
          })

          if (emailLinkEl) {
            const rect = emailLinkEl.getBoundingClientRect()
            const normalized = normalizeRect(rect)
            annotations.push({
              x: Math.round(normalized.x),
              y: Math.round(normalized.y),
              w: Math.round(normalized.width),
              h: Math.round(normalized.height),
              url: 'mailto:cesardemacedo@gmail.com',
            })
          }

          if (linkedinLinkEl) {
            const rect = linkedinLinkEl.getBoundingClientRect()
            const normalized = normalizeRect(rect)
            annotations.push({
              x: Math.round(normalized.x),
              y: Math.round(normalized.y),
              w: Math.round(normalized.width),
              h: Math.round(normalized.height),
              url: 'https://www.linkedin.com/in/cesar-de-macedo-3b4a5a51',
            })
          }
        }
      } catch {
        // non-fatal: continue without annotations
      }
      const canvas = await captureElement(element, captureQuality)
      const image = canvas.toDataURL('image/jpeg', jpegQuality)
      if (index > 0) pdf.addPage([size.width, size.height], size.width >= size.height ? 'landscape' : 'portrait')
      pdf.addImage(image, 'JPEG', 0, 0, size.width, size.height, undefined, 'FAST')
      // add link annotations (if any) on this page
      try {
        if (annotations.length) {
          for (const a of annotations) {
            // jsPDF link coordinates use PDF user units (px here) with origin at top-left
            // add a transparent link over the rendered text area
            pdf.link(a.x, a.y, a.w, a.h, { url: a.url })
          }
        }
      } catch {
        // ignore annotation failures
      }
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

  // Expose the generated PDF data URL for automated inspection (non-persistent)
  try {
    ;(window as unknown as { __lastExportedPdfDataUrl?: string }).__lastExportedPdfDataUrl = bestPdf.output('datauristring')
  } catch {
    // ignore
  }

  const suffix = quality === 'linkedin' ? 'LinkedIn' : undefined
  bestPdf.save(datedPdfName(options.project.settings.projectName, suffix))
}
