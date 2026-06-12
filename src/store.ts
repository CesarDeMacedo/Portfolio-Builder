import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createDefaultProject, createLayoutPreset, createPage, normalizeProject } from './defaults'
import type { PortfolioPage, PortfolioProject } from './types'

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
            pages: state.project.pages.map((page) => (page.id === id ? { ...page, ...patch } : page)),
          },
          hasUnsavedChanges: true,
        })),
      addPage: () =>
        set((state) => {
          const nextNumber = String(state.project.pages.length + 1).padStart(2, '0')
          const page = createPage({
            ...(state.project.defaultPageLayout ?? {}),
            pageNumber: nextNumber,
            name: `Page ${nextNumber}`,
          })
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
      version: 5,
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
          project.pages.length < defaultProject.pages.length
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
