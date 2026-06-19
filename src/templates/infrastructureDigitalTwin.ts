import type { FontSettings, HeroLayout, TextLayout } from '../types'
import type { ProjectTemplate } from './types'

export const infrastructureDigitalTwinTemplate: ProjectTemplate = {
  id: 'infrastructure-digital-twin',
  name: 'Infrastructure Digital Twin',
  description: 'Six-page editable case study template for infrastructure visualization and digital twin portfolios.',
  createProject: ({ createPage, defaultTheme }) => {
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
    const disclaimer =
      'Inspired by publicly available information about nuclear infrastructure and digital technologies. Not affiliated with AtkinsRealis.'

    return {
      version: 1,
      templateId: 'infrastructure-digital-twin',
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
        createPage({
          ...sharedLayout,
          name: 'Operational Sequence Storyboard',
          pageNumber: '04',
          title: 'Operational Sequence Storyboard',
          subtitle:
            'Real-time visual sequencing for inspection, maintenance, and component review within a nuclear infrastructure environment.',
          paragraph1:
            'This storyboard concept demonstrates how operational workflows can be communicated through clear visual sequencing, combining inspection routes, maintenance access, and component status review in a format designed for planning, technical communication, and operational understanding.',
          sectionTitle: 'Operational Sequence Storyboard',
          paragraph2:
            'The sequence focuses on key stages of a service water system workflow and shows how interface layers, asset annotations, and procedural timing can support training, review, documentation, and decision-ready visualization.',
          keyFocus: [
            'storyboarding',
            'operational sequences',
            'inspection workflows',
            'maintenance planning',
            'technical communication',
          ],
          disclaimer,
          heroImage: '/editable-rebuild/hero_04.jpg',
        }),
        createPage({
          ...sharedLayout,
          name: 'Live Data Interface',
          pageNumber: '05',
          title: 'Live Data Interface Concept',
          subtitle:
            'Real-time dashboard visualization for asset monitoring, system health, maintenance insight, and decision-ready digital twin communication.',
          paragraph1:
            'This page explores how real-time operational information can be integrated into a digital twin interface, combining spatial context, asset visibility, and system health into a clear presentation format for technical teams and stakeholders.',
          sectionTitle: 'Live Data Interface',
          paragraph2:
            'The concept focuses on live monitoring, alert visibility, maintenance awareness, and asset-level understanding, showing how dashboard-driven visualization can support review, communication, and operational decision-making in complex infrastructure environments.',
          keyFocus: [
            'live monitoring',
            'asset visibility',
            'system health',
            'maintenance insight',
            'decision support',
          ],
          disclaimer,
          heroImage: '/editable-rebuild/hero_05.jpg',
        }),
        createPage({
          ...sharedLayout,
          name: 'Stakeholder Review',
          pageNumber: '06',
          title: 'Stakeholder Review and Decision Support',
          subtitle:
            'High-impact real-time 3D presentation workflows for technical alignment, stakeholder communication, and informed decision-making.',
          paragraph1:
            'This page explores how real-time 3D visualization can be presented in a highly impactful format to support internal reviews, stakeholder communication, and multidisciplinary decision-making within complex nuclear infrastructure environments.',
          sectionTitle: 'Stakeholder Review and Decision Support',
          paragraph2:
            'The concept emphasizes visual communication as a platform for alignment, buy-in, and technical clarity, showing how digital twin presentations can support collaboration, review workflows, and presentation-ready communication across teams.',
          keyFocus: [
            'stakeholder review',
            'decision support',
            'technical alignment',
            'presentation impact',
            'multidisciplinary communication',
          ],
          disclaimer,
          heroImage: '/editable-rebuild/hero_06.jpg',
        }),
      ],
    }
  },
}
