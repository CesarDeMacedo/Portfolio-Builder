import type { PortfolioPage, PortfolioProject } from '../types'
import oodiSmartBuildingData from './oodiSmartBuildingData.json'
import type { ProjectTemplate } from './types'

type OodiTemplateData = Omit<PortfolioProject, 'pages'> & {
  pages: Array<Omit<PortfolioPage, 'id'>>
}

const templateData = oodiSmartBuildingData as unknown as OodiTemplateData

export const oodiSmartBuildingTemplate: ProjectTemplate = {
  id: 'oodi-smart-building',
  name: 'Oodi Smart Building Case Study',
  description:
    'Eight-page dark architectural case study for public building data, resource performance, and conceptual building intelligence.',
  createProject: ({ createPage }) => ({
    version: 1,
    templateId: 'oodi-smart-building',
    settings: structuredClone(templateData.settings),
    defaultPageLayout: templateData.defaultPageLayout
      ? structuredClone(templateData.defaultPageLayout)
      : undefined,
    pages: templateData.pages.map((page) => createPage(structuredClone(page))),
  }),
}
