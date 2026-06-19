import { Upload } from 'lucide-react'
import { getCanvasSize } from './canvas'
import type { PageSize, PortfolioPage, WspCoverPageContent } from './types'
import { WSP_TEMPLATE_TOKENS } from './wspTokens'

function coverContent(page: PortfolioPage): WspCoverPageContent {
  return (
    page.wspCover ?? {
      eyebrow: page.topLabel,
      title: page.title,
      subtitle: page.subtitle,
      professionalName: 'Cesar De Macedo',
      professionalRole: page.paragraph1,
      heroImage: page.heroImage,
      imageFit: page.imageSettings.fit,
      imagePositionX: page.imageSettings.x,
      imagePositionY: page.imageSettings.y,
      imageScale: page.imageSettings.zoom,
      overlayOpacity: 0,
      showTopAccent: true,
      showImageAccent: true,
    }
  )
}

export function WspCoverPage({
  page,
  pageSize,
  showGuides,
}: {
  page: PortfolioPage
  pageSize: PageSize
  showGuides: boolean
}) {
  const size = getCanvasSize(pageSize)
  const cover = coverContent(page)
  const hero = WSP_TEMPLATE_TOKENS.heroImage
  const copy = WSP_TEMPLATE_TOKENS.copy
  const type = WSP_TEMPLATE_TOKENS.type
  const footerLabel = `${cover.professionalName} - ${cover.professionalRole}`

  return (
    <div
      className="portfolio-canvas wsp-cover-canvas"
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
      {cover.showTopAccent && <div className="wsp-cover-top-accent" style={{ background: page.theme.accentColor }} />}
      <div
        className="wsp-cover-copy overflow-check"
        style={{
          left: copy.x,
          top: copy.y,
          width: copy.width,
          maxHeight: Math.max(260, size.height - copy.y - 250),
        }}
      >
        <span className="wsp-cover-eyebrow" style={{ color: page.theme.accentColor, fontSize: type.eyebrow }}>
          {cover.eyebrow}
        </span>
        <h1 style={{ color: page.theme.primaryColor, fontSize: type.title }}>{cover.title}</h1>
        <p className="wsp-cover-subtitle" style={{ color: page.theme.textColor, fontSize: type.subtitle }}>
          {cover.subtitle}
        </p>
      </div>
      <div
        className="wsp-cover-hero"
        style={{
          left: hero.x,
          top: hero.y,
          width: hero.width,
          height: hero.height,
        }}
      >
        {cover.showImageAccent && <div className="wsp-cover-image-accent" style={{ background: page.theme.accentColor }} />}
        {cover.heroImage ? (
          <img
            src={cover.heroImage}
            alt=""
            style={{
              objectFit: cover.imageFit,
              transform: `translate(${cover.imagePositionX}px, ${cover.imagePositionY}px) scale(${cover.imageScale})`,
            }}
          />
        ) : (
          <div className="wsp-cover-hero-empty">
            <Upload size={40} />
            <span>Upload Hero Image</span>
          </div>
        )}
        {cover.overlayOpacity > 0 && <div className="wsp-cover-overlay" style={{ opacity: cover.overlayOpacity }} />}
      </div>
      <footer className="wsp-cover-footer">
        <span style={{ color: page.theme.textColor, fontSize: type.footer }}>{footerLabel}</span>
        <strong style={{ color: page.theme.primaryColor, fontSize: type.footerNumber }}>{page.pageNumber}</strong>
      </footer>
    </div>
  )
}
