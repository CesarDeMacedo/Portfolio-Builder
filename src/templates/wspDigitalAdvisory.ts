import type { FontSettings, HeroLayout, TextLayout, WspDigitalAdvisoryPageContent } from '../types'
import type { ProjectTemplate } from './types'
import { WSP_TEMPLATE_TOKENS } from '../wspTokens'

const WSP_TEMPLATE_HERO_IMAGE = '/wsp-digital-advisory/template-hero.jpg'
const WSP_FOOTER_NAME = 'Cesar De Macedo'
const WSP_FOOTER_ROLE = 'Digital Experience & Real-Time Visualization Specialist'

type WspTemplatePage = Pick<
  WspDigitalAdvisoryPageContent,
  | 'eyebrow'
  | 'title'
  | 'subtitle'
  | 'pageNumber'
  | 'pageCategory'
  | 'primaryDescription'
  | 'secondarySectionTitle'
  | 'secondaryDescription'
  | 'keyFocusItems'
  | 'footerNote'
> & {
  name: string
}

const wspPages: WspTemplatePage[] = [
  {
    name: 'INTRODUCTION',
    eyebrow: 'DIGITAL ADVISORY · PROPERTY & BUILDINGS',
    title: 'DIGITAL EXPERIENCE\nFOR THE BUILT\nENVIRONMENT',
    subtitle: 'Real-time visualization, interactive prototyping, and technical storytelling for complex buildings and infrastructure.',
    primaryDescription:
      'I combine built-environment visualization, real-time technology and AI-assisted development to transform complex project information into clear, engaging and interactive digital experiences.',
    secondarySectionTitle: 'PROFESSIONAL DIRECTION',
    secondaryDescription:
      'My current focus is supporting built-environment teams through real-time visualization, digital twin experience concepts, web-based applications and clear visual communication for clients and stakeholders.',
    pageNumber: '01',
    pageCategory: 'INTRODUCTION',
    keyFocusItems: ['BUILT ENVIRONMENT', 'REAL-TIME VISUALIZATION', 'INTERACTIVE EXPERIENCES', 'DIGITAL COMMUNICATION'],
    footerNote: 'Selected professional work and self-initiated concept studies.',
  },
  {
    name: 'DIGITAL ADVISORY CONTRIBUTION',
    eyebrow: 'DIGITAL ADVISORY · CONTRIBUTION',
    title: 'HOW I COULD SUPPORT\nDIGITAL ADVISORY',
    subtitle:
      'Translating complex digital strategies and technical information into clear, interactive and client-facing experiences.',
    primaryDescription:
      'I can help advisory and engineering teams transform technical concepts into visual prototypes, real-time environments and presentation experiences that communicate value clearly.',
    secondarySectionTitle: 'COMPLEMENTARY ROLE',
    secondaryDescription:
      'My contribution would complement consultants, engineers and digital specialists by creating the visual and interactive layer through which clients can explore and understand proposed solutions.',
    pageNumber: '02',
    pageCategory: 'CAPABILITIES',
    keyFocusItems: ['RAPID PROTOTYPING', 'CLIENT ENGAGEMENT', 'VISUAL COMMUNICATION', 'STAKEHOLDER UNDERSTANDING'],
    footerNote: 'Proposed contribution based on transferable visualization and interactive-development experience.',
  },
  {
    name: 'SMART BUILDING DIGITAL TWIN',
    eyebrow: 'SELF-INITIATED CONCEPT STUDY',
    title: 'SMART BUILDING\nDIGITAL TWIN\nEXPERIENCE',
    subtitle:
      'Connecting spatial context, building systems and operational information within one unified digital environment.',
    primaryDescription:
      'This concept explores how BIM, building systems and operational information could be presented through an intuitive visual experience for facility teams, clients and stakeholders.',
    secondarySectionTitle: 'PROJECT VALUE',
    secondaryDescription:
      'A shared spatial environment can make building performance, asset conditions and system relationships easier to understand than disconnected drawings, dashboards and technical platforms.',
    pageNumber: '03',
    pageCategory: 'CASE STUDY',
    keyFocusItems: ['DIGITAL TWIN CONCEPT', 'BUILDING SYSTEMS', 'SPATIAL CONTEXT', 'ASSET VISIBILITY'],
    footerNote: 'Self-initiated concept study using simulated information. Not an operational digital twin.',
  },
  {
    name: 'BUILDING PERFORMANCE DASHBOARD',
    eyebrow: 'SMART BUILDING · DIGITAL EXPERIENCE',
    title: 'INTERACTIVE BUILDING\nPERFORMANCE\nDASHBOARD',
    subtitle: 'A visual framework for operational insight, energy awareness and clear stakeholder communication.',
    primaryDescription:
      'The dashboard combines building data, simulated IoT information and spatial visualization to communicate performance, comfort, energy use, alerts and asset health.',
    secondarySectionTitle: 'USER EXPERIENCE',
    secondaryDescription:
      'Instead of presenting isolated charts, the interface connects performance indicators with the building itself, helping users understand where conditions occur and why they matter.',
    pageNumber: '04',
    pageCategory: 'DIGITAL EXPERIENCE',
    keyFocusItems: ['ENERGY MONITORING', 'OCCUPANT COMFORT', 'ASSET HEALTH', 'OPERATIONAL INSIGHT'],
    footerNote: 'Conceptual interface using simulated building and operational data.',
  },
  {
    name: 'AI DATA CENTER CAMPUS',
    eyebrow: 'SELF-INITIATED CONCEPT STUDY',
    title: 'AI DATA CENTER\nINFRASTRUCTURE\nSTUDY',
    subtitle:
      'Visualizing the physical systems and dependencies behind large-scale artificial intelligence computing infrastructure.',
    primaryDescription:
      'This study presents an AI data center campus as an interconnected system of computing facilities, electrical infrastructure, cooling, water, backup power and support operations.',
    secondarySectionTitle: 'COMMUNICATION CHALLENGE',
    secondaryDescription:
      'Data center projects involve complex systems that conventional architectural imagery alone cannot fully explain. This visual approach reveals their relationships across the complete campus.',
    pageNumber: '05',
    pageCategory: 'CASE STUDY',
    keyFocusItems: ['DATA CENTERS', 'POWER INFRASTRUCTURE', 'COOLING SYSTEMS', 'CAMPUS PLANNING'],
    footerNote: 'Self-initiated concept study using simulated project and performance information.',
  },
  {
    name: 'INTERDEPENDENT SYSTEMS',
    eyebrow: 'AI INFRASTRUCTURE · SYSTEMS',
    title: 'VISUALIZING\nINTERDEPENDENT\nBUILDING SYSTEMS',
    subtitle: 'Making power, cooling, water and data flows visible within a mission-critical facility.',
    primaryDescription:
      'The visualization identifies and colour-codes major operational systems, helping viewers understand the dependencies required to maintain reliable and continuous data center performance.',
    secondarySectionTitle: 'PROJECT VALUE',
    secondaryDescription:
      'This communication approach can support technical discussions, client presentations and design reviews by connecting engineering systems with their physical and operational context.',
    pageNumber: '06',
    pageCategory: 'SYSTEMS VISUALIZATION',
    keyFocusItems: ['SYSTEM DEPENDENCIES', 'OPERATIONAL RESILIENCE', 'FACILITY RELIABILITY', 'TECHNICAL REVIEW'],
    footerNote: 'Conceptual systems visualization. Technical values and infrastructure details are illustrative.',
  },
  {
    name: 'COMPLEX FACILITY VISUALIZATION',
    eyebrow: 'SELF-INITIATED CONCEPT STUDY',
    title: 'COMPLEX FACILITY\nOPERATIONS\nVISUALIZATION',
    subtitle: 'Using real-time environments to communicate technical systems, spaces and operational context.',
    primaryDescription:
      'This project explores how a complex industrial facility can become an accessible real-time environment for technical review, stakeholder communication and asset-level understanding.',
    secondarySectionTitle: 'TRANSFERABLE VALUE',
    secondaryDescription:
      'The visualization principles can support hospitals, laboratories, data centers, advanced manufacturing facilities and other building types involving complex technical and operational systems.',
    pageNumber: '07',
    pageCategory: 'CASE STUDY',
    keyFocusItems: ['COMPLEX FACILITIES', 'REAL-TIME ENVIRONMENT', 'TECHNICAL VISUALIZATION', 'STAKEHOLDER REVIEW'],
    footerNote: 'Self-initiated concept study using simulated information. Not an operational facility model.',
  },
  {
    name: 'OPERATIONAL SEQUENCES',
    eyebrow: 'FACILITY OPERATIONS · VISUAL STUDY',
    title: 'OPERATIONAL SEQUENCE\nAND ASSET\nCOMMUNICATION',
    subtitle: 'Visualizing inspection routes, maintenance access and component status within spatial context.',
    primaryDescription:
      'The sequence demonstrates how an interactive environment could guide users through operational activities while maintaining a clear relationship between people, assets and facility spaces.',
    secondarySectionTitle: 'USER UNDERSTANDING',
    secondaryDescription:
      'Spatial visualization can make procedures and asset information easier to understand than conventional drawings or disconnected tables, particularly for planning, training and technical review.',
    pageNumber: '08',
    pageCategory: 'OPERATIONAL STUDY',
    keyFocusItems: ['INSPECTION ROUTES', 'MAINTENANCE ACCESS', 'ASSET STATUS', 'OPERATIONAL CLARITY'],
    footerNote: 'Conceptual operational sequence using simulated assets, activities and facility information.',
  },
  {
    name: 'BIM TO REAL-TIME',
    eyebrow: 'DIGITAL DELIVERY · WORKFLOW',
    title: 'BIM TO REAL-TIME\nVISUALIZATION\nWORKFLOW',
    subtitle: 'Transforming structured project information into an optimized and presentation-ready interactive environment.',
    primaryDescription:
      'The workflow illustrates the transition from BIM-based geometry and asset information into a real-time environment prepared for visualization, interaction and stakeholder communication.',
    secondarySectionTitle: 'DIGITAL CONTINUITY',
    secondaryDescription:
      'Geometry optimization, material preparation, metadata conversion and interface design create a bridge between technical project models and accessible client-facing digital experiences.',
    pageNumber: '09',
    pageCategory: 'WORKFLOW',
    keyFocusItems: ['BIM DATA', 'GEOMETRY OPTIMIZATION', 'METADATA CONVERSION', 'UNREAL ENGINE WORKFLOW'],
    footerNote: 'Conceptual workflow illustrating transferable BIM-to-real-time visualization principles.',
  },
  {
    name: 'REAL-TIME DATA APPLICATION',
    eyebrow: 'INTERACTIVE APPLICATION DEVELOPMENT',
    title: 'REAL-TIME DATA\nWEB EXPERIENCE',
    subtitle: 'Connecting public data, project context and visual storytelling through a browser-based application.',
    primaryDescription:
      'This application demonstrates how live or regularly updated public data can be organized into an intuitive visual experience for exploring infrastructure conditions, performance and trends.',
    secondarySectionTitle: 'FROM DATA TO DECISION',
    secondaryDescription:
      'The objective is not simply to display information, but to explain what changed, where it occurred, why it matters and how users can explore it.',
    pageNumber: '10',
    pageCategory: 'WEB APPLICATION',
    keyFocusItems: ['REAL-TIME DATA', 'WEB APPLICATION', 'VISUAL DASHBOARDS', 'INTERACTIVE STORYTELLING'],
    footerNote: 'Public data sources and update frequency will be identified in the completed application.',
  },
  {
    name: 'INTERACTIVE PROJECT COMMUNICATION',
    eyebrow: 'CLIENT · STAKEHOLDER EXPERIENCE',
    title: 'INTERACTIVE PROJECT\nCOMMUNICATION\nPLATFORM',
    subtitle: 'Turning technical projects and digital strategies into clear and engaging presentation experiences.',
    primaryDescription:
      'The concept replaces a linear presentation with a browser-based experience where users can explore project priorities, systems, phases, visual media and performance information.',
    secondarySectionTitle: 'ADVISORY APPLICATION',
    secondaryDescription:
      'Interactive project experiences can support pursuits, proposals, workshops and executive presentations by making complex recommendations more tangible, accessible and memorable.',
    pageNumber: '11',
    pageCategory: 'PROTOTYPE',
    keyFocusItems: ['CLIENT PRESENTATIONS', 'PURSUIT COMMUNICATION', 'PROJECT NARRATIVES', 'EXECUTIVE ENGAGEMENT'],
    footerNote: 'Self-initiated prototype exploring interactive project and pursuit communication.',
  },
  {
    name: 'PROFESSIONAL FOUNDATION',
    eyebrow: 'EXPERIENCE · PROFESSIONAL PROFILE',
    title: 'BUILT-ENVIRONMENT\nVISUALIZATION\nFOUNDATION',
    subtitle:
      'Architectural understanding, cinematic communication and real-time technology applied to digital advisory experiences.',
    primaryDescription:
      'My architectural visualization background provides a strong understanding of space, design intent, materials, lighting and human experience, essential foundations for credible digital environments.',
    secondarySectionTitle: 'NEXT CONTRIBUTION',
    secondaryDescription:
      'I am interested in supporting Digital Advisory and Property & Buildings teams through real-time visualization, interactive prototypes, AI-assisted development and clear technical communication.',
    pageNumber: '12',
    pageCategory: 'PROFILE',
    keyFocusItems: ['ARCHITECTURAL VISUALIZATION', 'UNREAL ENGINE', 'INTERACTIVE DEVELOPMENT', 'AI-ASSISTED WORKFLOWS'],
    footerNote: 'Cesar De Macedo · St. Catharines, Ontario · cesardemacedo@gmail.com',
  },
]

export const wspDigitalAdvisoryTemplate: ProjectTemplate = {
  id: 'wsp-digital-advisory',
  name: 'WSP Digital Advisory Portfolio',
  description: 'Twelve-page WSP digital advisory portfolio template.',
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
    const fontSizes = {
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
        authorName: WSP_FOOTER_NAME,
        pageSize: '16:9',
        exportQuality: 'print',
      },
      defaultPageLayout: sharedLayout,
      pages: wspPages.map((page) =>
        createPage({
          ...sharedLayout,
          name: page.name,
          pageNumber: page.pageNumber,
          caseStudyLabel: page.pageCategory,
          topLabel: page.eyebrow,
          title: page.title,
          subtitle: page.subtitle,
          paragraph1: page.primaryDescription,
          sectionTitle: page.secondarySectionTitle,
          paragraph2: page.secondaryDescription,
          keyFocus: [...page.keyFocusItems],
          disclaimer: page.footerNote,
          heroImage: WSP_TEMPLATE_HERO_IMAGE,
          wspDigital: {
            ...page,
            heroImage: WSP_TEMPLATE_HERO_IMAGE,
            imageFit: 'cover',
            imagePositionX: 0,
            imagePositionY: 0,
            imageScale: 1,
            keyFocusLabel: 'KEY FOCUS',
            footerName: WSP_FOOTER_NAME,
            footerRole: WSP_FOOTER_ROLE,
            fontSizes: { ...fontSizes },
          },
        }),
      ),
    }
  },
}
