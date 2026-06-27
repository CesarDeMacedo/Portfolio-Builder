import type { PortfolioPage, PortfolioProject } from '../types'
import stantecVisualizationData from './stantecVisualizationData.json'
import type { ProjectTemplate } from './types'

type StantecTemplateData = Omit<PortfolioProject, 'pages'> & {
  pages: Array<Omit<PortfolioPage, 'id'>>
}

const templateData = stantecVisualizationData as unknown as StantecTemplateData

export const stantecVisualizationTemplate: ProjectTemplate = {
  id: 'stantec-visualization',
  name: 'Stantec Visualization Portfolio',
  description:
    'Ten-page visualization portfolio focused on infrastructure, visual simulation, immersive experiences, and technical communication.',
  createProject: ({ createPage }) => ({
    version: 1,
    templateId: 'stantec-visualization',
    settings: structuredClone(templateData.settings),
    defaultPageLayout: templateData.defaultPageLayout
      ? structuredClone(templateData.defaultPageLayout)
      : undefined,
    pages: templateData.pages.map((page) => createPage(structuredClone(page))),
  }),
}
