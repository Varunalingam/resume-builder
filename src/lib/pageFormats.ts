export interface PageFormat {
  id: string
  name: string
  label: string
  widthMm: number
  heightMm: number
  widthPx: number // Standard 96 DPI CSS pixels
  heightPx: number
  printSize: string
}

export const PAGE_FORMATS: Record<string, PageFormat> = {
  a4: {
    id: 'a4',
    name: 'A4',
    label: 'A4 (210 × 297 mm)',
    widthMm: 210,
    heightMm: 297,
    widthPx: 794,
    heightPx: 1123,
    printSize: 'a4',
  },
  letter: {
    id: 'letter',
    name: 'Letter',
    label: 'US Letter (8.5 × 11 in)',
    widthMm: 215.9,
    heightMm: 279.4,
    widthPx: 816,
    heightPx: 1056,
    printSize: 'letter',
  },
  legal: {
    id: 'legal',
    name: 'Legal',
    label: 'US Legal (8.5 × 14 in)',
    widthMm: 215.9,
    heightMm: 355.6,
    widthPx: 816,
    heightPx: 1344,
    printSize: 'legal',
  },
  executive: {
    id: 'executive',
    name: 'Executive',
    label: 'Executive (7.25 × 10.5 in)',
    widthMm: 184.15,
    heightMm: 266.7,
    widthPx: 696,
    heightPx: 1008,
    printSize: 'executive',
  },
  a5: {
    id: 'a5',
    name: 'A5',
    label: 'A5 (148 × 210 mm)',
    widthMm: 148,
    heightMm: 210,
    widthPx: 559,
    heightPx: 794,
    printSize: 'a5',
  },
  a3: {
    id: 'a3',
    name: 'A3',
    label: 'A3 (297 × 420 mm)',
    widthMm: 297,
    heightMm: 420,
    widthPx: 1123,
    heightPx: 1587,
    printSize: 'a3',
  },
}

export const DEFAULT_PAGE_FORMAT = PAGE_FORMATS.a4
