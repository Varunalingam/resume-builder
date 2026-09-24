import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import TagItemPreview from './TagItemPreview.tsx'
import { defaultTheme } from '../../../../data/default-theme.ts'
import type { TagEntry } from '../../../../types/resume.types.ts'
import type { ThemeConfig } from '../../../../types/theme.types.ts'

describe('<TagItemPreview />', () => {
  const sampleItem: TagEntry = {
    id: 'tag-1',
    type: 'tag',
    header: 'Languages',
    tags: ['TypeScript', 'React', 'Node.js'],
  }

  it('renders tags in pills arrangement by default', () => {
    const html = renderToStaticMarkup(
      <TagItemPreview item={sampleItem} theme={defaultTheme} />,
    )
    expect(html).toContain('Languages')
    expect(html).toContain('TypeScript')
    expect(html).toContain('React')
    expect(html).toContain('Node.js')
  })

  it('renders tags in comma arrangement', () => {
    const commaTheme: ThemeConfig = {
      ...defaultTheme,
      layout: {
        ...defaultTheme.layout,
        items: {
          standard: defaultTheme.layout.items?.standard ?? 'split',
          tag: 'comma',
          description: defaultTheme.layout.items?.description ?? 'standard',
          social: defaultTheme.layout.items?.social ?? 'inline',
        },
      },
    }
    const html = renderToStaticMarkup(
      <TagItemPreview item={sampleItem} theme={commaTheme} />,
    )
    expect(html).toContain('TypeScript, React, Node.js')
  })

  it('renders tags in bullets arrangement', () => {
    const bulletsTheme: ThemeConfig = {
      ...defaultTheme,
      layout: {
        ...defaultTheme.layout,
        items: {
          standard: defaultTheme.layout.items?.standard ?? 'split',
          tag: 'bullets',
          description: defaultTheme.layout.items?.description ?? 'standard',
          social: defaultTheme.layout.items?.social ?? 'inline',
        },
      },
    }
    const html = renderToStaticMarkup(
      <TagItemPreview item={sampleItem} theme={bulletsTheme} />,
    )
    expect(html).toContain('TypeScript')
    expect(html).toContain('React')
  })

  it('returns null when tags array is empty', () => {
    const emptyItem: TagEntry = {
      id: 'tag-empty',
      type: 'tag',
      tags: [],
    }
    const html = renderToStaticMarkup(
      <TagItemPreview item={emptyItem} theme={defaultTheme} />,
    )
    expect(html).toBe('')
  })
})
