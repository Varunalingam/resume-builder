import React from 'react'
import type { Section, SocialEntry } from '../../../types/resume.types.ts'
import type { ThemeConfig } from '../../../types/theme.types.ts'
import SocialItemPreview from './item-preview/SocialItemPreview.tsx'

interface SocialSectionPreviewProps {
  section: Section
  theme: ThemeConfig
}

const SocialSectionPreview: React.FC<SocialSectionPreviewProps> = ({
  section,
  theme,
}) => {
  const visibleItems = section.items.filter((item) => item.isVisible !== false)
  const arrangement = theme.layout.items?.social ?? 'inline'

  if (arrangement === 'grid') {
    return (
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {visibleItems.map((item) => (
          <SocialItemPreview
            key={item.id}
            item={item as SocialEntry}
            theme={theme}
          />
        ))}
      </div>
    )
  }

  if (arrangement === 'stacked') {
    return (
      <div className="space-y-1">
        {visibleItems.map((item) => (
          <SocialItemPreview
            key={item.id}
            item={item as SocialEntry}
            theme={theme}
          />
        ))}
      </div>
    )
  }

  // Default: 'inline'
  return (
    <div className="flex flex-wrap items-center">
      {visibleItems.map((item) => (
        <SocialItemPreview
          key={item.id}
          item={item as SocialEntry}
          theme={theme}
        />
      ))}
    </div>
  )
}

export default SocialSectionPreview
