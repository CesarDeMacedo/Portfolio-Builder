import { Upload } from 'lucide-react'
import { getCanvasSize } from './canvas'
import type { PageSize, PortfolioPage, WspProfilePageContent } from './types'
import { WSP_TEMPLATE_TOKENS } from './wspTokens'

function profileContent(page: PortfolioPage): WspProfilePageContent {
  return (
    page.wspProfile ?? {
      eyebrow: 'DIGITAL ADVISORY',
      title: 'How I Could Support\nDigital Advisory',
      introduction: 'Transforming complex systems and project information into clear, interactive digital experiences.',
      cards: [],
      composition: 'horizontal',
      sideImage: page.heroImage,
      imageFit: page.imageSettings.fit,
      imagePositionX: page.imageSettings.x,
      imagePositionY: page.imageSettings.y,
      imageScale: page.imageSettings.zoom,
      imageWidth: WSP_TEMPLATE_TOKENS.heroImage.width,
      imageHeight: WSP_TEMPLATE_TOKENS.heroImage.height,
      imageAlignment: 'right',
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
      introCardsSpacing: 0,
      footerLabel: 'Cesar De Macedo - Digital Experience & Real-Time Visualization',
      pageNumber: page.pageNumber,
      showTopAccent: true,
      showImageAccent: true,
      showSideImage: true,
      showFooter: true,
    }
  )
}

export function WspProfilePage({
  page,
  pageSize,
  showGuides,
}: {
  page: PortfolioPage
  pageSize: PageSize
  showGuides: boolean
}) {
  const size = getCanvasSize(pageSize)
  const profile = profileContent(page)
  const composition = profile.composition === 'grid' ? 'grid' : 'horizontal'
  const hero = WSP_TEMPLATE_TOKENS.heroImage
  const copy = WSP_TEMPLATE_TOKENS.copy
  const type = WSP_TEMPLATE_TOKENS.type
  const profileTokens = WSP_TEMPLATE_TOKENS.profile
  const cardsTop = hero.y + hero.height + profileTokens.cardsTopGap
  const visibleCards = profile.cards.slice(0, 4)

  return (
    <div
      className={`portfolio-canvas wsp-profile-canvas is-${composition}`}
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
      {profile.showTopAccent && <div className="wsp-profile-top-accent" style={{ background: page.theme.accentColor }} />}

      <header className="wsp-profile-copy" style={{ left: copy.x, top: copy.y, width: copy.width }}>
        <span className="wsp-profile-eyebrow" style={{ color: page.theme.accentColor, fontSize: type.eyebrow }}>
          {profile.eyebrow}
        </span>
        <h1 style={{ color: page.theme.primaryColor, fontSize: type.title, marginBottom: profileTokens.titleIntroSpacing }}>
          {profile.title}
        </h1>
        <p className="wsp-profile-intro" style={{ fontSize: type.subtitle }}>
          {profile.introduction}
        </p>
      </header>

      {profile.showSideImage && (
        <aside className="wsp-profile-hero-image" style={{ left: hero.x, top: hero.y, width: hero.width, height: hero.height }}>
          {profile.showImageAccent && <div className="wsp-profile-image-accent" style={{ background: page.theme.accentColor }} />}
          {profile.sideImage ? (
            <img
              src={profile.sideImage}
              alt=""
              style={{
                objectFit: profile.imageFit,
                transform: `translate(${profile.imagePositionX}px, ${profile.imagePositionY}px) scale(${profile.imageScale})`,
              }}
            />
          ) : (
            <div className="wsp-profile-side-empty">
              <Upload size={34} />
              <span>Upload Side Image</span>
            </div>
          )}
        </aside>
      )}

      <section className="wsp-profile-card-band" style={{ top: cardsTop }}>
        <div className="wsp-profile-card-grid" style={{ gap: profileTokens.cardsGap }}>
          {visibleCards.map((card, index) => (
            <article className="wsp-profile-card" key={card.id} style={{ padding: profileTokens.cardPadding }}>
              <span className="wsp-profile-card-rule" style={{ background: page.theme.accentColor }} />
              <div className="wsp-profile-card-mark" style={{ color: page.theme.accentColor, fontSize: type.cardNumber }}>
                {card.icon?.trim() || String(index + 1).padStart(2, '0')}
              </div>
              <h2 style={{ color: page.theme.primaryColor, fontSize: type.cardTitle }}>{card.title}</h2>
              <p style={{ fontSize: type.cardDescription }}>{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      {profile.showFooter && (
        <footer className="wsp-profile-footer" style={{ fontSize: type.footer }}>
          <span>{profile.footerLabel}</span>
          <strong style={{ fontSize: type.footerNumber }}>{profile.pageNumber}</strong>
        </footer>
      )}
    </div>
  )
}
