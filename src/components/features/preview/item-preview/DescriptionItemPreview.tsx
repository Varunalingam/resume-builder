import React from 'react'
import type { DescriptionEntry } from '../../../../types/resume.types.ts'
import type { ThemeConfig } from '../../../../types/theme.types.ts'
import MarkdownRenderer from '../MarkdownRenderer.tsx'

interface DescriptionItemPreviewProps {
  item: DescriptionEntry
  theme: ThemeConfig
}

const DescriptionItemPreview: React.FC<DescriptionItemPreviewProps> = ({
  item,
  theme,
}) => {
  const arrangement = theme.layout.items?.description ?? 'standard'

  const subheaderStyle: React.CSSProperties = {
    fontSize: theme.typography.item.subheader.fontSize,
    fontWeight: theme.typography.item.subheader.fontWeight,
    lineHeight: theme.typography.item.subheader.lineHeight,
    color: theme.colors.primary,
  }

  const bodyStyle: React.CSSProperties = {
    fontSize: theme.typography.item.body.fontSize,
    fontWeight: theme.typography.item.body.fontWeight,
    lineHeight: theme.typography.item.body.lineHeight,
    color: theme.colors.text,
  }

  if (arrangement === 'bordered') {
    return (
      <div
        style={{
          marginBottom: theme.spacing.item.gap,
          borderLeftWidth: '3px',
          borderLeftStyle: 'solid',
          borderLeftColor: theme.colors.primary,
          paddingLeft: '0.75rem',
        }}
      >
        {item.subHeader && (
          <div style={subheaderStyle} className="mb-1">
            {item.subHeader}
          </div>
        )}
        <MarkdownRenderer content={item.description} style={bodyStyle} />
      </div>
    )
  }

  if (arrangement === 'compact') {
    return (
      <div
        style={{
          marginBottom: theme.spacing.item.gap,
        }}
      >
        {item.subHeader && (
          <div
            style={{ ...subheaderStyle, fontSize: '0.95em' }}
            className="mb-0.5"
          >
            {item.subHeader}
          </div>
        )}
        <MarkdownRenderer
          content={item.description}
          style={{ ...bodyStyle, fontSize: '0.95em' }}
        />
      </div>
    )
  }

  // Default: 'standard'
  return (
    <div style={{ marginBottom: theme.spacing.item.gap }}>
      {item.subHeader && (
        <div style={subheaderStyle} className="mb-1">
          {item.subHeader}
        </div>
      )}
      <MarkdownRenderer content={item.description} style={bodyStyle} />
    </div>
  )
}

export default DescriptionItemPreview
