/**
 * Prints only the contents of the resume preview element with page margins
 * while strictly suppressing browser headers (title/URL) and footers (date/timestamp).
 */
export const printResume = (pageSize?: string) => {
  const previewEl = document.getElementById('resume-preview')
  if (!previewEl) {
    window.print()
    return
  }

  const effectivePageSize =
    pageSize || previewEl.getAttribute('data-page-size') || 'a4'

  // Sourced top margin for new pages (Page 2, 3, etc.)
  const newPageTopMargin =
    previewEl.getAttribute('data-new-page-top-margin') ||
    previewEl.style.getPropertyValue('--new-page-top-margin') ||
    '32px'
  const newPageTopMarginVal = newPageTopMargin.endsWith('px')
    ? newPageTopMargin
    : `${newPageTopMargin}px`

  // Create an invisible iframe for isolated printing
  const iframe = document.createElement('iframe')
  iframe.style.position = 'fixed'
  iframe.style.right = '0'
  iframe.style.bottom = '0'
  iframe.style.width = '0'
  iframe.style.height = '0'
  iframe.style.border = '0'
  document.body.appendChild(iframe)

  const iframeDoc = iframe.contentWindow?.document
  if (!iframeDoc) {
    window.print()
    return
  }

  // Collect all stylesheet links and style tags from current document
  const styleElements = Array.from(
    document.querySelectorAll('link[rel="stylesheet"], style'),
  )
    .map((el) => el.outerHTML)
    .join('\n')

  const bg = previewEl.style.backgroundColor || '#ffffff'
  const color = previewEl.style.color || '#000000'
  const fontFamily = previewEl.style.fontFamily || 'inherit'

  iframeDoc.open()
  iframeDoc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title></title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        ${styleElements}
        <style>
          /* 
           * Setting @page margin to 0 is required by Chromium/WebKit
           * to completely suppress browser headers (title/URL) and footers (timestamp/date).
           */
          @page {
            size: ${effectivePageSize};
            margin: 0mm !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background-color: #ffffff !important;
            color: #000000 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /*
           * Padding is 0 so the document margins applied to the inner wrapper
           * (paddingX, topMarginPx, bottomMarginPx) match the resume preview exactly.
           */
          #resume-preview {
            box-sizing: border-box !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
            transform: none !important;
          }
          .page-break-indicator {
            display: none !important;
          }
          /*
           * Reset section wrappers so screen-only spacers (which bridge over page cut lines)
           * are not duplicated across physical print pages.
           * For sections that break onto a new page, enforce page break and apply the exact
           * newPageTopMarginPx so the 2nd (and subsequent) page starts with the correct top margin.
           */
          .resume-section-wrapper {
            margin-top: 0 !important;
            padding-top: 0 !important;
          }
          .resume-section-wrapper[data-page-break-before='true'] {
            break-before: page !important;
            page-break-before: always !important;
            padding-top: ${newPageTopMarginVal} !important;
          }
          section {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        </style>
      </head>
      <body>
        <div id="resume-preview" style="background-color: ${bg}; color: ${color}; font-family: ${fontFamily};">${previewEl.innerHTML}</div>
      </body>
    </html>
  `)
  iframeDoc.close()

  // Wait briefly for styles to compute, then open print dialog
  setTimeout(() => {
    iframe.contentWindow?.focus()
    iframe.contentWindow?.print()
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe)
      }
    }, 2000)
  }, 300)
}
