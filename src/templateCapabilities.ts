import type { TemplateId } from './types'

export function usesDigitalEditorialPage(templateId: TemplateId) {
  return (
    templateId === 'wsp-digital-advisory' ||
    templateId === 'stantec-visualization' ||
    templateId === 'oodi-smart-building'
  )
}
