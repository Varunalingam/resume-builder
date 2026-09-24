import React from 'react'
import type { Section, StandardEntry } from '../../../types/resume.types.ts'
import type { ThemeConfig } from '../../../types/theme.types.ts'
import StandardItemPreview from './item-preview/StandardItemPreview.tsx'

interface StandardSectionPreviewProps {
  section: Section
  theme: ThemeConfig
}

const StandardSectionPreview: React.FC<StandardSectionPreviewProps> = ({
  section,
  theme,
}) => {
  const visibleItems = section.items.filter((item) => item.isVisible !== false)

  return (
    <div>
      {visibleItems.map((item) => (
        <StandardItemPreview
          key={item.id}
          item={item as StandardEntry}
          theme={theme}
        />
      ))}
    </div>
  )
}

export default StandardSectionPreview
