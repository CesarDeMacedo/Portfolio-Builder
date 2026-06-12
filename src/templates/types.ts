import type { PortfolioPage, PortfolioProject, ThemeSettings } from '../types'

export type CreatePage = (overrides?: Partial<PortfolioPage>) => PortfolioPage

export type ProjectTemplateContext = {
  createPage: CreatePage
  defaultTheme: ThemeSettings
}

export type ProjectTemplate = {
  id: string
  name: string
  description: string
  createProject: (context: ProjectTemplateContext) => PortfolioProject
}
