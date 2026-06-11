import type { PageSize } from './types'

export const canvasSizes: Record<PageSize, { width: number; height: number }> = {
  '16:9': { width: 1600, height: 900 },
  '4:3': { width: 1600, height: 1200 },
  'A4 landscape': { width: 1600, height: 1131 },
  '9:16': { width: 900, height: 1600 },
}

export function getCanvasSize(pageSize: PageSize) {
  return canvasSizes[pageSize]
}

export function getExportScale(quality: string) {
  if (quality === 'web') return 2
  if (quality === 'high') return 4
  return 3
}
