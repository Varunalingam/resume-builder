import React from 'react'
import type { StandardEntry } from '../../../../types/resume.types.ts'
import type { ThemeConfig } from '../../../../types/theme.types.ts'
import MarkdownRenderer from '../MarkdownRenderer.tsx'

interface StandardItemPreviewProps {
  item: StandardEntry
  theme: ThemeConfig
}

const StandardItemPreview: React.FC<StandardItemPreviewProps> = ({
  item,
  theme,
}) => {
  const arrangement = theme.layout.items?.standard ?? 'split'
  const dateStr =
    item.dateRange?.startDate || item.dateRange?.endDate
      ? `${item.dateRange?.startDate || ''}${
          item.dateRange?.startDate && item.dateRange?.endDate ? ' – ' : ''
        }${item.dateRange?.endDate || ''}`
      : ''

  const headerStyle: React.CSSProperties = {
    fontSize: theme.typography.item.header.fontSize,
    fontWeight: theme.typography.item.header.fontWeight,
    lineHeight: theme.typography.item.header.lineHeight,
    color: theme.colors.primary,
  }

  const subheaderStyle: React.CSSProperties = {
    fontSize: theme.typography.item.subheader.fontSize,
    fontWeight: theme.typography.item.subheader.fontWeight,
    lineHeight: theme.typography.item.subheader.lineHeight,
    color: theme.colors.secondary,
  }

  const bodyStyle: React.CSSProperties = {
    fontSize: theme.typography.item.body.fontSize,
    fontWeight: theme.typography.item.body.fontWeight,
    lineHeight: theme.typography.item.body.lineHeight,
    color: theme.colors.text,
  }

  if (arrangement === 'stacked') {
    return (
      <div style={{ marginBottom: theme.spacing.item.gap }}>
        {item.header && <div style={headerStyle}>{item.header}</div>}
        {item.subHeader && <div style={subheaderStyle}>{item.subHeader}</div>}
        {(dateStr || item.location) && (
          <div
            style={{
              ...subheaderStyle,
              fontSize: '0.9em',
              marginTop: '0.125rem',
            }}
          >
            {dateStr}
            {dateStr && item.location ? ' • ' : ''}
            {item.location}
          </div>
        )}
        {item.description && (
          <MarkdownRenderer
            content={item.description}
            style={{ ...bodyStyle, marginTop: theme.spacing.line.paragraph }}
          />
        )}
      </div>
    )
  }

  if (arrangement === 'compact') {
    return (
      <div style={{ marginBottom: theme.spacing.item.gap }}>
        <div className="flex flex-wrap items-baseline gap-x-2">
          {item.header && <span style={headerStyle}>{item.header}</span>}
          {item.subHeader && (
            <span style={subheaderStyle}>• {item.subHeader}</span>
          )}
          {(dateStr || item.location) && (
            <span
              style={{
                ...subheaderStyle,
                marginLeft: 'auto',
                fontSize: '0.9em',
              }}
            >
              {dateStr}
              {dateStr && item.location ? ' | ' : ''}
              {item.location}
            </span>
          )}
        </div>
        {item.description && (
          <MarkdownRenderer
            content={item.description}
            style={{ ...bodyStyle, marginTop: theme.spacing.line.paragraph }}
          />
        )}
      </div>
    )
  }

  // Default: 'split' (Classic Left / Right ATS presentation)
  return (
    <div style={{ marginBottom: theme.spacing.item.gap }}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <div className="flex flex-wrap items-baseline gap-x-2">
          {item.header && <span style={headerStyle}>{item.header}</span>}
          {item.subHeader && (
            <span style={subheaderStyle}>— {item.subHeader}</span>
          )}
        </div>
        <div
          style={{
            ...subheaderStyle,
            textAlign: 'right',
            flexShrink: 0,
            fontSize: '0.9em',
          }}
        >
          {dateStr}
          {dateStr && item.location ? ' | ' : ''}
          {item.location}
        </div>
      </div>
      {item.description && (
        <MarkdownRenderer
          content={item.description}
          style={{ ...bodyStyle, marginTop: theme.spacing.line.paragraph }}
        />
      )}
    </div>
  )
}

export default StandardItemPreview
