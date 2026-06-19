import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import {
  createDefaultProject,
  createDefaultWspCoverContent,
  createDefaultWspProfileContent,
  createLayoutPreset,
  createPage,
  createProjectFromTemplate,
  normalizeProject,
} from './defaults'
import type { PortfolioPage, PortfolioProject, TemplateId, WspProfileComposition, WspProfilePageContent } from './types'
import { WSP_TEMPLATE_TOKENS } from './wspTokens'

type BuilderState = {
  project: PortfolioProject
  activePageId: string
  previewZoom: 'fit' | 0.5 | 0.75 | 1
  showGuides: boolean
  overflowWarning: boolean
  hasUnsavedChanges: boolean
  lastSavedAt?: string
  setProject: (project: PortfolioProject) => void
  newProject: () => void
  duplicateProject: () => void
  markProjectSaved: () => void
  setTemplate: (templateId: TemplateId) => void
  setSetting: <K extends keyof PortfolioProject['settings']>(key: K, value: PortfolioProject['settings'][K]) => void
  setActivePage: (id: string) => void
  updateActivePage: (patch: Partial<PortfolioPage>) => void
  updatePage: (id: string, patch: Partial<PortfolioPage>) => void
  addPage: () => void
  duplicatePage: (id: string) => void
  deletePage: (id: string) => void
  movePage: (id: string, direction: -1 | 1) => void
  saveActiveLayoutAsDefault: () => void
  setPreviewZoom: (zoom: BuilderState['previewZoom']) => void
  setShowGuides: (show: boolean) => void
  setOverflowWarning: (warning: boolean) => void
}

const defaultProject = createDefaultProject()

function cloneProject(project: PortfolioProject): PortfolioProject {
  const pages = project.pages.map((page) => ({
    ...page,
    id: crypto.randomUUID(),
    keyFocus: [...page.keyFocus],
    imageSettings: { ...page.imageSettings },
    heroLayout: { ...page.heroLayout },
    textLayout: { ...page.textLayout },
    fontSettings: { ...page.fontSettings },
    theme: { ...page.theme },
    wspCover: page.wspCover ? { ...page.wspCover } : undefined,
    wspProfile: page.wspProfile
      ? { ...page.wspProfile, cards: page.wspProfile.cards.map((card) => ({ ...card })) }
      : undefined,
  }))

  return {
    ...project,
    settings: {
      ...project.settings,
      projectName: `${project.settings.projectName} Copy`,
      portfolioTitle: `${project.settings.portfolioTitle} Copy`,
    },
    pages,
    defaultPageLayout: project.defaultPageLayout
      ? {
          imageSettings: { ...project.defaultPageLayout.imageSettings },
          heroLayout: { ...project.defaultPageLayout.heroLayout },
          textLayout: { ...project.defaultPageLayout.textLayout },
          fontSettings: { ...project.defaultPageLayout.fontSettings },
          theme: { ...project.defaultPageLayout.theme },
        }
      : undefined,
  }
}

function clonePage(page: PortfolioPage, pageNumber?: string): PortfolioPage {
  return {
    ...page,
    id: crypto.randomUUID(),
    name: `${page.name} Copy`,
    pageNumber: pageNumber ?? page.pageNumber,
    keyFocus: [...page.keyFocus],
    imageSettings: { ...page.imageSettings },
    heroLayout: { ...page.heroLayout },
    textLayout: { ...page.textLayout },
    fontSettings: { ...page.fontSettings },
    theme: { ...page.theme },
    wspCover: page.wspCover ? { ...page.wspCover } : undefined,
    wspProfile: page.wspProfile
      ? { ...page.wspProfile, cards: page.wspProfile.cards.map((card) => ({ ...card })) }
      : undefined,
  }
}

function syncWspCoverPage(page: PortfolioPage, authorName: string): PortfolioPage {
  const cover = {
    ...createDefaultWspCoverContent(page, authorName),
    ...page.wspCover,
  }

  return {
    ...page,
    layoutType: 'cover',
    topLabel: cover.eyebrow,
    title: cover.title,
    subtitle: cover.subtitle,
    paragraph1: cover.professionalRole,
    heroImage: cover.heroImage,
    imageSettings: {
      fit: cover.imageFit,
      x: cover.imagePositionX,
      y: cover.imagePositionY,
      zoom: cover.imageScale,
    },
    wspCover: cover,
  }
}

function syncWspProfilePage(page: PortfolioPage): PortfolioPage {
  const profile = {
    ...createDefaultWspProfileContent(page),
    ...page.wspProfile,
    cards: (page.wspProfile?.cards ?? createDefaultWspProfileContent(page).cards).slice(0, 4).map((card) => ({ ...card })),
  }
  const persistedComposition = profile.composition as string
  const composition: WspProfileComposition =
    persistedComposition === 'grid' || persistedComposition === 'three-focus' ? 'grid' : 'horizontal'
  const imageAlignment =
    profile.imageAlignment === 'left' || profile.imageAlignment === 'center' || profile.imageAlignment === 'right'
      ? profile.imageAlignment
      : 'right'
  const normalizedProfile = {
    ...profile,
    composition,
    imageAlignment,
    imageWidth: WSP_TEMPLATE_TOKENS.heroImage.width,
    imageHeight: WSP_TEMPLATE_TOKENS.heroImage.height,
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
  }

  return {
    ...page,
    layoutType: 'profile',
    topLabel: normalizedProfile.eyebrow,
    title: normalizedProfile.title,
    subtitle: normalizedProfile.introduction,
    paragraph1: normalizedProfile.footerLabel,
    pageNumber: normalizedProfile.pageNumber,
    heroImage: normalizedProfile.sideImage,
    imageSettings: {
      fit: normalizedProfile.imageFit,
      x: normalizedProfile.imagePositionX,
      y: normalizedProfile.imagePositionY,
      zoom: normalizedProfile.imageScale,
    },
    wspProfile: normalizedProfile,
  }
}

export const useBuilderStore = create<BuilderState>()(
  persist(
    (set, get) => ({
      project: defaultProject,
      activePageId: defaultProject.pages[0].id,
      previewZoom: 'fit',
      showGuides: false,
      overflowWarning: false,
      hasUnsavedChanges: false,
      lastSavedAt: undefined,
      setProject: (project) =>
        set(() => {
          const normalized = normalizeProject(project)

          return {
            project: normalized,
            activePageId: normalized.pages[0]?.id ?? createDefaultProject().pages[0].id,
            overflowWarning: false,
            hasUnsavedChanges: false,
            lastSavedAt: new Date().toISOString(),
          }
        }),
      newProject: () =>
        set(() => {
          const project = createDefaultProject()

          return {
            project,
            activePageId: project.pages[0].id,
            overflowWarning: false,
            hasUnsavedChanges: true,
            lastSavedAt: undefined,
          }
        }),
      duplicateProject: () =>
        set((state) => {
          const project = cloneProject(state.project)

          return {
            project,
            activePageId: project.pages[0]?.id ?? state.activePageId,
            overflowWarning: false,
            hasUnsavedChanges: true,
            lastSavedAt: undefined,
          }
        }),
      markProjectSaved: () =>
        set({
          hasUnsavedChanges: false,
          lastSavedAt: new Date().toISOString(),
        }),
      setTemplate: (templateId) =>
        set((state) => {
          if (state.project.templateId === templateId) return state
          const project = createProjectFromTemplate(templateId)

          return {
            project,
            activePageId: project.pages[0].id,
            overflowWarning: false,
            hasUnsavedChanges: true,
            lastSavedAt: undefined,
          }
        }),
      setSetting: (key, value) =>
        set((state) => ({
          project: {
            ...state.project,
            settings: { ...state.project.settings, [key]: value },
          },
          hasUnsavedChanges: true,
        })),
      setActivePage: (id) => set({ activePageId: id }),
      updateActivePage: (patch) => {
        const id = get().activePageId
        get().updatePage(id, patch)
      },
      updatePage: (id, patch) =>
        set((state) => ({
          project: {
            ...state.project,
            pages: state.project.pages.map((page) => {
              if (page.id !== id) return page
              const nextPage = { ...page, ...patch }
              if (state.project.templateId !== 'wsp-digital-advisory') return nextPage
              if (patch.layoutType === 'profile' || nextPage.layoutType === 'profile') {
                const currentProfile = createDefaultWspProfileContent(page)
                const hasPageField = (field: keyof PortfolioPage) => Object.prototype.hasOwnProperty.call(patch, field)
                const hasProfileField = (field: keyof WspProfilePageContent) =>
                  Boolean(patch.wspProfile && Object.prototype.hasOwnProperty.call(patch.wspProfile, field))
                return syncWspProfilePage({
                  ...nextPage,
                  wspCover: page.wspCover,
                  wspProfile: {
                    ...currentProfile,
                    ...patch.wspProfile,
                    eyebrow: patch.topLabel ?? patch.wspProfile?.eyebrow ?? currentProfile.eyebrow,
                    title: patch.title ?? patch.wspProfile?.title ?? currentProfile.title,
                    introduction: patch.subtitle ?? patch.wspProfile?.introduction ?? currentProfile.introduction,
                    footerLabel: patch.paragraph1 ?? patch.wspProfile?.footerLabel ?? currentProfile.footerLabel,
                    pageNumber: patch.pageNumber ?? patch.wspProfile?.pageNumber ?? currentProfile.pageNumber,
                    sideImage: hasPageField('heroImage')
                      ? patch.heroImage
                      : hasProfileField('sideImage')
                        ? patch.wspProfile?.sideImage
                        : currentProfile.sideImage,
                    imageFit: patch.imageSettings?.fit ?? patch.wspProfile?.imageFit ?? currentProfile.imageFit,
                    imagePositionX: patch.imageSettings?.x ?? patch.wspProfile?.imagePositionX ?? currentProfile.imagePositionX,
                    imagePositionY: patch.imageSettings?.y ?? patch.wspProfile?.imagePositionY ?? currentProfile.imagePositionY,
                    imageScale: patch.imageSettings?.zoom ?? patch.wspProfile?.imageScale ?? currentProfile.imageScale,
                  },
                })
              }
              const currentCover = createDefaultWspCoverContent(page, state.project.settings.authorName)
              const hasPageField = (field: keyof PortfolioPage) => Object.prototype.hasOwnProperty.call(patch, field)
              const hasCoverField = (field: keyof NonNullable<PortfolioPage['wspCover']>) =>
                Boolean(patch.wspCover && Object.prototype.hasOwnProperty.call(patch.wspCover, field))
              return syncWspCoverPage(
                {
                  ...nextPage,
                  wspCover: {
                    ...currentCover,
                    ...patch.wspCover,
                    eyebrow: patch.topLabel ?? patch.wspCover?.eyebrow ?? currentCover.eyebrow,
                    title: patch.title ?? patch.wspCover?.title ?? currentCover.title,
                    subtitle: patch.subtitle ?? patch.wspCover?.subtitle ?? currentCover.subtitle,
                    professionalRole: patch.paragraph1 ?? patch.wspCover?.professionalRole ?? currentCover.professionalRole,
                    heroImage: hasPageField('heroImage')
                      ? patch.heroImage
                      : hasCoverField('heroImage')
                        ? patch.wspCover?.heroImage
                        : currentCover.heroImage,
                    imageFit: patch.imageSettings?.fit ?? patch.wspCover?.imageFit ?? currentCover.imageFit,
                    imagePositionX: patch.imageSettings?.x ?? patch.wspCover?.imagePositionX ?? currentCover.imagePositionX,
                    imagePositionY: patch.imageSettings?.y ?? patch.wspCover?.imagePositionY ?? currentCover.imagePositionY,
                    imageScale: patch.imageSettings?.zoom ?? patch.wspCover?.imageScale ?? currentCover.imageScale,
                  },
                },
                state.project.settings.authorName,
              )
            }),
          },
          hasUnsavedChanges: true,
        })),
      addPage: () =>
        set((state) => {
          const nextNumber = String(state.project.pages.length + 1).padStart(2, '0')
          const pageBase = createPage({
            ...(state.project.defaultPageLayout ?? {}),
            pageNumber: nextNumber,
            name: `Page ${nextNumber}`,
          })
          const page =
            state.project.templateId === 'wsp-digital-advisory'
              ? syncWspCoverPage(
                  {
                    ...pageBase,
                    layoutType: 'cover',
                    topLabel: 'DIGITAL ADVISORY PORTFOLIO',
                    title: 'Digital Experience &\nReal-Time Visualization',
                    subtitle: 'For the Built Environment',
                    paragraph1: 'Digital Experience & Real-Time Visualization Specialist',
                    wspCover: createDefaultWspCoverContent(
                      {
                        ...pageBase,
                        topLabel: 'DIGITAL ADVISORY PORTFOLIO',
                        title: 'Digital Experience &\nReal-Time Visualization',
                        subtitle: 'For the Built Environment',
                        paragraph1: 'Digital Experience & Real-Time Visualization Specialist',
                      },
                      state.project.settings.authorName,
                    ),
                  },
                  state.project.settings.authorName,
                )
              : pageBase
          return {
            project: { ...state.project, pages: [...state.project.pages, page] },
            activePageId: page.id,
            hasUnsavedChanges: true,
          }
        }),
      duplicatePage: (id) =>
        set((state) => {
          const index = state.project.pages.findIndex((page) => page.id === id)
          if (index < 0) return state
          const duplicate = clonePage(state.project.pages[index], String(state.project.pages.length + 1).padStart(2, '0'))
          const pages = [...state.project.pages]
          pages.splice(index + 1, 0, duplicate)
          return { project: { ...state.project, pages }, activePageId: duplicate.id, hasUnsavedChanges: true }
        }),
      deletePage: (id) =>
        set((state) => {
          if (state.project.pages.length === 1) return state
          const pages = state.project.pages.filter((page) => page.id !== id)
          const activePageId = state.activePageId === id ? pages[0].id : state.activePageId
          return { project: { ...state.project, pages }, activePageId, hasUnsavedChanges: true }
        }),
      movePage: (id, direction) =>
        set((state) => {
          const index = state.project.pages.findIndex((page) => page.id === id)
          const nextIndex = index + direction
          if (index < 0 || nextIndex < 0 || nextIndex >= state.project.pages.length) return state
          const pages = [...state.project.pages]
          const [page] = pages.splice(index, 1)
          pages.splice(nextIndex, 0, page)
          return { project: { ...state.project, pages }, hasUnsavedChanges: true }
        }),
      saveActiveLayoutAsDefault: () =>
        set((state) => {
          const activePage = state.project.pages.find((page) => page.id === state.activePageId)
          if (!activePage) return state
          return {
            project: {
              ...state.project,
              defaultPageLayout: createLayoutPreset(activePage),
            },
            hasUnsavedChanges: true,
          }
        }),
      setPreviewZoom: (previewZoom) => set({ previewZoom }),
      setShowGuides: (showGuides) => set({ showGuides }),
      setOverflowWarning: (overflowWarning) => set({ overflowWarning }),
    }),
    {
      name: 'black-lab-portfolio-builder',
      version: 9,
      storage: createJSONStorage(() => ({
        getItem: (name) => localStorage.getItem(name),
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, value)
          } catch (error) {
            console.warn('Autosave skipped because browser storage is full.', error)
          }
        },
        removeItem: (name) => localStorage.removeItem(name),
      })),
      partialize: (state) => ({
        project: state.project,
        activePageId: state.activePageId,
        previewZoom: state.previewZoom,
        showGuides: state.showGuides,
        hasUnsavedChanges: state.hasUnsavedChanges,
        lastSavedAt: state.lastSavedAt,
      }),
      migrate: (persisted) => {
        const value = persisted as Partial<BuilderState>
        const defaultProject = createDefaultProject()
        const project = value.project ? normalizeProject(value.project) : defaultProject
        const pages =
          project.templateId === defaultProject.templateId && project.pages.length < defaultProject.pages.length
            ? [...project.pages, ...defaultProject.pages.slice(project.pages.length)]
            : project.pages
        const nextProject = {
          ...project,
          pages,
          defaultPageLayout: project.defaultPageLayout ?? defaultProject.defaultPageLayout,
        }
        const activePageId = nextProject.pages.some((page) => page.id === value.activePageId)
          ? value.activePageId!
          : nextProject.pages[0].id

        return {
          ...value,
          project: nextProject,
          activePageId,
          previewZoom: value.previewZoom ?? 'fit',
          showGuides: value.showGuides ?? false,
          hasUnsavedChanges: true,
          lastSavedAt: value.lastSavedAt,
        }
      },
      merge: (persisted, current) => {
        const value = persisted as Partial<BuilderState>
        const project = value.project ? normalizeProject(value.project) : current.project
        return {
          ...current,
          ...value,
          project,
          activePageId: project.pages.some((page) => page.id === value.activePageId) ? value.activePageId! : project.pages[0].id,
          hasUnsavedChanges: value.hasUnsavedChanges ?? current.hasUnsavedChanges,
          lastSavedAt: value.lastSavedAt,
        }
      },
    },
  ),
)
