import { infrastructureDigitalTwinTemplate } from './infrastructureDigitalTwin'

export type { ProjectTemplate, ProjectTemplateContext } from './types'

export const projectTemplates = [infrastructureDigitalTwinTemplate]

export const defaultProjectTemplate = infrastructureDigitalTwinTemplate
