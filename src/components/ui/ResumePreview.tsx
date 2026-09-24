import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../../app/store.ts'
import {
  type PersonalInfoLayout,
  type Section,
  SectionItemTypes,
  SectionTypes,
} from '../../types/resume.types.ts'
import { defaultTheme } from '../../data/default-theme.ts'
import {
  DEFAULT_PAGE_FORMAT,
  PAGE_FORMATS,
  type PageFormat,
} from '../../lib/pageFormats.ts'
import { printResume } from '../../lib/printUtils.ts'
import { getSocialIconUrl } from '../../lib/iconUtils.ts'
import StandardSectionPreview from '../features/preview/StandardSectionPreview.tsx'
import TagSectionPreview from '../features/preview/TagSectionPreview.tsx'
import DescriptionSectionPreview from '../features/preview/DescriptionSectionPreview.tsx'
import SocialSectionPreview from '../features/preview/SocialSectionPreview.tsx'

// Helper to parse spacing strings (with pt, mm, in, px units) into numerical pixels
const parseSpacingToPx = (
  val: string | undefined,
  fallbackPx: number,
): number => {
  if (!val) return fallbackPx
  const num = parseFloat(val)
  if (isNaN(num)) return fallbackPx
  if (val.includes('pt')) return Math.round(num * 1.3333)
  if (val.includes('mm')) return Math.round(num * 3.7795)
  if (val.includes('in')) return Math.round(num * 96)
  return Math.round(num)
}

const ResumePreview: React.FC = () => {
  const resume = useSelector((state: RootState) => state.resume.resume)
  const activeTheme = useSelector(
    (state: RootState) =>
      state.theme.themes.find((t) => t.id === state.theme.activeThemeId) ||
      defaultTheme,
  )

  // Page Format state
  const [selectedFormatId, setSelectedFormatId] = useState<string>('a4')
  const selectedPage: PageFormat =
    PAGE_FORMATS[selectedFormatId] || DEFAULT_PAGE_FORMAT

  // Zoom state: 'fit' mode fits the whole page in one screen
  const [zoomMode, setZoomMode] = useState<'fit' | 'manual'>('fit')
  const [scale, setScale] = useState<number>(0.55)

  // Track latest zoomMode in a ref to avoid stale closures in ResizeObserver
  const zoomModeRef = useRef<'fit' | 'manual'>('fit')
  zoomModeRef.current = zoomMode

  // Content measurement for page breaks
  const [contentHeight, setContentHeight] = useState<number>(1123)

  // Section push spacers to avoid page margin collisions on screen
  const [sectionPaddings, setSectionPaddings] = useState<
    Record<string, number>
  >({})
  // Track which sections start on a new page (for clean print break-before and top margin)
  const [sectionBreakBefore, setSectionBreakBefore] = useState<
    Record<string, boolean>
  >({})

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const contentWrapperRef = useRef<HTMLDivElement>(null)

  // Document margins
  const rawPaddingY = activeTheme.spacing.document.paddingY || '24pt'
  const paddingYPx = parseSpacingToPx(rawPaddingY, 32)
  // Reduced top margin for Page 1 resume preview (compact ~18pt-24px, capped tightly to eliminate excess whitespace above candidate name)
  const topMarginPx = Math.max(16, Math.min(Math.round(paddingYPx * 0.6), 26))
  // Top margin for new pages (Page 2, Page 3, etc.) - full document top margin
  const newPageTopMarginPx = Math.max(28, paddingYPx)
  const bottomMarginPx = Math.max(24, Math.min(paddingYPx, 44))

  // Usable vertical content height per page
  const usablePageHeight = Math.max(
    100,
    selectedPage.heightPx - newPageTopMarginPx - bottomMarginPx,
  )

  // Fit scale calculation (fits the whole page height & width in one screen)
  const calculateFitScale = useCallback(
    (availW?: number, availH?: number) => {
      let width = availW
      let height = availH

      if (width === undefined || height === undefined) {
        if (!scrollContainerRef.current) return 0.55
        // 48px padding (24px each side) and extra headroom for toolbar
        width = scrollContainerRef.current.clientWidth - 48
        height = scrollContainerRef.current.clientHeight - 48
      }

      if (width <= 0 || height <= 0) return 0.55

      const scaleX = width / selectedPage.widthPx
      const scaleY = height / selectedPage.heightPx

      // To fit the WHOLE page in one screen, use the minimum of scaleX and scaleY
      const fit = Math.min(scaleX, scaleY)
      // Clamp between 0.2 and 1.2, rounded to 2 decimal places
      return Math.max(0.2, Math.min(1.2, Math.floor(fit * 100) / 100))
    },
    [selectedPage],
  )

  // Initial calculation before first paint
  useLayoutEffect(() => {
    if (zoomMode === 'fit' && scrollContainerRef.current) {
      const initialFit = calculateFitScale()
      setScale(initialFit)
    }
  }, [calculateFitScale, zoomMode, selectedFormatId])

  // Observe container size changes (e.g. window resize or dragging ResizeableSplitter)
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        if (width > 0 && height > 0 && zoomModeRef.current === 'fit') {
          const fit = calculateFitScale(width - 32, height - 32)
          setScale(fit)
        }
      }
    })

    observer.observe(container)
    return () => observer.disconnect()
  }, [calculateFitScale])

  // Observe content height for dynamic page break indicators
  useEffect(() => {
    const contentEl = contentWrapperRef.current
    if (!contentEl) return

    const updateHeight = () => {
      setContentHeight(contentEl.offsetHeight)
    }

    updateHeight()
    const observer = new ResizeObserver(updateHeight)
    observer.observe(contentEl)
    return () => observer.disconnect()
  }, [resume, activeTheme, selectedFormatId, sectionPaddings])

  const columnsCount = activeTheme.layout.columns.count || 1
  const columnsGap = activeTheme.layout.columns.gap || '24pt'

  // Compute pagination section breaks considering top and bottom margins for each page
  useLayoutEffect(() => {
    if (columnsCount > 1) {
      setSectionPaddings((prev) => (Object.keys(prev).length === 0 ? prev : {}))
      setSectionBreakBefore((prev) =>
        Object.keys(prev).length === 0 ? prev : {},
      )
      return
    }

    const contentEl = contentWrapperRef.current
    if (!contentEl) return

    const pageHeight = selectedPage.heightPx
    const headerEl = contentEl.querySelector('header')
    const headerHeight = headerEl ? headerEl.offsetHeight : 0
    const sectionGapPx = parseSpacingToPx(activeTheme.spacing.section.gap, 21)

    const sectionWrappers = Array.from(
      contentEl.querySelectorAll<HTMLDivElement>('.resume-section-wrapper'),
    )

    const newPaddings: Record<string, number> = {}
    const newBreakBefore: Record<string, boolean> = {}
    let currentY =
      topMarginPx + headerHeight + (headerHeight > 0 ? sectionGapPx : 0)
    let currentPage = 1

    for (const wrapper of sectionWrappers) {
      const sectionId = wrapper.getAttribute('data-section-id')
      if (!sectionId) continue

      const sectionEl = wrapper.querySelector('section')
      const sectionHeight = sectionEl
        ? sectionEl.offsetHeight
        : wrapper.offsetHeight

      // 1. Ensure currentY respects the top margin of currentPage (for Page 2+)
      if (currentPage > 1) {
        const pageTopStart = (currentPage - 1) * pageHeight + newPageTopMarginPx
        if (currentY < pageTopStart) {
          const topSpacer = pageTopStart - currentY
          newPaddings[sectionId] = (newPaddings[sectionId] || 0) + topSpacer
          currentY = pageTopStart
          newBreakBefore[sectionId] = true
        }
      }

      const currentBottomLimit = currentPage * pageHeight - bottomMarginPx

      // 2. Check if section collides with or overflows into the bottom margin
      if (currentY + sectionHeight > currentBottomLimit) {
        // Push section to start of next page after the new page's top margin
        currentPage += 1
        const nextPageTopStart =
          (currentPage - 1) * pageHeight + newPageTopMarginPx
        const pushSpacer = Math.max(0, nextPageTopStart - currentY)
        if (pushSpacer > 0) {
          newPaddings[sectionId] = (newPaddings[sectionId] || 0) + pushSpacer
          currentY = nextPageTopStart
          newBreakBefore[sectionId] = true
        }
      }

      currentY += sectionHeight + sectionGapPx

      // Advance currentPage if currentY naturally entered subsequent page boundary
      while (currentY > currentPage * pageHeight - bottomMarginPx) {
        currentPage += 1
      }
    }

    setSectionPaddings((prev) => {
      const prevKeys = Object.keys(prev)
      const newKeys = Object.keys(newPaddings)
      if (prevKeys.length !== newKeys.length) return newPaddings
      const hasChanged = newKeys.some((k) => prev[k] !== newPaddings[k])
      return hasChanged ? newPaddings : prev
    })

    setSectionBreakBefore((prev) => {
      const prevKeys = Object.keys(prev)
      const newKeys = Object.keys(newBreakBefore)
      if (prevKeys.length !== newKeys.length) return newBreakBefore
      const hasChanged = newKeys.some((k) => prev[k] !== newBreakBefore[k])
      return hasChanged ? newBreakBefore : prev
    })
  }, [
    resume,
    activeTheme,
    selectedPage.heightPx,
    topMarginPx,
    newPageTopMarginPx,
    bottomMarginPx,
    usablePageHeight,
    columnsCount,
  ])

  // Calculate total pages considering margins and pushed sections
  const netContentHeight = Math.max(
    0,
    contentHeight - topMarginPx - bottomMarginPx,
  )
  const totalPages = Math.max(
    1,
    Math.ceil(contentHeight / selectedPage.heightPx),
    Math.ceil(netContentHeight / usablePageHeight),
  )

  const handleZoomIn = () => {
    setZoomMode('manual')
    setScale((prev) => Math.min(1.5, Math.round((prev + 0.05) * 100) / 100))
  }

  const handleZoomOut = () => {
    setZoomMode('manual')
    setScale((prev) => Math.max(0.25, Math.round((prev - 0.05) * 100) / 100))
  }

  const handleFitPage = () => {
    setZoomMode('fit')
    setScale(calculateFitScale())
  }

  const handleSelectPreset = (value: string) => {
    if (value === 'fit') {
      handleFitPage()
    } else {
      setZoomMode('manual')
      setScale(parseFloat(value))
    }
  }

  const getSectionItemType = (section: Section) => {
    if (section.items && section.items.length > 0) {
      return section.items[0].type
    }
    if (section.itemType) {
      return section.itemType
    }
    if (section.type === SectionTypes.SKILLS) {
      return SectionItemTypes.TAG
    }
    if (section.type === SectionTypes.TEXT) {
      return SectionItemTypes.DESCRIPTION
    }
    return SectionItemTypes.STANDARD
  }

  const renderSection = (section: Section) => {
    const itemType = getSectionItemType(section)

    switch (itemType) {
      case SectionItemTypes.STANDARD:
        return <StandardSectionPreview section={section} theme={activeTheme} />
      case SectionItemTypes.TAG:
        return <TagSectionPreview section={section} theme={activeTheme} />
      case SectionItemTypes.DESCRIPTION:
        return (
          <DescriptionSectionPreview section={section} theme={activeTheme} />
        )
      case SectionItemTypes.SOCIAL:
        return <SocialSectionPreview section={section} theme={activeTheme} />
      default:
        return null
    }
  }

  const visibleSections = resume.sections.filter(
    (section) => section.isVisible !== false,
  )

  const separatorBorder = activeTheme.separators.section.visible
    ? `${activeTheme.separators.section.thickness} ${activeTheme.separators.section.style} ${activeTheme.separators.section.color}`
    : 'none'

  const displayedZoomPct = Math.round(scale * 100)
  const totalSheetHeight = totalPages * selectedPage.heightPx

  // Personal Info Layout & Photo Rendering (Indian Passport: 35 x 45 mm, 7:9 ratio)
  const rawAlignment = activeTheme.layout.header.alignment as string
  const headerLayout: PersonalInfoLayout =
    rawAlignment === 'left' ||
    rawAlignment === 'left-right' ||
    rawAlignment === 'center-left' ||
    rawAlignment === 'center-right' ||
    rawAlignment === 'right-left' ||
    rawAlignment === 'right'
      ? rawAlignment
      : rawAlignment === 'center'
        ? 'center-left'
        : resume.personalInfo.layout || 'center-left'

  const hasPhoto = Boolean(resume.personalInfo.photoUrl)

  const passportPhotoElement = hasPhoto ? (
    <div
      style={{
        width: '28mm',
        height: '36mm',
        minWidth: '28mm',
        minHeight: '36mm',
      }}
      className="shrink-0 overflow-hidden rounded-xs border border-gray-300 shadow-2xs"
    >
      <img
        src={resume.personalInfo.photoUrl}
        alt={resume.personalInfo.name}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        className="block"
      />
    </div>
  ) : null

  // Build interactive and printable contact items (email, phone, location, social links)
  const contactNodes: React.ReactNode[] = []

  if (resume.personalInfo.email) {
    contactNodes.push(
      <a
        key="email"
        href={`mailto:${resume.personalInfo.email}`}
        className="cursor-pointer hover:underline"
        style={{ color: 'inherit', textDecoration: 'none' }}
      >
        {resume.personalInfo.email}
      </a>,
    )
  }

  if (resume.personalInfo.phone) {
    contactNodes.push(
      <a
        key="phone"
        href={`tel:${resume.personalInfo.phone.replace(/[^\d+]/g, '')}`}
        className="cursor-pointer hover:underline"
        style={{ color: 'inherit', textDecoration: 'none' }}
      >
        {resume.personalInfo.phone}
      </a>,
    )
  }

  if (resume.personalInfo.location) {
    contactNodes.push(
      <span key="location">{resume.personalInfo.location}</span>,
    )
  }

  if (resume.personalInfo.links && resume.personalInfo.links.length > 0) {
    resume.personalInfo.links.forEach((l, idx) => {
      if (!l.url && !l.name) return
      const rawUrl = l.url?.trim() || ''
      const href = rawUrl
        ? rawUrl.startsWith('http://') || rawUrl.startsWith('https://')
          ? rawUrl
          : `https://${rawUrl}`
        : ''
      const cleanUrl = rawUrl.replace(/^https?:\/\/(www\.)?/, '')
      const label = l.name || cleanUrl
      const iconUrl = getSocialIconUrl(l.icon)

      const linkContent = (
        <>
          {iconUrl && (
            <img
              src={iconUrl}
              alt=""
              aria-hidden="true"
              className="shrink-0 object-contain select-none"
              style={{
                width: '1.05em',
                height: '1.05em',
                verticalAlign: '-0.15em',
                display: 'inline-block',
              }}
              onError={(e) => {
                ;(e.target as HTMLElement).style.display = 'none'
              }}
            />
          )}
          <span>{label}</span>
        </>
      )

      if (href) {
        contactNodes.push(
          <a
            key={l.id || `link-${idx}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex cursor-pointer items-center gap-1 hover:underline"
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            {linkContent}
          </a>,
        )
      } else {
        contactNodes.push(
          <span
            key={l.id || `link-${idx}`}
            className="inline-flex items-center gap-1"
          >
            {linkContent}
          </span>,
        )
      }
    })
  }

  const headerTextElement = (
    <div className="min-w-0">
      <h1
        style={{
          fontFamily: activeTheme.typography.fontFamily.heading,
          fontSize: activeTheme.typography.header.name.fontSize,
          fontWeight: activeTheme.typography.header.name.fontWeight,
          lineHeight: activeTheme.typography.header.name.lineHeight,
          color: activeTheme.colors.primary,
        }}
      >
        {resume.personalInfo.name}
      </h1>

      {contactNodes.length > 0 && (
        <p
          style={{
            fontSize: activeTheme.typography.header.contact.fontSize,
            fontWeight: activeTheme.typography.header.contact.fontWeight,
            lineHeight: activeTheme.typography.header.contact.lineHeight,
            color: activeTheme.colors.secondary,
            marginTop: '0.25rem',
          }}
        >
          {contactNodes.map((node, i) => (
            <React.Fragment key={i}>
              {i > 0 && (
                <span
                  className="opacity-60 select-none"
                  style={{ margin: '0 0.45rem' }}
                >
                  |
                </span>
              )}
              {node}
            </React.Fragment>
          ))}
        </p>
      )}
    </div>
  )

  const renderPersonalInfoHeader = () => {
    if (!hasPhoto) {
      const textAlign =
        headerLayout === 'right' || headerLayout === 'right-left'
          ? 'right'
          : headerLayout === 'left' || headerLayout === 'left-right'
            ? 'left'
            : 'center'
      return (
        <header
          style={{
            textAlign,
            marginBottom: activeTheme.spacing.section.gap,
          }}
        >
          {headerTextElement}
        </header>
      )
    }

    switch (headerLayout) {
      case 'left':
        return (
          <header
            style={{ marginBottom: activeTheme.spacing.section.gap }}
            className="flex flex-row items-center justify-start gap-4 text-left"
          >
            {passportPhotoElement}
            <div className="min-w-0 flex-1 text-left">{headerTextElement}</div>
          </header>
        )
      case 'left-right':
        return (
          <header
            style={{ marginBottom: activeTheme.spacing.section.gap }}
            className="flex flex-row items-center justify-between gap-4 text-left"
          >
            <div className="min-w-0 flex-1 text-left">{headerTextElement}</div>
            {passportPhotoElement}
          </header>
        )
      case 'center-left':
        return (
          <header
            style={{ marginBottom: activeTheme.spacing.section.gap }}
            className="flex flex-row items-center justify-center gap-5 text-left"
          >
            {passportPhotoElement}
            <div className="min-w-0 text-left">{headerTextElement}</div>
          </header>
        )
      case 'center-right':
        return (
          <header
            style={{ marginBottom: activeTheme.spacing.section.gap }}
            className="flex flex-row items-center justify-center gap-5 text-right"
          >
            <div className="min-w-0 text-right">{headerTextElement}</div>
            {passportPhotoElement}
          </header>
        )
      case 'right-left':
        return (
          <header
            style={{ marginBottom: activeTheme.spacing.section.gap }}
            className="flex flex-row items-center justify-between gap-4 text-right"
          >
            {passportPhotoElement}
            <div className="min-w-0 flex-1 text-right">{headerTextElement}</div>
          </header>
        )
      case 'right':
        return (
          <header
            style={{ marginBottom: activeTheme.spacing.section.gap }}
            className="flex flex-row items-center justify-end gap-4 text-right"
          >
            <div className="min-w-0 flex-1 text-right">{headerTextElement}</div>
            {passportPhotoElement}
          </header>
        )
      default:
        return (
          <header
            style={{ marginBottom: activeTheme.spacing.section.gap }}
            className="flex flex-row items-center justify-center gap-5 text-left"
          >
            {passportPhotoElement}
            <div className="min-w-0 text-left">{headerTextElement}</div>
          </header>
        )
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-gray-200">
      {/* Preview Toolbar */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-gray-300 bg-white px-4 py-2 shadow-xs select-none">
        {/* Page Format Selector & Page Count */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="page-format-select"
            className="text-xs font-semibold tracking-wider text-gray-500 uppercase"
          >
            Page:
          </label>
          <select
            id="page-format-select"
            value={selectedFormatId}
            onChange={(e) => setSelectedFormatId(e.target.value)}
            className="rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-2xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          >
            {Object.values(PAGE_FORMATS).map((fmt) => (
              <option key={fmt.id} value={fmt.id}>
                {fmt.label}
              </option>
            ))}
          </select>

          {/* Page Count Badge */}
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              totalPages === 1
                ? 'border border-green-200 bg-green-50 text-green-700'
                : 'border border-amber-200 bg-amber-50 text-amber-700'
            }`}
          >
            {totalPages} {totalPages === 1 ? 'Page' : 'Pages'}
          </span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleZoomOut}
            title="Zoom Out (-5%)"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 bg-white text-xs font-bold text-gray-600 shadow-2xs transition-all hover:bg-gray-50 active:scale-95"
          >
            −
          </button>

          {/* Zoom Preset Selector */}
          <select
            value={zoomMode === 'fit' ? 'fit' : scale.toString()}
            onChange={(e) => handleSelectPreset(e.target.value)}
            className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-semibold text-gray-700 shadow-2xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          >
            <option value="fit">Fit Page ({displayedZoomPct}%)</option>
            <option value="0.4">40%</option>
            <option value="0.5">50%</option>
            <option value="0.6">60%</option>
            <option value="0.75">75%</option>
            <option value="1">100%</option>
            <option value="1.25">125%</option>
          </select>

          <button
            type="button"
            onClick={handleZoomIn}
            title="Zoom In (+5%)"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 bg-white text-xs font-bold text-gray-600 shadow-2xs transition-all hover:bg-gray-50 active:scale-95"
          >
            +
          </button>

          <button
            type="button"
            onClick={handleFitPage}
            title="Fit whole page in screen"
            className={`rounded-md border px-2.5 py-1 text-xs font-medium shadow-2xs transition-colors ${
              zoomMode === 'fit'
                ? 'border-blue-300 bg-blue-50 font-semibold text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Fit Page
          </button>

          {/* Quick Print Button */}
          <button
            type="button"
            onClick={() => printResume(selectedPage.printSize)}
            title="Print Resume"
            className="ml-2 inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 shadow-2xs transition-all hover:bg-gray-50 hover:text-blue-600 active:scale-95"
          >
            <img
              src="https://img.icons8.com/color/48/print.png"
              alt=""
              className="pointer-events-none h-3.5 w-3.5 shrink-0 object-contain select-none"
            />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Scrollable Canvas Viewport */}
      <div
        ref={scrollContainerRef}
        className="flex min-h-0 flex-1 overflow-auto p-6"
      >
        {/* Scaled Geometry Wrapper - uses margin: auto for centered alignment and scroll safety */}
        <div
          style={{
            width: `${Math.round(selectedPage.widthPx * scale)}px`,
            height: `${Math.round(totalSheetHeight * scale)}px`,
            position: 'relative',
            flexShrink: 0,
            margin: 'auto',
          }}
        >
          {/* Printable Page Sheet */}
          <div
            id="resume-preview"
            data-page-size={selectedPage.printSize}
            data-new-page-top-margin={newPageTopMarginPx}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: `${selectedPage.widthPx}px`,
              height: `${totalSheetHeight}px`,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              backgroundColor: activeTheme.colors.background,
              color: activeTheme.colors.text,
              fontFamily: activeTheme.typography.fontFamily.body,
              boxSizing: 'border-box',
              ['--new-page-top-margin' as any]: `${newPageTopMarginPx}px`,
            }}
            className="box-border bg-white shadow-xl transition-colors"
          >
            {/* Page Break Separators with Margin Consideration */}
            {totalPages > 1 &&
              Array.from({ length: totalPages - 1 }).map((_, i) => {
                const pageIndex = i + 1
                const pageBoundary = pageIndex * selectedPage.heightPx
                const bottomMarginStart = pageBoundary - bottomMarginPx
                const totalMarginBand = bottomMarginPx + newPageTopMarginPx

                return (
                  <div
                    key={i}
                    className="page-break-indicator pointer-events-none absolute right-0 left-0 z-30 select-none"
                    style={{
                      top: `${bottomMarginStart}px`,
                      height: `${totalMarginBand}px`,
                    }}
                  >
                    {/* Page {pageIndex} Bottom Margin Zone */}
                    <div
                      style={{ height: `${bottomMarginPx}px` }}
                      className="relative flex items-center justify-between border-t border-dashed border-red-300 bg-red-500/5 px-4"
                    >
                      <span className="text-[10px] font-semibold tracking-wider text-red-500 uppercase">
                        Page {pageIndex} Bottom Margin (
                        {Math.round(bottomMarginPx)}px)
                      </span>
                      <span className="text-[9px] font-medium text-red-400">
                        Printable Limit
                      </span>
                    </div>

                    {/* Central Page Split Line - Placed EXACTLY at pageBoundary */}
                    <div
                      style={{ top: `${bottomMarginPx}px` }}
                      className="absolute right-0 left-0 z-10 flex -translate-y-1/2 items-center"
                    >
                      <div className="flex-1 border-t-2 border-dashed border-red-500 opacity-80" />
                      <div className="mx-2 flex items-center gap-1.5 rounded-full border border-red-400 bg-red-50/95 px-3 py-0.5 shadow-xs backdrop-blur-xs">
                        <span className="text-[11px] font-bold text-red-600">
                          ✂ Page {pageIndex} End / Page {pageIndex + 1} Start
                        </span>
                      </div>
                      <div className="flex-1 border-t-2 border-dashed border-red-500 opacity-80" />
                    </div>

                    {/* Page {pageIndex + 1} Top Margin Zone */}
                    <div
                      style={{ height: `${newPageTopMarginPx}px` }}
                      className="relative flex items-center justify-between border-b border-dashed border-blue-300 bg-blue-500/5 px-4"
                    >
                      <span className="text-[10px] font-semibold tracking-wider text-blue-600 uppercase">
                        Page {pageIndex + 1} Top Margin (
                        {Math.round(newPageTopMarginPx)}px)
                      </span>
                      <span className="text-[9px] font-medium text-blue-400">
                        Printable Start
                      </span>
                    </div>
                  </div>
                )
              })}

            {/* Measurable Content Wrapper with Document Margins */}
            <div
              ref={contentWrapperRef}
              style={{
                paddingTop: `${topMarginPx}px`,
                paddingBottom: `${bottomMarginPx}px`,
                paddingLeft: activeTheme.spacing.document.paddingX,
                paddingRight: activeTheme.spacing.document.paddingX,
                boxSizing: 'border-box',
              }}
            >
              {/* Header with Photo and 6 Layout Options */}
              {renderPersonalInfoHeader()}

              {/* Main Section Content */}
              <main
                style={{
                  columnCount: columnsCount > 1 ? columnsCount : undefined,
                  columnGap: columnsCount > 1 ? columnsGap : undefined,
                }}
              >
                {visibleSections.map((section) => (
                  <div
                    key={section.id}
                    data-section-id={section.id}
                    data-page-break-before={
                      sectionBreakBefore[section.id] ? 'true' : undefined
                    }
                    className="resume-section-wrapper"
                    style={{
                      display: 'flow-root',
                      paddingTop: sectionPaddings[section.id]
                        ? `${sectionPaddings[section.id]}px`
                        : undefined,
                    }}
                  >
                    <section
                      style={{
                        marginBottom: activeTheme.spacing.section.gap,
                        breakInside: 'avoid',
                      }}
                    >
                      <h2
                        style={{
                          fontFamily: activeTheme.typography.fontFamily.heading,
                          fontSize:
                            activeTheme.typography.section.title.fontSize,
                          fontWeight:
                            activeTheme.typography.section.title.fontWeight,
                          lineHeight:
                            activeTheme.typography.section.title.lineHeight,
                          textTransform: activeTheme.typography.section.title
                            .textTransform as React.CSSProperties['textTransform'],
                          color: activeTheme.colors.primary,
                          borderBottom: separatorBorder,
                          paddingBottom: '0.25rem',
                          marginBottom: activeTheme.spacing.item.gap,
                        }}
                      >
                        {section.title}
                      </h2>
                      {renderSection(section)}
                    </section>
                  </div>
                ))}
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumePreview
