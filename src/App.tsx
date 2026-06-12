import { useCallback, useLayoutEffect, useMemo, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Copy,
  FileDown,
  FileImage,
  FolderOpen,
  Info,
  Maximize2,
  Plus,
  Save,
  Target,
  Trash2,
  Upload,
} from 'lucide-react'
import { getCanvasSize } from './canvas'
import { exportCurrentPng, exportPortfolioPdf } from './exportUtils'
import { downloadText, normalizeProject, readImageForProject, sanitizeFilename } from './fileUtils'
import { useBuilderStore } from './store'
import type { ExportQuality, FitMode, PageSize, PortfolioPage, PortfolioProject } from './types'

function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  multiline?: boolean
}) {
  return (
    <label className="control-field">
      <span>{label}</span>
      {multiline ? (
        <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} />
      ) : (
        <input value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  )
}

function NumberSlider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  suffix = '',
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  suffix?: string
}) {
  return (
    <label className="control-field">
      <span>
        {label}
        <b>{value}{suffix}</b>
      </span>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  )
}

function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: T[]
  onChange: (value: T) => void
}) {
  return (
    <label className="control-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value as T)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="color-field">
      <span>{label}</span>
      <input type="color" value={value} onChange={(event) => onChange(event.target.value)} />
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

function ImageDropzone({ onImage }: { onImage: (dataUrl: string) => void }) {
  const onDrop = useCallback(
    async (files: File[]) => {
      const [file] = files
      if (!file) return
      onImage(await readImageForProject(file))
    },
    [onImage],
  )
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, multiple: false })

  return (
    <div {...getRootProps()} className={`dropzone ${isDragActive ? 'is-active' : ''}`}>
      <input {...getInputProps()} />
      <Upload size={16} />
      <span>{isDragActive ? 'Drop image here' : 'Upload hero image'}</span>
    </div>
  )
}

function Sidebar({ previewRef }: { previewRef: React.RefObject<HTMLDivElement | null> }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const {
    project,
    activePageId,
    previewZoom,
    showGuides,
    overflowWarning,
    hasUnsavedChanges,
    lastSavedAt,
    setProject,
    newProject,
    duplicateProject,
    markProjectSaved,
    setSetting,
    setActivePage,
    updateActivePage,
    addPage,
    duplicatePage,
    deletePage,
    movePage,
    saveActiveLayoutAsDefault,
    setShowGuides,
  } = useBuilderStore()
  const activePage = project.pages.find((page) => page.id === activePageId) ?? project.pages[0]

  const savedAtLabel = lastSavedAt
    ? new Intl.DateTimeFormat(undefined, {
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(new Date(lastSavedAt))
    : 'No backup saved'

  const saveJson = () => {
    const timestamp = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '')
    downloadText(JSON.stringify(project, null, 2), `${sanitizeFilename(project.settings.projectName)}_${timestamp}_project.json`)
    markProjectSaved()
  }

  const loadJson = async (file: File) => {
    const text = await file.text()
    const loaded = normalizeProject(JSON.parse(text) as PortfolioProject)
    setProject(loaded)
  }

  const startNewProject = () => {
    if (hasUnsavedChanges && !window.confirm('Current project has unsaved changes. Start a new project anyway?')) return
    newProject()
  }

  const openProjectFile = () => {
    if (hasUnsavedChanges && !window.confirm('Current project has unsaved changes. Load another project anyway?')) return
    fileInputRef.current?.click()
  }

  const updateKeyFocus = (index: number, value: string) => {
    updateActivePage({ keyFocus: activePage.keyFocus.map((item, itemIndex) => (itemIndex === index ? value : item)) })
  }

  return (
    <aside className="sidebar">
      <div className="brand-row">
        <div>
          <strong>Black Lab</strong>
          <span>Portfolio Builder</span>
        </div>
      </div>

      <section className="panel">
        <h2>Project</h2>
        <div className={`save-status ${hasUnsavedChanges ? 'is-unsaved' : ''}`}>
          <strong>{hasUnsavedChanges ? 'Unsaved changes' : 'Backup saved'}</strong>
          <span>{savedAtLabel}</span>
        </div>
        <Field label="Project name" value={project.settings.projectName} onChange={(value) => setSetting('projectName', value)} />
        <Field
          label="Portfolio title"
          value={project.settings.portfolioTitle}
          onChange={(value) => setSetting('portfolioTitle', value)}
        />
        <Field label="Author" value={project.settings.authorName} onChange={(value) => setSetting('authorName', value)} />
        <SelectField<PageSize>
          label="Page size"
          value={project.settings.pageSize}
          options={['16:9', '4:3', 'A4 landscape', '9:16']}
          onChange={(value) => setSetting('pageSize', value)}
        />
        <SelectField<ExportQuality>
          label="Export quality"
          value={project.settings.exportQuality}
          options={['linkedin', 'web', 'print', 'high']}
          onChange={(value) => setSetting('exportQuality', value)}
        />
        <div className="action-grid project-actions">
          <button onClick={startNewProject}>
            <Plus size={15} /> New Project
          </button>
          <button onClick={duplicateProject}>
            <Copy size={15} /> Duplicate Project
          </button>
          <button onClick={saveJson}>
            <Save size={15} /> Save Backup
          </button>
          <button onClick={openProjectFile}>
            <FolderOpen size={15} /> Load Project
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          hidden
          onChange={(event) => {
            const [file] = Array.from(event.target.files ?? [])
            if (file) void loadJson(file)
            event.currentTarget.value = ''
          }}
        />
      </section>

      <section className="panel">
        <div className="panel-title-row">
          <h2>Pages</h2>
          <button className="icon-button" title="Add page" onClick={addPage}>
            <Plus size={16} />
          </button>
        </div>
        <div className="page-list">
          {project.pages.map((page) => (
            <button
              key={page.id}
              className={`page-row ${page.id === activePageId ? 'is-selected' : ''}`}
              onClick={() => setActivePage(page.id)}
            >
              <span>{page.pageNumber}</span>
              <input
                value={page.name}
                onClick={(event) => event.stopPropagation()}
                onChange={(event) => useBuilderStore.getState().updatePage(page.id, { name: event.target.value })}
              />
            </button>
          ))}
        </div>
        <div className="action-grid">
          <button onClick={() => duplicatePage(activePage.id)}>
            <Copy size={15} /> Duplicate
          </button>
          <button onClick={() => deletePage(activePage.id)}>
            <Trash2 size={15} /> Delete
          </button>
          <button onClick={() => movePage(activePage.id, -1)}>
            <ArrowUp size={15} /> Up
          </button>
          <button onClick={() => movePage(activePage.id, 1)}>
            <ArrowDown size={15} /> Down
          </button>
        </div>
      </section>

      {overflowWarning && (
        <div className="warning">
          <AlertTriangle size={16} />
          Text may overflow this layout.
        </div>
      )}

      <section className="panel">
        <h2>Content</h2>
        <Field label="Page number" value={activePage.pageNumber} onChange={(value) => updateActivePage({ pageNumber: value })} />
        <Field label="Top label" value={activePage.topLabel} onChange={(value) => updateActivePage({ topLabel: value })} />
        <Field label="Title" value={activePage.title} onChange={(value) => updateActivePage({ title: value })} />
        <Field label="Subtitle" value={activePage.subtitle} onChange={(value) => updateActivePage({ subtitle: value })} multiline />
        <Field label="Paragraph 1" value={activePage.paragraph1} onChange={(value) => updateActivePage({ paragraph1: value })} multiline />
        <Field label="Section title" value={activePage.sectionTitle} onChange={(value) => updateActivePage({ sectionTitle: value })} />
        <Field label="Paragraph 2" value={activePage.paragraph2} onChange={(value) => updateActivePage({ paragraph2: value })} multiline />
        <Field label="Disclaimer" value={activePage.disclaimer} onChange={(value) => updateActivePage({ disclaimer: value })} multiline />
        <div className="focus-editor">
          <span>Key focus items</span>
          {activePage.keyFocus.map((item, index) => (
            <input key={`${activePage.id}-${index}`} value={item} onChange={(event) => updateKeyFocus(index, event.target.value)} />
          ))}
          <div className="action-grid">
            <button onClick={() => updateActivePage({ keyFocus: [...activePage.keyFocus, 'new focus'] })}>
              <Plus size={15} /> Add focus
            </button>
            <button onClick={() => updateActivePage({ keyFocus: activePage.keyFocus.slice(0, -1) })}>
              <Trash2 size={15} /> Remove
            </button>
          </div>
        </div>
      </section>

      <section className="panel">
        <h2>Image</h2>
        <ImageDropzone onImage={(heroImage) => updateActivePage({ heroImage })} />
        {activePage.heroImage && <img className="thumb" src={activePage.heroImage} alt="" />}
        <SelectField<FitMode>
          label="Fit"
          value={activePage.imageSettings.fit}
          options={['cover', 'contain']}
          onChange={(fit) => updateActivePage({ imageSettings: { ...activePage.imageSettings, fit } })}
        />
        <NumberSlider
          label="Zoom"
          value={activePage.imageSettings.zoom}
          min={0.5}
          max={2.5}
          step={0.05}
          onChange={(zoom) => updateActivePage({ imageSettings: { ...activePage.imageSettings, zoom } })}
        />
        <NumberSlider
          label="Image X"
          value={activePage.imageSettings.x}
          min={-200}
          max={200}
          onChange={(x) => updateActivePage({ imageSettings: { ...activePage.imageSettings, x } })}
        />
        <NumberSlider
          label="Image Y"
          value={activePage.imageSettings.y}
          min={-200}
          max={200}
          onChange={(y) => updateActivePage({ imageSettings: { ...activePage.imageSettings, y } })}
        />
      </section>

      <section className="panel">
        <h2>Layout</h2>
        <NumberSlider
          label="Hero width"
          value={activePage.heroLayout.width}
          min={360}
          max={1250}
          onChange={(width) => updateActivePage({ heroLayout: { ...activePage.heroLayout, width } })}
          suffix="px"
        />
        <NumberSlider
          label="Hero height"
          value={activePage.heroLayout.height}
          min={300}
          max={780}
          onChange={(height) => updateActivePage({ heroLayout: { ...activePage.heroLayout, height } })}
          suffix="px"
        />
        <NumberSlider
          label="Hero X"
          value={activePage.heroLayout.x}
          min={220}
          max={1240}
          onChange={(x) => updateActivePage({ heroLayout: { ...activePage.heroLayout, x } })}
          suffix="px"
        />
        <NumberSlider
          label="Hero Y"
          value={activePage.heroLayout.y}
          min={80}
          max={520}
          onChange={(y) => updateActivePage({ heroLayout: { ...activePage.heroLayout, y } })}
          suffix="px"
        />
        <button className="wide-button" onClick={saveActiveLayoutAsDefault}>
          <Save size={15} /> Save layout default
        </button>
      </section>

      <section className="panel">
        <h2>Type & Theme</h2>
        <NumberSlider
          label="Text X"
          value={activePage.textLayout.x}
          min={0}
          max={760}
          onChange={(x) => updateActivePage({ textLayout: { ...activePage.textLayout, x } })}
          suffix="px"
        />
        <NumberSlider
          label="Text Y"
          value={activePage.textLayout.y}
          min={80}
          max={330}
          onChange={(y) => updateActivePage({ textLayout: { ...activePage.textLayout, y } })}
          suffix="px"
        />
        <NumberSlider
          label="Text width"
          value={activePage.textLayout.width}
          min={260}
          max={900}
          onChange={(width) => updateActivePage({ textLayout: { ...activePage.textLayout, width } })}
          suffix="px"
        />
        <NumberSlider
          label="Title size"
          value={activePage.fontSettings.title}
          min={5}
          max={96}
          onChange={(title) => updateActivePage({ fontSettings: { ...activePage.fontSettings, title } })}
          suffix="px"
        />
        <NumberSlider
          label="Subtitle size"
          value={activePage.fontSettings.subtitle}
          min={5}
          max={36}
          onChange={(subtitle) => updateActivePage({ fontSettings: { ...activePage.fontSettings, subtitle } })}
          suffix="px"
        />
        <NumberSlider
          label="Body size"
          value={activePage.fontSettings.body}
          min={5}
          max={30}
          onChange={(body) => updateActivePage({ fontSettings: { ...activePage.fontSettings, body } })}
          suffix="px"
        />
        <NumberSlider
          label="Key focus size"
          value={activePage.fontSettings.keyFocus}
          min={5}
          max={30}
          onChange={(keyFocus) => updateActivePage({ fontSettings: { ...activePage.fontSettings, keyFocus } })}
          suffix="px"
        />
        <ColorField
          label="Background"
          value={activePage.theme.backgroundColor}
          onChange={(backgroundColor) => updateActivePage({ theme: { ...activePage.theme, backgroundColor } })}
        />
        <ColorField
          label="Primary navy"
          value={activePage.theme.primaryColor}
          onChange={(primaryColor) => updateActivePage({ theme: { ...activePage.theme, primaryColor } })}
        />
        <ColorField
          label="Accent blue"
          value={activePage.theme.accentColor}
          onChange={(accentColor) => updateActivePage({ theme: { ...activePage.theme, accentColor } })}
        />
        <ColorField
          label="Text"
          value={activePage.theme.textColor}
          onChange={(textColor) => updateActivePage({ theme: { ...activePage.theme, textColor } })}
        />
      </section>

      <section className="panel">
        <h2>Preview & Export</h2>
        <label className="control-field">
          <span>Zoom</span>
          <select
            value={String(previewZoom)}
            onChange={(event) => {
              const value = event.target.value
              useBuilderStore.getState().setPreviewZoom(value === 'fit' ? 'fit' : (Number(value) as 0.5 | 0.75 | 1))
            }}
          >
            <option value="fit">fit</option>
            <option value="0.5">50%</option>
            <option value="0.75">75%</option>
            <option value="1">100%</option>
          </select>
        </label>
        <label className="toggle-row">
          <input type="checkbox" checked={showGuides} onChange={(event) => setShowGuides(event.target.checked)} />
          Show safe-area guides
        </label>
        <div className="action-grid">
          <button onClick={() => previewRef.current && exportCurrentPng(previewRef.current, project.settings.projectName, project.settings.exportQuality)}>
            <FileImage size={15} /> Current PNG
          </button>
          <button
            onClick={() =>
              exportPortfolioPdf({
                project,
                pageIds: project.pages.map((page) => page.id),
                setActivePage,
                getCanvasElement: () => previewRef.current,
                restoreActivePage: activePageId,
              })
            }
          >
            <FileDown size={15} /> Full PDF
          </button>
        </div>
      </section>
    </aside>
  )
}

function CaseStudyStandard({ page, pageSize, showGuides }: { page: PortfolioPage; pageSize: PageSize; showGuides: boolean }) {
  const size = getCanvasSize(pageSize)
  const hero = page.heroLayout
  const text = page.textLayout
  const image = page.imageSettings

  return (
    <div
      className="portfolio-canvas"
      style={{
        width: size.width,
        height: size.height,
        background: page.theme.backgroundColor,
        color: page.theme.textColor,
      }}
    >
      {showGuides && (
        <div className="safe-guides">
          <div className="guide guide-margin" />
          <div className="guide guide-footer" />
          <div className="guide guide-hero" style={{ left: hero.x, top: hero.y, width: hero.width, height: hero.height }} />
        </div>
      )}
      <div className="top-label" style={{ color: page.theme.primaryColor }}>
        {page.topLabel}
        <span style={{ background: page.theme.accentColor }} />
      </div>
      <div className="page-flag" style={{ background: page.theme.primaryColor }}>
        <strong>{page.pageNumber}</strong>
        <span>{page.caseStudyLabel}</span>
      </div>

      <main className="content-grid">
        <section
          className="text-zone overflow-check"
          style={{
            left: text.x,
            top: text.y,
            width: text.width,
            maxHeight: Math.max(160, size.height - text.y - 190),
          }}
        >
          <h1 className="overflow-check" style={{ color: page.theme.primaryColor, fontSize: page.fontSettings.title }}>
            {page.title}
          </h1>
          <p className="subtitle overflow-check" style={{ fontSize: page.fontSettings.subtitle }}>
            {page.subtitle}
          </p>
          <p className="body-copy overflow-check" style={{ fontSize: page.fontSettings.body }}>
            {page.paragraph1}
          </p>
          <div className="section-kicker" style={{ color: page.theme.primaryColor }}>
            <span style={{ borderColor: page.theme.accentColor }} />
            {page.sectionTitle}
          </div>
          <div className="divider" style={{ background: page.theme.accentColor, width: Math.max(120, text.width - 85) }} />
          <p className="body-copy overflow-check" style={{ fontSize: page.fontSettings.body }}>
            {page.paragraph2}
          </p>
        </section>
      </main>

      <div
        className="hero-panel"
        style={{
          left: hero.x,
          top: hero.y,
          width: hero.width,
          height: hero.height,
        }}
      >
        {page.heroImage ? (
          <img
            src={page.heroImage}
            alt=""
            style={{
              objectFit: image.fit,
              transform: `translate(${image.x}px, ${image.y}px) scale(${image.zoom})`,
            }}
          />
        ) : (
          <div className="hero-placeholder">
            <Upload size={44} />
            <span>Upload a hero image</span>
          </div>
        )}
      </div>

      <footer className="focus-footer">
        <div className="focus-bar">
          <div className="focus-label" style={{ background: page.theme.primaryColor }}>
            <Target size={27} />
            <span>KEY FOCUS</span>
          </div>
          <div className="focus-items overflow-check" style={{ fontSize: page.fontSettings.keyFocus }}>
            {page.keyFocus.map((item, index) => (
              <span key={`${item}-${index}`}>
                {index > 0 && <i style={{ background: page.theme.accentColor }} />}
                {item}
              </span>
            ))}
          </div>
        </div>
        <p className="disclaimer overflow-check">
          <Info size={17} />
          {page.disclaimer}
        </p>
      </footer>
    </div>
  )
}

function Preview({ previewRef }: { previewRef: React.RefObject<HTMLDivElement | null> }) {
  const { project, activePageId, previewZoom, showGuides, setOverflowWarning, updateActivePage } = useBuilderStore()
  const activePage = project.pages.find((page) => page.id === activePageId) ?? project.pages[0]
  const size = getCanvasSize(project.settings.pageSize)
  const onDrop = useCallback(
    async (files: File[]) => {
      const [file] = files
      if (!file) return
      updateActivePage({ heroImage: await readImageForProject(file) })
    },
    [updateActivePage],
  )
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
    noClick: true,
    noKeyboard: true,
  })

  const scale = useMemo(() => {
    if (previewZoom !== 'fit') return previewZoom
    const maxWidth = Math.max(420, window.innerWidth - 500)
    const maxHeight = Math.max(420, window.innerHeight - 110)
    return Math.min(maxWidth / size.width, maxHeight / size.height, 1)
  }, [previewZoom, size.height, size.width])

  useLayoutEffect(() => {
    const element = previewRef.current
    if (!element) return
    const checks = Array.from(element.querySelectorAll<HTMLElement>('.overflow-check'))
    const hasOverflow = checks.some((node) => node.scrollHeight > node.clientHeight + 18 || node.scrollWidth > node.clientWidth + 18)
    setOverflowWarning(hasOverflow)
  }, [activePage, project.settings.pageSize, previewRef, setOverflowWarning])

  return (
    <section className="preview-shell">
      <div className="preview-topbar">
        <div>
          <strong>{project.settings.portfolioTitle}</strong>
          <span>{project.pages.length} page{project.pages.length === 1 ? '' : 's'} / {project.settings.pageSize}</span>
        </div>
        <button onClick={() => document.documentElement.requestFullscreen?.()}>
          <Maximize2 size={16} />
          Fullscreen
        </button>
      </div>
      <div {...getRootProps()} className={`preview-stage ${isDragActive ? 'is-drop-active' : ''}`}>
        <input {...getInputProps()} />
        {isDragActive && (
          <div className="preview-drop-overlay">
            <Upload size={34} />
            <span>Drop image into the active page</span>
          </div>
        )}
        <div className="canvas-holder" style={{ width: size.width * scale, height: size.height * scale }}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
            <div ref={previewRef}>
              <CaseStudyStandard page={activePage} pageSize={project.settings.pageSize} showGuides={showGuides} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function App() {
  const previewRef = useRef<HTMLDivElement>(null)

  return (
    <div className="app-shell">
      <Sidebar previewRef={previewRef} />
      <Preview previewRef={previewRef} />
    </div>
  )
}

export default App
