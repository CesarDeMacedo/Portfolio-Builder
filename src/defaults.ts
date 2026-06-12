import type { FontSettings, HeroLayout, ImageSettings, PageLayoutPreset, PortfolioPage, PortfolioProject, TextLayout, ThemeSettings } from './types'

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

export function normalizeProject(project: PortfolioProject): PortfolioProject {
  const fallback = createDefaultProject()
  const pages = Array.isArray(project.pages) && project.pages.length > 0 ? project.pages.map(normalizePage) : fallback.pages

  return {
    version: 1,
    settings: { ...fallback.settings, ...project.settings },
    pages,
    defaultPageLayout: project.defaultPageLayout
      ? {
          imageSettings: { ...defaultImageSettings, ...project.defaultPageLayout.imageSettings },
          heroLayout: { ...defaultHeroLayout, ...project.defaultPageLayout.heroLayout },
          textLayout: { ...defaultTextLayout, ...project.defaultPageLayout.textLayout },
          fontSettings: { ...defaultFonts, ...project.defaultPageLayout.fontSettings },
          theme: { ...defaultTheme, ...project.defaultPageLayout.theme },
        }
      : undefined,
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
  const heroLayout: HeroLayout = {
    x: 496,
    y: 153,
    width: 994,
    height: 565,
  }
  const textLayout: TextLayout = {
    x: 78,
    y: 105,
    width: 405,
  }
  const fontSettings: FontSettings = {
    title: 36,
    subtitle: 16,
    body: 15,
    keyFocus: 14,
  }
  const sharedLayout = {
    imageSettings: { fit: 'cover' as const, zoom: 1, x: 0, y: 0 },
    heroLayout,
    textLayout,
    fontSettings,
    theme: { ...defaultTheme },
  }
  const disclaimer = 'Inspired by publicly available information about nuclear infrastructure and digital technologies. Not affiliated with AtkinsRealis.'

  return {
    version: 1,
    settings: {
      projectName: 'Black Lab Portfolio',
      portfolioTitle: 'Infrastructure Digital Twin Portfolio',
      authorName: 'Black Lab',
      pageSize: '16:9',
      exportQuality: 'print',
    },
    defaultPageLayout: sharedLayout,
    pages: [
      createPage({
        ...sharedLayout,
        name: 'Nuclear Facility Overview',
        pageNumber: '01',
        title: 'Nuclear Digital Twin Visualization Concept',
        subtitle:
          'Storyboard, real-time 3D visualization, BIM-to-Unreal workflow, and digital twin communication for complex nuclear infrastructure.',
        paragraph1:
          'This self-initiated concept study explores how cinematic 3D visualization, Unreal Engine workflows, interactive presentation design, and AI-enhanced visual development can support digital twin communication for complex infrastructure environments.',
        sectionTitle: 'Nuclear Facility Digital Twin Overview',
        paragraph2:
          'The overview image was designed as a high-level stakeholder-facing visualization that communicates facility structure, operational zones, asset relationships, and decision-ready information through a real-time digital twin presentation format.',
        keyFocus: [
          'facility overview',
          'asset zoning',
          'stakeholder communication',
          'maintenance insight',
          'decision-ready presentation',
        ],
        disclaimer,
        heroImage: '/editable-rebuild/hero_01.jpg',
      }),
      createPage({
        ...sharedLayout,
        name: 'BIM to Real-Time Workflow',
        pageNumber: '02',
        title: 'BIM to Real-Time Visualization Workflow',
        subtitle:
          'Structured BIM-to-Unreal workflow for digital twin communication, technical review, and real-time infrastructure presentation.',
        paragraph1:
          'This page demonstrates the transition from BIM-based authoring data to an optimized real-time visualization environment, showing how structured geometry, metadata, and technical asset information can evolve from an engineering model into a visually rich, accessible, and presentation-ready environment.',
        sectionTitle: 'BIM to Real-Time Visualization',
        paragraph2:
          'The workflow illustrates how BIM data is prepared, refined, and transformed into a real-time environment for digital twin communication, asset-level understanding, technical review, and Unreal Engine-based visualization pipelines.',
        keyFocus: [
          'BIM data',
          'geometry optimization',
          'metadata conversion',
          'real-time visualization',
          'Unreal Engine workflow',
        ],
        disclaimer,
        heroImage: '/editable-rebuild/hero_02.jpg',
      }),
      createPage({
        ...sharedLayout,
        name: 'Systems Components Overview',
        pageNumber: '03',
        title: 'Systems and Components Overview',
        subtitle:
          'Cutaway visualization and technical communication of internal systems, components, and operational relationships within a nuclear infrastructure environment.',
        paragraph1:
          'This page explores how complex nuclear infrastructure can be communicated through a structured cutaway visualization, revealing internal systems, equipment zones, and component relationships in a clear and presentation-ready format.',
        sectionTitle: 'Systems and Components Overview',
        paragraph2:
          'The visualization focuses on internal organization, system readability, and technical storytelling, showing how illustration-driven communication can support multidisciplinary understanding, stakeholder review, and high-impact presentation workflows.',
        keyFocus: [
          'systems visualization',
          'component communication',
          'technical storytelling',
          'cross-sectional clarity',
          'high-impact explainer graphics',
        ],
        disclaimer,
        heroImage: '/editable-rebuild/hero_03.jpg',
      }),
    ],
  }
}
