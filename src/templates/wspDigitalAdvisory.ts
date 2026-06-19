import type { FontSettings, HeroLayout, TextLayout } from '../types'
import type { ProjectTemplate } from './types'
import { WSP_TEMPLATE_TOKENS } from '../wspTokens'

export const wspDigitalAdvisoryTemplate: ProjectTemplate = {
  id: 'wsp-digital-advisory',
  name: 'WSP Digital Advisory Portfolio',
  description: 'One-page placeholder template for WSP digital advisory portfolio layouts.',
  createProject: ({ createPage }) => {
    const heroLayout: HeroLayout = {
      x: WSP_TEMPLATE_TOKENS.nuclear.hero.x,
      y: WSP_TEMPLATE_TOKENS.nuclear.hero.y,
      width: WSP_TEMPLATE_TOKENS.nuclear.hero.width,
      height: WSP_TEMPLATE_TOKENS.nuclear.hero.height,
    }
    const textLayout: TextLayout = {
      x: WSP_TEMPLATE_TOKENS.nuclear.textZone.x,
      y: WSP_TEMPLATE_TOKENS.nuclear.textZone.y,
      width: WSP_TEMPLATE_TOKENS.nuclear.textZone.width,
    }
    const fontSettings: FontSettings = {
      title: WSP_TEMPLATE_TOKENS.type.title,
      subtitle: WSP_TEMPLATE_TOKENS.type.subtitle,
      body: WSP_TEMPLATE_TOKENS.type.body,
      keyFocus: WSP_TEMPLATE_TOKENS.type.keyFocusItem,
    }
    const sharedLayout = {
      imageSettings: { fit: 'cover' as const, zoom: 1, x: 0, y: 0 },
      heroLayout,
      textLayout,
      fontSettings,
      theme: {
        backgroundColor: '#f7f8f8',
        primaryColor: '#20262d',
        accentColor: '#d71920',
        textColor: '#303842',
      },
    }

    return {
      version: 1,
      templateId: 'wsp-digital-advisory',
      settings: {
        projectName: 'WSP Digital Advisory Portfolio',
        portfolioTitle: 'WSP Digital Advisory Portfolio',
        authorName: 'Cesar De Macedo',
        pageSize: '16:9',
        exportQuality: 'print',
      },
      defaultPageLayout: sharedLayout,
      pages: [
        createPage({
          ...sharedLayout,
          name: 'Digital Experience',
          pageNumber: '01',
          topLabel: 'SELF-INITIATED CONCEPT STUDY',
          title: 'Page Title',
          subtitle: 'A concise description of the project, capability or digital experience.',
          paragraph1: 'Use this area to explain the project, challenge or opportunity in a concise and clear way.',
          sectionTitle: 'PROJECT VALUE',
          paragraph2: 'Explain how the work supports stakeholder understanding, digital strategy, technical review or client communication.',
          keyFocus: ['real-time visualization', 'interactive prototyping', 'digital experience', 'technical communication'],
          disclaimer: 'Self-initiated concept study using simulated or publicly available information.',
          wspDigital: {
            eyebrow: 'SELF-INITIATED CONCEPT STUDY',
            title: 'Page Title',
            subtitle: 'A concise description of the project, capability or digital experience.',
            pageNumber: '01',
            pageCategory: 'CASE STUDY',
            primaryDescription: 'Use this area to explain the project, challenge or opportunity in a concise and clear way.',
            secondarySectionTitle: 'PROJECT VALUE',
            secondaryDescription:
              'Explain how the work supports stakeholder understanding, digital strategy, technical review or client communication.',
            heroImage: undefined,
            imageFit: 'cover',
            imagePositionX: 0,
            imagePositionY: 0,
            imageScale: 1,
            keyFocusLabel: 'KEY FOCUS',
            keyFocusItems: ['real-time visualization', 'interactive prototyping', 'digital experience', 'technical communication'],
            footerNote: 'Self-initiated concept study using simulated or publicly available information.',
            footerName: 'Cesar De Macedo',
            footerRole: 'Digital Experience & Real-Time Visualization Specialist',
            fontSizes: {
              eyebrow: WSP_TEMPLATE_TOKENS.type.eyebrow,
              title: WSP_TEMPLATE_TOKENS.type.title,
              subtitle: WSP_TEMPLATE_TOKENS.type.subtitle,
              body: WSP_TEMPLATE_TOKENS.type.body,
              sectionTitle: WSP_TEMPLATE_TOKENS.type.sectionTitle,
              pageNumber: WSP_TEMPLATE_TOKENS.type.pageNumber,
              pageCategory: WSP_TEMPLATE_TOKENS.type.pageCategory,
              keyFocusLabel: WSP_TEMPLATE_TOKENS.type.keyFocusLabel,
              keyFocusItem: WSP_TEMPLATE_TOKENS.type.keyFocusItem,
              footerNote: WSP_TEMPLATE_TOKENS.type.footer,
              footerName: WSP_TEMPLATE_TOKENS.type.footerName,
              footerRole: WSP_TEMPLATE_TOKENS.type.footerRole,
            },
          },
        }),
      ],
    }
  },
}
