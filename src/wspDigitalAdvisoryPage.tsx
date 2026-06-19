import { Info, Target, Upload } from 'lucide-react'
import { getCanvasSize } from './canvas'
import { createDefaultWspDigitalContent } from './defaults'
import type { PageSize, PortfolioPage } from './types'
import { WSP_TEMPLATE_TOKENS } from './wspTokens'

export function WspDigitalAdvisoryPage({
  page,
  pageSize,
  showGuides,
}: {
  page: PortfolioPage
  pageSize: PageSize
  showGuides: boolean
}) {
  const size = getCanvasSize(pageSize)
  const content = createDefaultWspDigitalContent(page)
  const tokens = WSP_TEMPLATE_TOKENS.nuclear
  const type = content.fontSizes
  const heroWidth = page.heroLayout?.width ?? tokens.hero.width
  const hero = {
    x: page.heroLayout?.x ?? tokens.hero.x,
    y: page.heroLayout?.y ?? tokens.hero.y,
    width: heroWidth,
    height: Math.round(heroWidth * 9 / 16),
  }
  const text = {
    x: page.textLayout?.x ?? tokens.textZone.x,
    y: page.textLayout?.y ?? tokens.textZone.y,
    width: page.textLayout?.width ?? tokens.textZone.width,
  }

  return (
    <div
      className="portfolio-canvas wsp-digital-canvas"
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
          <div
            className="guide guide-hero"
            style={{ left: hero.x, top: hero.y, width: hero.width, height: hero.height }}
          />
        </div>
      )}

      <div className="wsp-digital-top-label" style={{ color: page.theme.primaryColor, fontSize: type.eyebrow }}>
        {content.eyebrow}
        <span style={{ background: page.theme.accentColor }} />
      </div>

      <div className="wsp-digital-page-flag" style={{ background: page.theme.primaryColor }}>
        <strong style={{ fontSize: type.pageNumber }}>{content.pageNumber}</strong>
        <span style={{ fontSize: type.pageCategory }}>{content.pageCategory}</span>
      </div>

      <main className="wsp-digital-content-grid">
        <section
          className="wsp-digital-text-zone overflow-check"
          style={{
            left: text.x,
            top: text.y,
            width: text.width,
            maxHeight: Math.max(160, size.height - text.y - 190),
          }}
        >
          <h1 className="overflow-check" style={{ color: page.theme.primaryColor, fontSize: type.title }}>
            {content.title}
          </h1>
          <p className="wsp-digital-subtitle overflow-check" style={{ fontSize: type.subtitle }}>
            {content.subtitle}
          </p>
          <p className="wsp-digital-body-copy overflow-check" style={{ fontSize: type.body }}>
            {content.primaryDescription}
          </p>
          <div className="wsp-digital-section-kicker" style={{ color: page.theme.primaryColor, fontSize: type.sectionTitle }}>
            <span style={{ borderColor: page.theme.accentColor }} />
            {content.secondarySectionTitle}
          </div>
          <div className="wsp-digital-divider" style={{ background: page.theme.accentColor }} />
          <p className="wsp-digital-body-copy overflow-check" style={{ fontSize: type.body }}>
            {content.secondaryDescription}
          </p>
        </section>
      </main>

      <div
        className="wsp-digital-hero-panel"
        style={{ left: hero.x, top: hero.y, width: hero.width, height: hero.height }}
      >
        <span className="wsp-digital-hero-accent" style={{ background: page.theme.accentColor }} />
        {content.heroImage ? (
          <img
            src={content.heroImage}
            alt=""
            style={{
              objectFit: content.imageFit,
              transform: `translate(${content.imagePositionX}px, ${content.imagePositionY}px) scale(${content.imageScale})`,
            }}
          />
        ) : (
          <div className="wsp-digital-hero-placeholder">
            <Upload size={44} />
            <span>Upload a hero image</span>
          </div>
        )}
      </div>

      <footer className="wsp-digital-focus-footer">
        <div className="wsp-digital-focus-bar">
          <div className="wsp-digital-focus-label" style={{ background: page.theme.primaryColor }}>
            <Target size={27} />
            <span style={{ fontSize: type.keyFocusLabel }}>{content.keyFocusLabel}</span>
          </div>
          <div className="wsp-digital-focus-items overflow-check" style={{ fontSize: type.keyFocusItem }}>
            {content.keyFocusItems.map((item, index) => (
              <span key={`${item}-${index}`}>
                {index > 0 && <i style={{ background: page.theme.accentColor }} />}
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="wsp-digital-footer-row">
          <p className="wsp-digital-disclaimer overflow-check" style={{ fontSize: type.footerNote }}>
            <Info size={17} />
            {content.footerNote}
          </p>
          <p className="wsp-digital-signature overflow-check">
            <strong style={{ color: page.theme.primaryColor, fontSize: type.footerName }}>{content.footerName}</strong>
            <i style={{ background: page.theme.accentColor }} />
            <span style={{ fontSize: type.footerRole }}>{content.footerRole}</span>
          </p>
        </div>
      </footer>
    </div>
  )
}
