import type { FontSettings, HeroLayout, TextLayout } from '../types'
import type { ProjectTemplate } from './types'
import { WSP_TEMPLATE_TOKENS } from '../wspTokens'

export const wspDigitalAdvisoryTemplate: ProjectTemplate = {
  id: 'wsp-digital-advisory',
  name: 'WSP Digital Advisory Portfolio',
  description: 'One-page placeholder template for WSP digital advisory portfolio layouts.',
  createProject: ({ createPage }) => {
    const heroLayout: HeroLayout = {
      x: WSP_TEMPLATE_TOKENS.heroImage.x,
      y: WSP_TEMPLATE_TOKENS.heroImage.y,
      width: WSP_TEMPLATE_TOKENS.heroImage.width,
      height: WSP_TEMPLATE_TOKENS.heroImage.height,
    }
    const textLayout: TextLayout = {
      x: WSP_TEMPLATE_TOKENS.copy.x,
      y: WSP_TEMPLATE_TOKENS.copy.y,
      width: WSP_TEMPLATE_TOKENS.copy.width,
    }
    const fontSettings: FontSettings = {
      title: WSP_TEMPLATE_TOKENS.type.title,
      subtitle: WSP_TEMPLATE_TOKENS.type.subtitle,
      body: WSP_TEMPLATE_TOKENS.type.footer,
      keyFocus: WSP_TEMPLATE_TOKENS.type.eyebrow,
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
          layoutType: 'cover',
          topLabel: 'DIGITAL ADVISORY PORTFOLIO',
          title: 'Digital Experience &\nReal-Time Visualization',
          subtitle: 'For the Built Environment',
          paragraph1: 'Digital Experience & Real-Time Visualization Specialist',
          sectionTitle: 'WSP DIGITAL ADVISORY',
          paragraph2: '',
          keyFocus: ['real-time visualization', 'digital experience', 'built environment'],
          disclaimer: '',
          wspCover: {
            eyebrow: 'DIGITAL ADVISORY PORTFOLIO',
            title: 'Digital Experience &\nReal-Time Visualization',
            subtitle: 'For the Built Environment',
            professionalName: 'Cesar De Macedo',
            professionalRole: 'Digital Experience & Real-Time Visualization Specialist',
            heroImage: undefined,
            imageFit: 'cover',
            imagePositionX: 0,
            imagePositionY: 0,
            imageScale: 1,
            overlayOpacity: 0,
            showTopAccent: true,
            showImageAccent: true,
          },
        }),
      ],
    }
  },
}
