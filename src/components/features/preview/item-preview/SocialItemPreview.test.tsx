import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import SocialItemPreview from './SocialItemPreview.tsx'
import { defaultTheme } from '../../../../data/default-theme.ts'
import type { SocialEntry } from '../../../../types/resume.types.ts'
import type { ThemeConfig } from '../../../../types/theme.types.ts'

describe('<SocialItemPreview />', () => {
  const sampleItem: SocialEntry = {
    id: 'soc-1',
    type: 'social',
    platform: 'GitHub',
    url: 'https://github.com/developer',
  }

  const sampleItemWithIcon: SocialEntry = {
    id: 'soc-2',
    type: 'social',
    platform: 'LinkedIn',
    url: 'linkedin.com/in/developer',
    icon: 'linkedin',
  }

  it('renders inline social arrangement by default and has clickable link', () => {
    const html = renderToStaticMarkup(
      <SocialItemPreview item={sampleItem} theme={defaultTheme} />,
    )
    expect(html).toContain('GitHub')
    expect(html).toContain('github.com/developer')
    expect(html).toContain('href="https://github.com/developer"')
    expect(html).toContain('target="_blank"')
  })

  it('renders optional icon when icon property is provided', () => {
    const html = renderToStaticMarkup(
      <SocialItemPreview item={sampleItemWithIcon} theme={defaultTheme} />,
    )
    expect(html).toContain('LinkedIn')
    expect(html).toContain('href="https://linkedin.com/in/developer"')
    expect(html).toContain('src="https://img.icons8.com/color/48/linkedin.png"')
  })

  it('omits icon when icon property is not provided', () => {
    const html = renderToStaticMarkup(
      <SocialItemPreview item={sampleItem} theme={defaultTheme} />,
    )
    expect(html).not.toContain('<img')
  })

  it('renders stacked social arrangement with clickable link', () => {
    const stackedTheme: ThemeConfig = {
      ...defaultTheme,
      layout: {
        ...defaultTheme.layout,
        items: {
          standard: defaultTheme.layout.items?.standard ?? 'split',
          tag: defaultTheme.layout.items?.tag ?? 'pills',
          description: defaultTheme.layout.items?.description ?? 'standard',
          social: 'stacked',
        },
      },
    }
    const html = renderToStaticMarkup(
      <SocialItemPreview item={sampleItemWithIcon} theme={stackedTheme} />,
    )
    expect(html).toContain('LinkedIn:')
    expect(html).toContain('linkedin.com/in/developer')
    expect(html).toContain('href="https://linkedin.com/in/developer"')
    expect(html).toContain('src="https://img.icons8.com/color/48/linkedin.png"')
  })

  it('renders grid social arrangement with clickable link', () => {
    const gridTheme: ThemeConfig = {
      ...defaultTheme,
      layout: {
        ...defaultTheme.layout,
        items: {
          standard: defaultTheme.layout.items?.standard ?? 'split',
          tag: defaultTheme.layout.items?.tag ?? 'pills',
          description: defaultTheme.layout.items?.description ?? 'standard',
          social: 'grid',
        },
      },
    }
    const html = renderToStaticMarkup(
      <SocialItemPreview item={sampleItemWithIcon} theme={gridTheme} />,
    )
    expect(html).toContain('LinkedIn')
    expect(html).toContain('linkedin.com/in/developer')
    expect(html).toContain('href="https://linkedin.com/in/developer"')
  })
})
