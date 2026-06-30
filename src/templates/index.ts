import { infrastructureDigitalTwinTemplate } from './infrastructureDigitalTwin'
import { oodiSmartBuildingTemplate } from './oodiSmartBuilding'
import { stantecVisualizationTemplate } from './stantecVisualization'
import { wspDigitalAdvisoryTemplate } from './wspDigitalAdvisory'
import type { TemplateId } from '../types'

export type { ProjectTemplate, ProjectTemplateContext } from './types'

export const projectTemplates = [
  infrastructureDigitalTwinTemplate,
  wspDigitalAdvisoryTemplate,
  stantecVisualizationTemplate,
  oodiSmartBuildingTemplate,
]

export const defaultProjectTemplate = infrastructureDigitalTwinTemplate

export function getProjectTemplate(templateId: TemplateId) {
  return projectTemplates.find((template) => template.id === templateId) ?? defaultProjectTemplate
}
