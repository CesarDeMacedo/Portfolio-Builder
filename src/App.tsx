import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
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
import { createDefaultWspCoverContent, createDefaultWspProfileContent } from './defaults'
import { exportCurrentPng, exportPortfolioPdf } from './exportUtils'
import { downloadText, normalizeProject, readImageForProject, sanitizeFilename } from './fileUtils'
import { useBuilderStore } from './store'
import { WspCoverPage } from './wspCover'
import { WspProfilePage } from './wspProfile'
import type {
  ExportQuality,
  FitMode,
  PageSize,
  PortfolioPage,
  PortfolioProject,
  TemplateId,
  WspCoverPageContent,
  WspLayoutType,
  WspProfileCard,
  WspProfileComposition,
  WspProfilePageContent,
} from './types'

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
  const [draftValue, setDraftValue] = useState(String(value))
  const [isEditingNumber, setIsEditingNumber] = useState(false)

  const applyNumber = (nextValue: number) => {
    if (Number.isNaN(nextValue)) return
    const clampedValue = Math.min(max, Math.max(min, nextValue))
    onChange(clampedValue)
    setDraftValue(String(clampedValue))
  }

  const updateNumberInput = (rawValue: string) => {
    setDraftValue(rawValue)
    if (rawValue === '' || rawValue === '-') return
    const nextValue = Number(rawValue)
    if (Number.isNaN(nextValue)) return
    if (nextValue >= min && nextValue <= max) onChange(nextValue)
  }

  const commitNumberInput = () => {
    setIsEditingNumber(false)
    if (draftValue === '' || draftValue === '-') {
      setDraftValue(String(value))
      return
    }
    applyNumber(Number(draftValue))
  }

  return (
    <label className="control-field">
      <span>
        {label}
        <b>{value}{suffix}</b>
      </span>
      <div className="number-slider-row">
        <input
          type="range"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(event) => {
            const nextValue = Number(event.target.value)
            onChange(nextValue)
            setDraftValue(String(nextValue))
          }}
        />
        <input
          className="number-slider-input"
          type="number"
          value={isEditingNumber ? draftValue : value}
          min={min}
          max={max}
          step={step}
          onFocus={() => {
            setIsEditingNumber(true)
            setDraftValue(String(value))
          }}
          onChange={(event) => updateNumberInput(event.target.value)}
          onBlur={commitNumberInput}
          onKeyDown={(event) => {
            if (event.key === 'Enter') event.currentTarget.blur()
          }}
        />
      </div>
    </label>
  )
}

function SelectField<T extends string>({
  label,
  value,
  options,
  labels,
  onChange,
}: {
  label: string
  value: T
  options: T[]
  labels?: Partial<Record<T, string>>
  onChange: (value: T) => void
}) {
  return (
    <label className="control-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value as T)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {labels?.[option] ?? option}
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

function WspCoverControls({
  page,
  authorName,
  onUpdate,
}: {
  page: PortfolioPage
  authorName: string
  onUpdate: (patch: Partial<PortfolioPage>) => void
}) {
  const cover = page.wspCover ?? createDefaultWspCoverContent(page, authorName)

  const updateCover = (patch: Partial<WspCoverPageContent>) => {
    const nextCover = { ...cover, ...patch }
    const nextImageSettings = {
      fit: nextCover.imageFit,
      x: nextCover.imagePositionX,
      y: nextCover.imagePositionY,
      zoom: nextCover.imageScale,
    }

    onUpdate({
      layoutType: 'cover',
      topLabel: nextCover.eyebrow,
      title: nextCover.title,
      subtitle: nextCover.subtitle,
      paragraph1: nextCover.professionalRole,
      heroImage: nextCover.heroImage,
      imageSettings: nextImageSettings,
      wspCover: nextCover,
    })
  }

  return (
    <>
      <section className="panel">
        <h2>Cover Content</h2>
        <Field label="Eyebrow" value={cover.eyebrow} onChange={(eyebrow) => updateCover({ eyebrow })} />
        <Field label="Title" value={cover.title} onChange={(title) => updateCover({ title })} multiline />
        <Field label="Subtitle" value={cover.subtitle} onChange={(subtitle) => updateCover({ subtitle })} multiline />
        <Field
          label="Professional name"
          value={cover.professionalName}
          onChange={(professionalName) => updateCover({ professionalName })}
        />
        <Field
          label="Professional role"
          value={cover.professionalRole}
          onChange={(professionalRole) => updateCover({ professionalRole })}
          multiline
        />
      </section>

      <section className="panel">
        <h2>Hero Image</h2>
        <ImageDropzone onImage={(heroImage) => updateCover({ heroImage })} />
        {cover.heroImage && <img className="thumb" src={cover.heroImage} alt="" />}
        <div className="action-grid">
          <button onClick={() => updateCover({ heroImage: undefined })}>
            <Trash2 size={15} /> Remove image
          </button>
          <button
            onClick={() =>
              updateCover({
                imagePositionX: 0,
                imagePositionY: 0,
                imageScale: 1,
              })
            }
          >
            <Target size={15} /> Reset image
          </button>
        </div>
        <SelectField<FitMode>
          label="Fit"
          value={cover.imageFit}
          options={['cover', 'contain']}
          labels={{ cover: 'Cover', contain: 'Contain' }}
          onChange={(imageFit) => updateCover({ imageFit })}
        />
        <NumberSlider
          label="Position X"
          value={cover.imagePositionX}
          min={-240}
          max={240}
          onChange={(imagePositionX) => updateCover({ imagePositionX })}
          suffix="px"
        />
        <NumberSlider
          label="Position Y"
          value={cover.imagePositionY}
          min={-240}
          max={240}
          onChange={(imagePositionY) => updateCover({ imagePositionY })}
          suffix="px"
        />
        <NumberSlider
          label="Scale"
          value={cover.imageScale}
          min={0.5}
          max={2.5}
          step={0.05}
          onChange={(imageScale) => updateCover({ imageScale })}
        />
      </section>

      <section className="panel">
        <h2>Appearance</h2>
        <NumberSlider
          label="Overlay opacity"
          value={cover.overlayOpacity}
          min={0}
          max={0.85}
          step={0.05}
          onChange={(overlayOpacity) => updateCover({ overlayOpacity })}
        />
        <label className="toggle-row">
          <input
            type="checkbox"
            checked={cover.showTopAccent}
            onChange={(event) => updateCover({ showTopAccent: event.target.checked })}
          />
          Show top accent
        </label>
        <label className="toggle-row">
          <input
            type="checkbox"
            checked={cover.showImageAccent}
            onChange={(event) => updateCover({ showImageAccent: event.target.checked })}
          />
          Show image accent
        </label>
      </section>

    </>
  )
}

function CapabilityCardEditor({
  card,
  index,
  canMoveUp,
  canMoveDown,
  onUpdate,
  onMove,
  onRemove,
}: {
  card: WspProfileCard
  index: number
  canMoveUp: boolean
  canMoveDown: boolean
  onUpdate: (patch: Partial<WspProfileCard>) => void
  onMove: (direction: -1 | 1) => void
  onRemove: () => void
}) {
  return (
    <div className="card-editor">
      <div className="card-editor-title">
        <strong>Card {index + 1}</strong>
        <div>
          <button className="icon-button" title="Move up" disabled={!canMoveUp} onClick={() => onMove(-1)}>
            <ArrowUp size={15} />
          </button>
          <button className="icon-button" title="Move down" disabled={!canMoveDown} onClick={() => onMove(1)}>
            <ArrowDown size={15} />
          </button>
          <button className="icon-button" title="Remove" onClick={onRemove}>
            <Trash2 size={15} />
          </button>
        </div>
      </div>
      <Field label="Icon / short label" value={card.icon ?? ''} onChange={(icon) => onUpdate({ icon })} />
      <Field label="Title" value={card.title} onChange={(title) => onUpdate({ title })} />
      <Field label="Description" value={card.description} onChange={(description) => onUpdate({ description })} multiline />
    </div>
  )
}

function WspProfileControls({
  page,
  onUpdate,
}: {
  page: PortfolioPage
  onUpdate: (patch: Partial<PortfolioPage>) => void
}) {
  const profile = createDefaultWspProfileContent(page)

  const updateProfile = (patch: Partial<WspProfilePageContent>) => {
    const nextProfile = { ...profile, ...patch }
    const nextImageSettings = {
      fit: nextProfile.imageFit,
      x: nextProfile.imagePositionX,
      y: nextProfile.imagePositionY,
      zoom: nextProfile.imageScale,
    }

    onUpdate({
      layoutType: 'profile',
      topLabel: nextProfile.eyebrow,
      title: nextProfile.title,
      subtitle: nextProfile.introduction,
      paragraph1: nextProfile.footerLabel,
      pageNumber: nextProfile.pageNumber,
      heroImage: nextProfile.sideImage,
      imageSettings: nextImageSettings,
      wspProfile: nextProfile,
    })
  }

  const updateCard = (id: string, patch: Partial<WspProfileCard>) => {
    updateProfile({
      cards: profile.cards.map((card) => (card.id === id ? { ...card, ...patch } : card)),
    })
  }

  const moveCard = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction
    if (nextIndex < 0 || nextIndex >= profile.cards.length) return
    const cards = [...profile.cards]
    const [card] = cards.splice(index, 1)
    cards.splice(nextIndex, 0, card)
    updateProfile({ cards })
  }

  const removeCard = (id: string) => {
    updateProfile({ cards: profile.cards.filter((card) => card.id !== id) })
  }

  const addCard = () => {
    if (profile.cards.length >= 4) return
    updateProfile({
      cards: [
        ...profile.cards,
        {
          id: crypto.randomUUID(),
          icon: String(profile.cards.length + 1).padStart(2, '0'),
          title: 'New Capability',
          description: 'Describe this capability in one concise sentence.',
        },
      ],
    })
  }

  return (
    <>
      <section className="panel">
        <h2>Profile Content</h2>
        <SelectField<WspProfileComposition>
          label="Profile Composition"
          value={profile.composition}
          options={['horizontal', 'grid']}
          labels={{ horizontal: 'Image + 4 Cards Horizontal', grid: 'Image + 4 Cards Grid' }}
          onChange={(composition) => updateProfile({ composition })}
        />
        <Field label="Eyebrow" value={profile.eyebrow} onChange={(eyebrow) => updateProfile({ eyebrow })} />
        <Field label="Title" value={profile.title} onChange={(title) => updateProfile({ title })} multiline />
        <Field label="Introduction" value={profile.introduction} onChange={(introduction) => updateProfile({ introduction })} multiline />
        <Field label="Footer label" value={profile.footerLabel} onChange={(footerLabel) => updateProfile({ footerLabel })} multiline />
        <Field label="Page number" value={profile.pageNumber} onChange={(pageNumber) => updateProfile({ pageNumber })} />
      </section>

      <section className="panel">
        <div className="panel-title-row">
          <h2>Cards</h2>
          <button className="icon-button" title="Add card" disabled={profile.cards.length >= 4} onClick={addCard}>
            <Plus size={16} />
          </button>
        </div>
        <div className="card-editor-list">
          {profile.cards.map((card, index) => (
            <CapabilityCardEditor
              key={card.id}
              card={card}
              index={index}
              canMoveUp={index > 0}
              canMoveDown={index < profile.cards.length - 1}
              onUpdate={(patch) => updateCard(card.id, patch)}
              onMove={(direction) => moveCard(index, direction)}
              onRemove={() => removeCard(card.id)}
            />
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Side Image</h2>
        <label className="toggle-row">
          <input
            type="checkbox"
            checked={profile.showSideImage}
            onChange={(event) => updateProfile({ showSideImage: event.target.checked })}
          />
          Show side image
        </label>
        <ImageDropzone onImage={(sideImage) => updateProfile({ sideImage, showSideImage: true })} />
        {profile.sideImage && <img className="thumb" src={profile.sideImage} alt="" />}
        <div className="action-grid">
          <button onClick={() => updateProfile({ sideImage: undefined })}>
            <Trash2 size={15} /> Remove image
          </button>
          <button
            onClick={() =>
              updateProfile({
                imagePositionX: 0,
                imagePositionY: 0,
                imageScale: 1,
              })
            }
          >
            <Target size={15} /> Reset image
          </button>
        </div>
        <SelectField<FitMode>
          label="Fit"
          value={profile.imageFit}
          options={['cover', 'contain']}
          labels={{ cover: 'Cover', contain: 'Contain' }}
          onChange={(imageFit) => updateProfile({ imageFit })}
        />
        <NumberSlider
          label="Position X"
          value={profile.imagePositionX}
          min={-240}
          max={240}
          onChange={(imagePositionX) => updateProfile({ imagePositionX })}
          suffix="px"
        />
        <NumberSlider
          label="Position Y"
          value={profile.imagePositionY}
          min={-240}
          max={240}
          onChange={(imagePositionY) => updateProfile({ imagePositionY })}
          suffix="px"
        />
        <NumberSlider
          label="Scale"
          value={profile.imageScale}
          min={0.5}
          max={2.5}
          step={0.05}
          onChange={(imageScale) => updateProfile({ imageScale })}
        />
      </section>

      <section className="panel">
        <h2>Appearance</h2>
        <label className="toggle-row">
          <input
            type="checkbox"
            checked={profile.showTopAccent}
            onChange={(event) => updateProfile({ showTopAccent: event.target.checked })}
          />
          Show top accent
        </label>
        <label className="toggle-row">
          <input
            type="checkbox"
            checked={profile.showImageAccent}
            onChange={(event) => updateProfile({ showImageAccent: event.target.checked })}
          />
          Show image accent
        </label>
        <label className="toggle-row">
          <input
            type="checkbox"
            checked={profile.showFooter}
            onChange={(event) => updateProfile({ showFooter: event.target.checked })}
          />
          Show footer
        </label>
      </section>
    </>
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
    setTemplate,
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
  const isWspProject = project.templateId === 'wsp-digital-advisory'

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

  const selectTemplate = (templateId: TemplateId) => {
    if (templateId === project.templateId) return
    if (hasUnsavedChanges && !window.confirm('Current project has unsaved changes. Switch templates anyway?')) return
    setTemplate(templateId)
  }

  const selectWspLayout = (layoutType: WspLayoutType) => {
    if (activePage.layoutType === layoutType) return
    if (layoutType === 'profile') {
      updateActivePage({
        layoutType,
        wspProfile: activePage.wspProfile ?? createDefaultWspProfileContent(activePage),
      })
      return
    }
    updateActivePage({
      layoutType,
      wspCover: activePage.wspCover ?? createDefaultWspCoverContent(activePage, project.settings.authorName),
    })
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
        <SelectField<TemplateId>
          label="Template"
          value={project.templateId}
          options={['infrastructure-digital-twin', 'wsp-digital-advisory']}
          labels={{
            'infrastructure-digital-twin': 'Case Study Standard',
            'wsp-digital-advisory': 'WSP Digital Advisory Portfolio',
          }}
          onChange={selectTemplate}
        />
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

      {isWspProject ? (
        <>
          <section className="panel">
            <h2>Page Layout</h2>
            <SelectField<WspLayoutType>
              label="Layout"
              value={activePage.layoutType ?? 'cover'}
              options={['cover', 'profile']}
              labels={{ cover: 'Cover', profile: 'Profile / Capabilities' }}
              onChange={selectWspLayout}
            />
          </section>
          {(activePage.layoutType ?? 'cover') === 'profile' ? (
            <WspProfileControls page={activePage} onUpdate={updateActivePage} />
          ) : (
            <WspCoverControls page={activePage} authorName={project.settings.authorName} onUpdate={updateActivePage} />
          )}
        </>
      ) : (
        <>
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
        </>
      )}

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
      const image = await readImageForProject(file)
      if (project.templateId === 'wsp-digital-advisory' && (activePage.layoutType ?? 'cover') === 'profile') {
        updateActivePage({
          heroImage: image,
          wspProfile: {
            ...(activePage.wspProfile ?? createDefaultWspProfileContent(activePage)),
            sideImage: image,
            showSideImage: true,
          },
        })
        return
      }
      updateActivePage({ heroImage: image })
    },
    [activePage, project.templateId, updateActivePage],
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
              {project.templateId === 'infrastructure-digital-twin' && (
                <CaseStudyStandard page={activePage} pageSize={project.settings.pageSize} showGuides={showGuides} />
              )}
              {project.templateId === 'wsp-digital-advisory' && (
                (activePage.layoutType ?? 'cover') === 'profile' ? (
                  <WspProfilePage page={activePage} pageSize={project.settings.pageSize} showGuides={showGuides} />
                ) : (
                  <WspCoverPage page={activePage} pageSize={project.settings.pageSize} showGuides={showGuides} />
                )
              )}
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
