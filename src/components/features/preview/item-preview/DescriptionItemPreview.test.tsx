import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import DescriptionItemPreview from './DescriptionItemPreview.tsx'
import { defaultTheme } from '../../../../data/default-theme.ts'
import type { DescriptionEntry } from '../../../../types/resume.types.ts'
import type { ThemeConfig } from '../../../../types/theme.types.ts'

describe('<DescriptionItemPreview />', () => {
  const sampleItem: DescriptionEntry = {
    id: 'desc-1',
    type: 'description',
    subHeader: 'Executive Profile',
    description: 'Experienced architect specializing in modern web systems.',
  }

  it('renders standard description arrangement', () => {
    const html = renderToStaticMarkup(
      <DescriptionItemPreview item={sampleItem} theme={defaultTheme} />,
    )
    expect(html).toContain('Executive Profile')
    expect(html).toContain(
      'Experienced architect specializing in modern web systems.',
    )
  })

  it('renders bordered description arrangement', () => {
    const borderedTheme: ThemeConfig = {
      ...defaultTheme,
      layout: {
        ...defaultTheme.layout,
        items: {
          standard: defaultTheme.layout.items?.standard ?? 'split',
          tag: defaultTheme.layout.items?.tag ?? 'pills',
          description: 'bordered',
          social: defaultTheme.layout.items?.social ?? 'inline',
        },
      },
    }
    const html = renderToStaticMarkup(
      <DescriptionItemPreview item={sampleItem} theme={borderedTheme} />,
    )
    expect(html).toContain('Executive Profile')
    expect(html).toContain('border-left-width')
  })

  it('renders compact description arrangement', () => {
    const compactTheme: ThemeConfig = {
      ...defaultTheme,
      layout: {
        ...defaultTheme.layout,
        items: {
          standard: defaultTheme.layout.items?.standard ?? 'split',
          tag: defaultTheme.layout.items?.tag ?? 'pills',
          description: 'compact',
          social: defaultTheme.layout.items?.social ?? 'inline',
        },
      },
    }
    const html = renderToStaticMarkup(
      <DescriptionItemPreview item={sampleItem} theme={compactTheme} />,
    )
    expect(html).toContain('Executive Profile')
    expect(html).toContain(
      'Experienced architect specializing in modern web systems.',
    )
  })

  it('renders rich markdown formatting in description', () => {
    const markdownItem: DescriptionEntry = {
      id: 'desc-md',
      type: 'description',
      subHeader: 'Technical Summary',
      description:
        'Specializing in **Cloud Infrastructure** & *Distributed Systems*. Formula <u>x</u><sub>1</sub> + y<sup>2</sup>.\n- 10+ yrs experience\n- AWS Certified',
    }
    const html = renderToStaticMarkup(
      <DescriptionItemPreview item={markdownItem} theme={defaultTheme} />,
    )
    expect(html).toContain('<strong>Cloud Infrastructure</strong>')
    expect(html).toContain('<em>Distributed Systems</em>')
    expect(html).toContain('<u>x</u>')
    expect(html).toContain('<sub>1</sub>')
    expect(html).toContain('<sup>2</sup>')
    expect(html).toContain('<ul class="markdown-list">')
    expect(html).toContain('<li>10+ yrs experience</li>')
    expect(html).toContain('<li>AWS Certified</li>')
  })
})
