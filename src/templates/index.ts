import { infrastructureDigitalTwinTemplate } from './infrastructureDigitalTwin'
import { stantecVisualizationTemplate } from './stantecVisualization'
import { wspDigitalAdvisoryTemplate } from './wspDigitalAdvisory'
import type { TemplateId } from '../types'

export type { ProjectTemplate, ProjectTemplateContext } from './types'

export const projectTemplates = [infrastructureDigitalTwinTemplate, wspDigitalAdvisoryTemplate, stantecVisualizationTemplate]

export const defaultProjectTemplate = infrastructureDigitalTwinTemplate

export function getProjectTemplate(templateId: TemplateId) {
  return projectTemplates.find((template) => template.id === templateId) ?? defaultProjectTemplate
}
