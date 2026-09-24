import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { printResume } from './printUtils.ts'

describe('printResume', () => {
  const originalDocument = globalThis.document
  const originalWindow = globalThis.window

  let mockDocument: any
  let mockWindow: any
  let mockPreviewEl: any

  beforeEach(() => {
    mockPreviewEl = {
      id: 'resume-preview',
      getAttribute: vi.fn((attr: string) => {
        if (attr === 'data-page-size') return 'a4'
        if (attr === 'data-new-page-top-margin') return '32'
        return null
      }),
      style: {
        backgroundColor: 'rgb(255, 255, 255)',
        color: 'rgb(17, 24, 39)',
        fontFamily: 'Inter, sans-serif',
        getPropertyValue: vi.fn((prop: string) =>
          prop === '--new-page-top-margin' ? '32px' : '',
        ),
      },
      innerHTML: '<div class="content-inner">Resume Content</div>',
    }

    mockWindow = {
      print: vi.fn(),
    }

    mockDocument = {
      getElementById: vi.fn((id: string) =>
        id === 'resume-preview' ? mockPreviewEl : null,
      ),
      querySelectorAll: vi.fn(() => []),
      createElement: vi.fn(),
      body: {
        appendChild: vi.fn(),
        removeChild: vi.fn(),
        contains: vi.fn(() => true),
      },
    }

    globalThis.document = mockDocument
    globalThis.window = mockWindow
  })

  afterEach(() => {
    globalThis.document = originalDocument
    globalThis.window = originalWindow
    vi.restoreAllMocks()
  })

  it('creates an isolated iframe and writes print styles matching preview margins', () => {
    let writtenHtml = ''
    const mockPrint = vi.fn()
    const mockFocus = vi.fn()

    const mockIframeDoc = {
      open: vi.fn(),
      write: vi.fn((html: string) => {
        writtenHtml = html
      }),
      close: vi.fn(),
    }

    const mockIframe: any = {
      style: {},
      contentWindow: {
        document: mockIframeDoc,
        print: mockPrint,
        focus: mockFocus,
      },
    }

    mockDocument.createElement.mockImplementation((tag: string) => {
      if (tag === 'iframe') {
        return mockIframe
      }
      return {}
    })

    printResume('a4')

    expect(mockDocument.createElement).toHaveBeenCalledWith('iframe')
    expect(mockDocument.body.appendChild).toHaveBeenCalledWith(mockIframe)
    expect(writtenHtml).toContain('@page')
    expect(writtenHtml).toContain('size: a4')
    expect(writtenHtml).toContain('margin: 0mm !important')
    // #resume-preview must have padding: 0 so inner content wrapper margins match preview
    expect(writtenHtml).toContain('padding: 0 !important')
    expect(writtenHtml).not.toContain('padding: 10mm 8mm !important')
    expect(writtenHtml).not.toContain('padding: 20mm 18mm !important')
    // Sections on page 2+ that break before must receive exact new page top margin
    expect(writtenHtml).toContain(
      ".resume-section-wrapper[data-page-break-before='true']",
    )
    expect(writtenHtml).toContain('padding-top: 32px !important')
    expect(writtenHtml).toContain('break-before: page !important')
    // Inner resume content must be embedded
    expect(writtenHtml).toContain('Resume Content')
    // Should preserve font family and colors
    expect(writtenHtml).toContain('font-family: Inter, sans-serif')
  })

  it('falls back to window.print if #resume-preview is not found', () => {
    mockDocument.getElementById.mockReturnValue(null)

    printResume('letter')

    expect(mockWindow.print).toHaveBeenCalled()
  })
})
