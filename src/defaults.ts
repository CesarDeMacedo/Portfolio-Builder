import type {
  FontSettings,
  HeroLayout,
  ImageSettings,
  PageLayoutPreset,
  PortfolioPage,
  PortfolioProject,
  TemplateId,
  TextLayout,
  ThemeSettings,
  WspCoverPageContent,
  WspDigitalAdvisoryPageContent,
  WspDigitalFontSizes,
  WspProfileComposition,
  WspProfileImageAlignment,
  WspProfilePageContent,
} from './types'
import { defaultProjectTemplate, getProjectTemplate } from './templates'
import { WSP_TEMPLATE_TOKENS } from './wspTokens'

export const defaultTheme: ThemeSettings = {
  backgroundColor: '#f4f7f8',
  primaryColor: '#071b35',
  accentColor: '#1a9fd8',
  textColor: '#152436',
}

export const defaultFonts: FontSettings = {
  title: 66,
  subtitle: 22,
  body: 20,
  keyFocus: 18,
}

export const defaultHeroLayout: HeroLayout = {
  width: 690,
  height: 600,
  x: 835,
  y: 174,
}

export const defaultImageSettings: ImageSettings = {
  fit: 'cover',
  zoom: 1,
  x: 0,
  y: 0,
}

export const defaultTextLayout: TextLayout = {
  x: 74,
  y: 150,
  width: 695,
}

export function getSixteenNineHeight(width: number) {
  return Math.round(width * 9 / 16)
}

export function createDefaultWspDigitalFontSizes(fontSettings?: Partial<FontSettings>): WspDigitalFontSizes {
  return {
    eyebrow: WSP_TEMPLATE_TOKENS.type.eyebrow,
    title: fontSettings?.title ?? WSP_TEMPLATE_TOKENS.type.title,
    subtitle: fontSettings?.subtitle ?? WSP_TEMPLATE_TOKENS.type.subtitle,
    body: fontSettings?.body ?? WSP_TEMPLATE_TOKENS.type.body,
    sectionTitle: WSP_TEMPLATE_TOKENS.type.sectionTitle,
    pageNumber: WSP_TEMPLATE_TOKENS.type.pageNumber,
    pageCategory: WSP_TEMPLATE_TOKENS.type.pageCategory,
    keyFocusLabel: WSP_TEMPLATE_TOKENS.type.keyFocusLabel,
    keyFocusItem: fontSettings?.keyFocus ?? WSP_TEMPLATE_TOKENS.type.keyFocusItem,
    footerNote: WSP_TEMPLATE_TOKENS.type.footer,
    footerName: WSP_TEMPLATE_TOKENS.type.footerName,
    footerRole: WSP_TEMPLATE_TOKENS.type.footerRole,
  }
}

function normalizeWspDigitalFontSizes(
  fontSizes?: Partial<WspDigitalFontSizes>,
  fontSettings?: Partial<FontSettings>,
): WspDigitalFontSizes {
  return {
    ...createDefaultWspDigitalFontSizes(fontSettings),
    ...fontSizes,
  }
}

function normalizeHeroLayout(layout: HeroLayout): HeroLayout {
  return {
    ...layout,
    height: getSixteenNineHeight(layout.width),
  }
}

export function createLayoutPreset(page: PortfolioPage): PageLayoutPreset {
  return {
    imageSettings: { ...page.imageSettings },
    heroLayout: { ...page.heroLayout },
    textLayout: { ...(page.textLayout ?? defaultTextLayout) },
    fontSettings: { ...page.fontSettings },
    theme: { ...page.theme },
  }
}

export function normalizePage(page: PortfolioPage): PortfolioPage {
  return {
    ...createPage(page),
    id: page.id,
    name: page.name,
    keyFocus: [...(page.keyFocus ?? [])],
    imageSettings: { ...defaultImageSettings, ...page.imageSettings },
    heroLayout: { ...defaultHeroLayout, ...page.heroLayout },
    textLayout: { ...defaultTextLayout, ...page.textLayout },
    fontSettings: { ...defaultFonts, ...page.fontSettings },
    theme: { ...defaultTheme, ...page.theme },
  }
}

export function createDefaultWspCoverContent(
  page?: Partial<PortfolioPage>,
  professionalName = 'Cesar De Macedo',
): WspCoverPageContent {
  const imageSettings = { ...defaultImageSettings, ...page?.imageSettings }

  return {
    eyebrow:
      page?.wspCover?.eyebrow ??
      (page?.topLabel === 'WSP DIGITAL ADVISORY PORTFOLIO' ? 'DIGITAL ADVISORY PORTFOLIO' : page?.topLabel) ??
      'DIGITAL ADVISORY PORTFOLIO',
    title: page?.wspCover?.title ?? page?.title ?? 'Digital Experience &\nReal-Time Visualization',
    subtitle: page?.wspCover?.subtitle ?? page?.subtitle ?? 'For the Built Environment',
    professionalName: page?.wspCover?.professionalName ?? professionalName,
    professionalRole:
      page?.wspCover?.professionalRole ??
      page?.paragraph1 ??
      'Digital Experience & Real-Time Visualization Specialist',
    heroImage: page?.wspCover?.heroImage ?? page?.heroImage,
    imageFit: page?.wspCover?.imageFit ?? imageSettings.fit,
    imagePositionX: page?.wspCover?.imagePositionX ?? imageSettings.x,
    imagePositionY: page?.wspCover?.imagePositionY ?? imageSettings.y,
    imageScale: page?.wspCover?.imageScale ?? imageSettings.zoom,
    overlayOpacity: page?.wspCover?.overlayOpacity ?? 0,
    showTopAccent: page?.wspCover?.showTopAccent ?? true,
    showImageAccent: page?.wspCover?.showImageAccent ?? true,
  }
}

function createProfileCard(title: string, description: string, icon: string) {
  return {
    id: crypto.randomUUID(),
    title,
    description,
    icon,
  }
}

function normalizeProfileComposition(composition?: string): WspProfileComposition {
  if (composition === 'grid' || composition === 'three-focus') return 'grid'
  return 'horizontal'
}

function normalizeProfileImageAlignment(alignment?: string): WspProfileImageAlignment {
  if (alignment === 'left' || alignment === 'center' || alignment === 'right') return alignment
  return 'right'
}

export function createDefaultWspProfileContent(page?: Partial<PortfolioPage>): WspProfilePageContent {
  const imageSettings = { ...defaultImageSettings, ...page?.imageSettings }

  return {
    eyebrow: page?.wspProfile?.eyebrow ?? 'DIGITAL ADVISORY',
    title: page?.wspProfile?.title ?? 'How I Could Support\nDigital Advisory',
    introduction:
      page?.wspProfile?.introduction ??
      'Transforming complex systems and project information into clear, interactive digital experiences.',
    cards: (page?.wspProfile?.cards?.length ? page.wspProfile.cards : [
      createProfileCard(
        'Real-Time Visualization',
        'Interactive environments for review and communication.',
        '01',
      ),
      createProfileCard(
        'Experience Prototyping',
        'Concepts for smart buildings and digital twins.',
        '02',
      ),
      createProfileCard(
        'Interactive Applications',
        'Web-based tools combining data and storytelling.',
        '03',
      ),
      createProfileCard(
        'Technical Communication',
        'Visual narratives for complex systems and workflows.',
        '04',
      ),
    ]).slice(0, 4).map((card) => ({ ...card, id: card.id || crypto.randomUUID() })),
    composition: normalizeProfileComposition(page?.wspProfile?.composition),
    sideImage: page?.wspProfile?.sideImage ?? page?.heroImage,
    imageFit: page?.wspProfile?.imageFit ?? imageSettings.fit,
    imagePositionX: page?.wspProfile?.imagePositionX ?? imageSettings.x,
    imagePositionY: page?.wspProfile?.imagePositionY ?? imageSettings.y,
    imageScale: page?.wspProfile?.imageScale ?? imageSettings.zoom,
    imageWidth: WSP_TEMPLATE_TOKENS.heroImage.width,
    imageHeight: WSP_TEMPLATE_TOKENS.heroImage.height,
    imageAlignment: normalizeProfileImageAlignment(page?.wspProfile?.imageAlignment),
    eyebrowFontSize: WSP_TEMPLATE_TOKENS.type.eyebrow,
    titleFontSize: WSP_TEMPLATE_TOKENS.type.title,
    introductionFontSize: WSP_TEMPLATE_TOKENS.type.subtitle,
    cardTitleFontSize: WSP_TEMPLATE_TOKENS.type.cardTitle,
    cardDescriptionFontSize: WSP_TEMPLATE_TOKENS.type.cardDescription,
    cardLabelFontSize: WSP_TEMPLATE_TOKENS.type.cardNumber,
    footerFontSize: WSP_TEMPLATE_TOKENS.type.footer,
    cardsGap: WSP_TEMPLATE_TOKENS.profile.cardsGap,
    cardPadding: WSP_TEMPLATE_TOKENS.profile.cardPadding,
    titleIntroSpacing: WSP_TEMPLATE_TOKENS.profile.titleIntroSpacing,
    introCardsSpacing: page?.wspProfile?.introCardsSpacing ?? 0,
    footerLabel: page?.wspProfile?.footerLabel ?? 'Cesar De Macedo · Digital Experience & Real-Time Visualization',
    pageNumber: page?.wspProfile?.pageNumber ?? page?.pageNumber ?? '02',
    showTopAccent: page?.wspProfile?.showTopAccent ?? true,
    showImageAccent: page?.wspProfile?.showImageAccent ?? true,
    showSideImage: page?.wspProfile?.showSideImage ?? true,
    showFooter: page?.wspProfile?.showFooter ?? true,
  }
}

function normalizeWspKeyFocus(items?: string[]) {
  const defaults = ['real-time visualization', 'interactive prototyping', 'digital experience', 'technical communication']
  const nextItems = (items?.length ? items : defaults).map((item) => item.trim()).filter(Boolean).slice(0, 5)

  return [...nextItems, ...defaults].slice(0, Math.max(3, nextItems.length))
}

function cleanPageCategory(value?: string) {
  const category = value?.replace('/', '').trim()
  return category || 'CASE STUDY'
}

export function createDefaultWspDigitalContent(
  page?: Partial<PortfolioPage>,
  footerName = 'Cesar De Macedo',
): WspDigitalAdvisoryPageContent {
  const imageSettings = { ...defaultImageSettings, ...page?.imageSettings }
  const cover = page?.wspCover
  const profile = page?.wspProfile
  const existing = page?.wspDigital
  const fontSizes = normalizeWspDigitalFontSizes(existing?.fontSizes, page?.fontSettings)

  return {
    eyebrow: existing?.eyebrow ?? cover?.eyebrow ?? profile?.eyebrow ?? page?.topLabel ?? 'SELF-INITIATED CONCEPT STUDY',
    title: existing?.title ?? cover?.title ?? profile?.title ?? page?.title ?? 'Page Title',
    subtitle:
      existing?.subtitle ??
      cover?.subtitle ??
      profile?.introduction ??
      page?.subtitle ??
      'A concise description of the project, capability or digital experience.',
    pageNumber: existing?.pageNumber ?? profile?.pageNumber ?? page?.pageNumber ?? '01',
    pageCategory: existing?.pageCategory ?? cleanPageCategory(page?.caseStudyLabel),
    primaryDescription:
      existing?.primaryDescription ??
      page?.paragraph1 ??
      'Use this area to explain the project, challenge or opportunity in a concise and clear way.',
    secondarySectionTitle: existing?.secondarySectionTitle ?? page?.sectionTitle ?? 'PROJECT VALUE',
    secondaryDescription:
      existing?.secondaryDescription ??
      page?.paragraph2 ??
      'Explain how the work supports stakeholder understanding, digital strategy, technical review or client communication.',
    heroImage: existing?.heroImage ?? cover?.heroImage ?? profile?.sideImage ?? page?.heroImage,
    imageFit: existing?.imageFit ?? cover?.imageFit ?? profile?.imageFit ?? imageSettings.fit,
    imagePositionX: existing?.imagePositionX ?? cover?.imagePositionX ?? profile?.imagePositionX ?? imageSettings.x,
    imagePositionY: existing?.imagePositionY ?? cover?.imagePositionY ?? profile?.imagePositionY ?? imageSettings.y,
    imageScale: existing?.imageScale ?? cover?.imageScale ?? profile?.imageScale ?? imageSettings.zoom,
    keyFocusLabel: existing?.keyFocusLabel ?? 'KEY FOCUS',
    keyFocusItems: normalizeWspKeyFocus(existing?.keyFocusItems ?? page?.keyFocus),
    footerNote:
      existing?.footerNote ??
      (profile?.footerLabel && !profile.footerLabel.includes('Cesar De Macedo') ? profile.footerLabel : undefined) ??
      page?.disclaimer ??
      'Self-initiated concept study using simulated or publicly available information.',
    footerName: existing?.footerName ?? cover?.professionalName ?? footerName,
    footerRole: existing?.footerRole ?? cover?.professionalRole ?? 'Digital Experience & Real-Time Visualization Specialist',
    fontSizes,
  }
}

function normalizeWspDigitalPage(page: PortfolioPage, footerName?: string): PortfolioPage {
  const wspDigital = createDefaultWspDigitalContent(page, footerName)
  const heroLayout = normalizeHeroLayout({ ...defaultHeroLayout, ...page.heroLayout })

  return {
    ...page,
    layoutType: undefined,
    topLabel: wspDigital.eyebrow,
    title: wspDigital.title,
    subtitle: wspDigital.subtitle,
    pageNumber: wspDigital.pageNumber,
    caseStudyLabel: wspDigital.pageCategory,
    paragraph1: wspDigital.primaryDescription,
    sectionTitle: wspDigital.secondarySectionTitle,
    paragraph2: wspDigital.secondaryDescription,
    keyFocus: [...wspDigital.keyFocusItems],
    disclaimer: wspDigital.footerNote,
    heroImage: wspDigital.heroImage,
    imageSettings: {
      fit: wspDigital.imageFit,
      x: wspDigital.imagePositionX,
      y: wspDigital.imagePositionY,
      zoom: wspDigital.imageScale,
    },
    heroLayout,
    fontSettings: {
      title: wspDigital.fontSizes.title,
      subtitle: wspDigital.fontSizes.subtitle,
      body: wspDigital.fontSizes.body,
      keyFocus: wspDigital.fontSizes.keyFocusItem,
    },
    wspDigital,
  }
}

function isTemplateId(value: unknown): value is TemplateId {
  return value === 'infrastructure-digital-twin' || value === 'wsp-digital-advisory' || value === 'stantec-visualization'
}

export function normalizeProject(project: PortfolioProject | (Partial<PortfolioProject> & { pages?: PortfolioPage[] })): PortfolioProject {
  const fallback = createDefaultProject()
  const templateId = isTemplateId(project.templateId) ? project.templateId : defaultProjectTemplate.id
  const settings = { ...fallback.settings, ...project.settings }
  const pages =
    Array.isArray(project.pages) && project.pages.length > 0
      ? project.pages
          .map(normalizePage)
          .map((page) => (templateId === 'wsp-digital-advisory' || templateId === 'stantec-visualization' ? normalizeWspDigitalPage(page, settings.authorName) : page))
      : fallback.pages
  const defaultPageLayout = project.defaultPageLayout
    ? {
        imageSettings: { ...defaultImageSettings, ...project.defaultPageLayout.imageSettings },
        heroLayout:
          templateId === 'wsp-digital-advisory' || templateId === 'stantec-visualization'
            ? normalizeHeroLayout({ ...defaultHeroLayout, ...project.defaultPageLayout.heroLayout })
            : { ...defaultHeroLayout, ...project.defaultPageLayout.heroLayout },
        textLayout: { ...defaultTextLayout, ...project.defaultPageLayout.textLayout },
        fontSettings: { ...defaultFonts, ...project.defaultPageLayout.fontSettings },
        theme: { ...defaultTheme, ...project.defaultPageLayout.theme },
      }
    : undefined

  return {
    version: 1,
    templateId,
    settings,
    pages,
    defaultPageLayout,
  }
}

export function createPage(overrides: Partial<PortfolioPage> = {}): PortfolioPage {
  const id = crypto.randomUUID()

  return {
    id,
    name: overrides.name ?? `Page ${overrides.pageNumber ?? '05'}`,
    pageNumber: overrides.pageNumber ?? '05',
    template: 'case-study-standard',
    caseStudyLabel: overrides.caseStudyLabel ?? '/ CASE STUDY',
    topLabel: overrides.topLabel ?? 'SELF-INITIATED CONCEPT STUDY',
    title: overrides.title ?? 'Live Data Interface Concept',
    subtitle:
      overrides.subtitle ??
      'Real-time dashboard visualization for asset monitoring, system health, maintenance insight, and decision-ready digital twin communication.',
    paragraph1:
      overrides.paragraph1 ??
      'This page explores how real-time operational information can be integrated into a digital twin interface, combining spatial context, asset visibility, and system health into a clear presentation format for technical teams and stakeholders.',
    sectionTitle: overrides.sectionTitle ?? 'LIVE DATA INTERFACE',
    paragraph2:
      overrides.paragraph2 ??
      'The concept focuses on live monitoring, alert visibility, maintenance awareness, and asset-level understanding, showing how dashboard-driven visualization can support review, communication, and operational decision-making in complex infrastructure environments.',
    keyFocus: overrides.keyFocus ?? [
      'live monitoring',
      'asset visibility',
      'system health',
      'maintenance insight',
      'decision support',
    ],
    disclaimer:
      overrides.disclaimer ??
      'Inspired by publicly available information about nuclear infrastructure and digital technologies. Not affiliated with AtkinsRealis.',
    heroImage: overrides.heroImage,
    imageSettings: overrides.imageSettings ?? { ...defaultImageSettings },
    heroLayout: overrides.heroLayout ?? { ...defaultHeroLayout },
    textLayout: overrides.textLayout ?? { ...defaultTextLayout },
    fontSettings: overrides.fontSettings ?? { ...defaultFonts },
    theme: overrides.theme ?? { ...defaultTheme },
    ...overrides,
  }
}

export function createDefaultProject(): PortfolioProject {
  return defaultProjectTemplate.createProject({ createPage, defaultTheme })
}

export function createProjectFromTemplate(templateId: TemplateId): PortfolioProject {
  return getProjectTemplate(templateId).createProject({ createPage, defaultTheme })
}
