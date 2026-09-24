import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import StandardItemPreview from './StandardItemPreview.tsx'
import { defaultTheme } from '../../../../data/default-theme.ts'
import type { StandardEntry } from '../../../../types/resume.types.ts'
import type { ThemeConfig } from '../../../../types/theme.types.ts'

describe('<StandardItemPreview />', () => {
  const sampleItem: StandardEntry = {
    id: 'exp-1',
    type: 'standard',
    header: 'Senior Software Engineer',
    subHeader: 'Acme Corp',
    location: 'Remote',
    dateRange: { startDate: '2021', endDate: 'Present' },
    description: 'Developed scalable microservices in TypeScript.',
  }

  it('renders standard item content in split arrangement', () => {
    const html = renderToStaticMarkup(
      <StandardItemPreview item={sampleItem} theme={defaultTheme} />,
    )
    expect(html).toContain('Senior Software Engineer')
    expect(html).toContain('Acme Corp')
    expect(html).toContain('Remote')
    expect(html).toContain('2021 – Present')
    expect(html).toContain('Developed scalable microservices in TypeScript.')
  })

  it('renders properly in stacked arrangement', () => {
    const stackedTheme: ThemeConfig = {
      ...defaultTheme,
      layout: {
        ...defaultTheme.layout,
        items: {
          standard: 'stacked',
          tag: defaultTheme.layout.items?.tag ?? 'pills',
          description: defaultTheme.layout.items?.description ?? 'standard',
          social: defaultTheme.layout.items?.social ?? 'inline',
        },
      },
    }
    const html = renderToStaticMarkup(
      <StandardItemPreview item={sampleItem} theme={stackedTheme} />,
    )
    expect(html).toContain('Senior Software Engineer')
    expect(html).toContain('Acme Corp')
  })

  it('renders properly in compact arrangement', () => {
    const compactTheme: ThemeConfig = {
      ...defaultTheme,
      layout: {
        ...defaultTheme.layout,
        items: {
          standard: 'compact',
          tag: defaultTheme.layout.items?.tag ?? 'pills',
          description: defaultTheme.layout.items?.description ?? 'standard',
          social: defaultTheme.layout.items?.social ?? 'inline',
        },
      },
    }
    const html = renderToStaticMarkup(
      <StandardItemPreview item={sampleItem} theme={compactTheme} />,
    )
    expect(html).toContain('Senior Software Engineer')
    expect(html).toContain('Acme Corp')
  })

  it('renders rich markdown formatting (bold, italics, underline, sub, sup, lists)', () => {
    const markdownItem: StandardEntry = {
      ...sampleItem,
      description:
        'Led **Core Architecture** with *React*, <u>TypeScript</u>, H<sub>2</sub>O, and E=mc<sup>2</sup>.\n- Scaled throughput by 40%\n- Mentored 8 engineers',
    }
    const html = renderToStaticMarkup(
      <StandardItemPreview item={markdownItem} theme={defaultTheme} />,
    )
    expect(html).toContain('<strong>Core Architecture</strong>')
    expect(html).toContain('<em>React</em>')
    expect(html).toContain('<u>TypeScript</u>')
    expect(html).toContain('<sub>2</sub>')
    expect(html).toContain('<sup>2</sup>')
    expect(html).toContain('<ul class="markdown-list">')
    expect(html).toContain('<li>Scaled throughput by 40%</li>')
    expect(html).toContain('<li>Mentored 8 engineers</li>')
  })
})
