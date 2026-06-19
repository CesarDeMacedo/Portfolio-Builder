export type PageSize = '16:9' | '4:3' | 'A4 landscape' | '9:16'

export type ExportQuality = 'linkedin' | 'web' | 'print' | 'high'

export type TemplateId = 'infrastructure-digital-twin' | 'wsp-digital-advisory'

export type WspLayoutType = 'cover' | 'profile'

export type WspProfileComposition = 'horizontal' | 'grid'

export type WspProfileImageAlignment = 'left' | 'center' | 'right'

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

export type WspCoverPageContent = {
  eyebrow: string
  title: string
  subtitle: string
  professionalName: string
  professionalRole: string
  heroImage?: string
  imageFit: FitMode
  imagePositionX: number
  imagePositionY: number
  imageScale: number
  overlayOpacity: number
  showTopAccent: boolean
  showImageAccent: boolean
}

export type WspProfileCard = {
  id: string
  title: string
  description: string
  icon?: string
}

export type WspProfilePageContent = {
  eyebrow: string
  title: string
  introduction: string
  cards: WspProfileCard[]
  composition: WspProfileComposition
  sideImage?: string
  imageFit: FitMode
  imagePositionX: number
  imagePositionY: number
  imageScale: number
  imageWidth: number
  imageHeight: number
  imageAlignment: WspProfileImageAlignment
  eyebrowFontSize: number
  titleFontSize: number
  introductionFontSize: number
  cardTitleFontSize: number
  cardDescriptionFontSize: number
  cardLabelFontSize: number
  footerFontSize: number
  cardsGap: number
  cardPadding: number
  titleIntroSpacing: number
  introCardsSpacing: number
  footerLabel: string
  pageNumber: string
  showTopAccent: boolean
  showImageAccent: boolean
  showSideImage: boolean
  showFooter: boolean
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
  layoutType?: WspLayoutType
  wspCover?: WspCoverPageContent
  wspProfile?: WspProfilePageContent
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
  templateId: TemplateId
  settings: ProjectSettings
  pages: PortfolioPage[]
  defaultPageLayout?: PageLayoutPreset
}
