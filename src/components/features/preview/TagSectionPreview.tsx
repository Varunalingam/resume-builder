import React from 'react'
import type { Section, TagEntry } from '../../../types/resume.types.ts'
import type { ThemeConfig } from '../../../types/theme.types.ts'
import TagItemPreview from './item-preview/TagItemPreview.tsx'

interface TagSectionPreviewProps {
  section: Section
  theme: ThemeConfig
}

const TagSectionPreview: React.FC<TagSectionPreviewProps> = ({
  section,
  theme,
}) => {
  const visibleItems = section.items.filter((item) => item.isVisible !== false)

  return (
    <div>
      {visibleItems.map((item) => (
        <TagItemPreview key={item.id} item={item as TagEntry} theme={theme} />
      ))}
    </div>
  )
}

export default TagSectionPreview
