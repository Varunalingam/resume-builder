import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import StandardSectionPreview from './StandardSectionPreview.tsx'
import TagSectionPreview from './TagSectionPreview.tsx'
import DescriptionSectionPreview from './DescriptionSectionPreview.tsx'
import SocialSectionPreview from './SocialSectionPreview.tsx'
import { defaultTheme } from '../../../data/default-theme.ts'
import type { Section } from '../../../types/resume.types.ts'
import type { ThemeConfig } from '../../../types/theme.types.ts'

describe('Section Previews', () => {
  it('renders StandardSectionPreview with all items', () => {
    const section: Section = {
      id: 'sec-standard',
      title: 'Experience',
      type: 'experience',
      items: [
        {
          id: 'item-1',
          type: 'standard',
          header: 'Software Engineer',
          subHeader: 'Company A',
          description: 'Built frontend apps',
        },
      ],
    }
    const html = renderToStaticMarkup(
      <StandardSectionPreview section={section} theme={defaultTheme} />,
    )
    expect(html).toContain('Software Engineer')
    expect(html).toContain('Company A')
  })

  it('filters out hidden items with isVisible: false', () => {
    const section: Section = {
      id: 'sec-standard-hidden',
      title: 'Experience',
      type: 'experience',
      items: [
        {
          id: 'item-1',
          type: 'standard',
          header: 'Visible Engineer',
          subHeader: 'Visible Co',
          description: 'Working publicly',
          isVisible: true,
        },
        {
          id: 'item-2',
          type: 'standard',
          header: 'Secret Engineer',
          subHeader: 'Hidden Inc',
          description: 'Working confidentially',
          isVisible: false,
        },
      ],
    }
    const html = renderToStaticMarkup(
      <StandardSectionPreview section={section} theme={defaultTheme} />,
    )
    expect(html).toContain('Visible Engineer')
    expect(html).not.toContain('Secret Engineer')
  })

  it('renders TagSectionPreview with items', () => {
    const section: Section = {
      id: 'sec-tags',
      title: 'Skills',
      type: 'skills',
      items: [
        {
          id: 'item-2',
          type: 'tag',
          tags: ['React', 'TypeScript', 'Tailwind'],
        },
      ],
    }
    const html = renderToStaticMarkup(
      <TagSectionPreview section={section} theme={defaultTheme} />,
    )
    expect(html).toContain('React')
    expect(html).toContain('TypeScript')
  })

  it('renders DescriptionSectionPreview with items', () => {
    const section: Section = {
      id: 'sec-desc',
      title: 'Summary',
      type: 'text',
      items: [
        {
          id: 'item-3',
          type: 'description',
          description: 'A dedicated engineer.',
        },
      ],
    }
    const html = renderToStaticMarkup(
      <DescriptionSectionPreview section={section} theme={defaultTheme} />,
    )
    expect(html).toContain('A dedicated engineer.')
  })

  it('renders SocialSectionPreview with items in grid arrangement', () => {
    const section: Section = {
      id: 'sec-soc',
      title: 'Links',
      type: 'text',
      items: [
        {
          id: 'item-4',
          type: 'social',
          platform: 'LinkedIn',
          url: 'https://linkedin.com/in/test',
        },
      ],
    }
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
      <SocialSectionPreview section={section} theme={gridTheme} />,
    )
    expect(html).toContain('LinkedIn')
    expect(html).toContain('https://linkedin.com/in/test')
  })
})
