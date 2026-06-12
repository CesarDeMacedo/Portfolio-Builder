export type PageSize = '16:9' | '4:3' | 'A4 landscape' | '9:16'

export type ExportQuality = 'linkedin' | 'web' | 'print' | 'high'

export type FitMode = 'cover' | 'contain'

export type ThemeSettings = {
  backgroundColor: string
  primaryColor: string
  accentColor: string
  textColor: string
}

export type FontSettings = {
  title: number
  subtitle: number
  body: number
  keyFocus: number
}

export type ImageSettings = {
  fit: FitMode
  zoom: number
  x: number
  y: number
}

export type HeroLayout = {
  width: number
  height: number
  x: number
  y: number
}

export type TextLayout = {
  x: number
  y: number
  width: number
}

export type PageLayoutPreset = {
  imageSettings: ImageSettings
  heroLayout: HeroLayout
  textLayout: TextLayout
  fontSettings: FontSettings
  theme: ThemeSettings
}

export type PortfolioPage = {
  id: string
  name: string
  pageNumber: string
  template: 'case-study-standard'
  caseStudyLabel: string
  topLabel: string
  title: string
  subtitle: string
  paragraph1: string
  sectionTitle: string
  paragraph2: string
  keyFocus: string[]
  disclaimer: string
  heroImage?: string
  imageSettings: ImageSettings
  heroLayout: HeroLayout
  textLayout: TextLayout
  fontSettings: FontSettings
  theme: ThemeSettings
}

export type ProjectSettings = {
  projectName: string
  portfolioTitle: string
  authorName: string
  pageSize: PageSize
  exportQuality: ExportQuality
}

export type PortfolioProject = {
  version: 1
  settings: ProjectSettings
  pages: PortfolioPage[]
  defaultPageLayout?: PageLayoutPreset
}
