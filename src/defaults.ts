import type { FontSettings, HeroLayout, ImageSettings, PageLayoutPreset, PortfolioPage, PortfolioProject, TextLayout, ThemeSettings } from './types'
import { defaultProjectTemplate } from './templates'

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
  return defaultProjectTemplate.createProject({ createPage, defaultTheme })
}
