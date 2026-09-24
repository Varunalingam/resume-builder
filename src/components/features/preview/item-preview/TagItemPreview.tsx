import React from 'react'
import type { TagEntry } from '../../../../types/resume.types.ts'
import type { ThemeConfig } from '../../../../types/theme.types.ts'

interface TagItemPreviewProps {
  item: TagEntry
  theme: ThemeConfig
}

const TagItemPreview: React.FC<TagItemPreviewProps> = ({ item, theme }) => {
  const arrangement = theme.layout.items?.tag ?? 'pills'

  const bodyStyle: React.CSSProperties = {
    fontSize: theme.typography.item.body.fontSize,
    fontWeight: theme.typography.item.body.fontWeight,
    lineHeight: theme.typography.item.body.lineHeight,
    color: theme.colors.text,
  }

  const headerStyle: React.CSSProperties = {
    fontSize: theme.typography.item.subheader.fontSize,
    fontWeight: theme.typography.item.header.fontWeight,
    lineHeight: theme.typography.item.header.lineHeight,
    color: theme.colors.primary,
  }

  if (!item.tags || item.tags.length === 0) {
    return null
  }

  if (arrangement === 'comma') {
    return (
      <div
        style={{
          ...bodyStyle,
          marginBottom: theme.spacing.item.gap,
        }}
      >
        {item.header && (
          <span style={{ ...headerStyle, marginRight: '0.4rem' }}>
            {item.header}:
          </span>
        )}
        <span>{item.tags.join(', ')}</span>
      </div>
    )
  }

  if (arrangement === 'bullets') {
    return (
      <div
        style={{
          ...bodyStyle,
          marginBottom: theme.spacing.item.gap,
        }}
      >
        {item.header && (
          <span style={{ ...headerStyle, marginRight: '0.4rem' }}>
            {item.header}:
          </span>
        )}
        <span>{item.tags.join('  •  ')}</span>
      </div>
    )
  }

  if (arrangement === 'grid') {
    return (
      <div style={{ marginBottom: theme.spacing.item.gap }}>
        {item.header && (
          <div style={{ ...headerStyle, marginBottom: '0.35rem' }}>
            {item.header}
          </div>
        )}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-3">
          {item.tags.map((tag) => (
            <div
              key={tag}
              style={bodyStyle}
              className="flex items-center gap-1.5 truncate"
            >
              <span
                style={{ color: theme.colors.accent || theme.colors.primary }}
              >
                •
              </span>
              <span className="truncate">{tag}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Default: 'pills'
  return (
    <div style={{ marginBottom: theme.spacing.item.gap }}>
      {item.header && (
        <div style={{ ...headerStyle, marginBottom: '0.35rem' }}>
          {item.header}
        </div>
      )}
      <div className="flex flex-wrap gap-1.5">
        {item.tags.map((tag) => (
          <span
            key={tag}
            style={{
              ...bodyStyle,
              borderColor: theme.colors.separator,
              backgroundColor: `${theme.colors.accent}15`,
              color: theme.colors.primary,
            }}
            className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

export default TagItemPreview
