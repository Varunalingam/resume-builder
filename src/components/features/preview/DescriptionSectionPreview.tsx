import React from 'react'
import type { DescriptionEntry, Section } from '../../../types/resume.types.ts'
import type { ThemeConfig } from '../../../types/theme.types.ts'
import DescriptionItemPreview from './item-preview/DescriptionItemPreview.tsx'

interface DescriptionSectionPreviewProps {
  section: Section
  theme: ThemeConfig
}

const DescriptionSectionPreview: React.FC<DescriptionSectionPreviewProps> = ({
  section,
  theme,
}) => {
  const visibleItems = section.items.filter((item) => item.isVisible !== false)

  return (
    <div>
      {visibleItems.map((item) => (
        <DescriptionItemPreview
          key={item.id}
          item={item as DescriptionEntry}
          theme={theme}
        />
      ))}
    </div>
  )
}

export default DescriptionSectionPreview
