import React from 'react'
import type { SocialEntry } from '../../../../types/resume.types.ts'
import type { ThemeConfig } from '../../../../types/theme.types.ts'
import { getSocialIconUrl } from '../../../../lib/iconUtils.ts'

interface SocialItemPreviewProps {
  item: SocialEntry
  theme: ThemeConfig
}

const SocialItemPreview: React.FC<SocialItemPreviewProps> = ({
  item,
  theme,
}) => {
  const arrangement = theme.layout.items?.social ?? 'inline'

  const bodyStyle: React.CSSProperties = {
    fontSize: theme.typography.item.body.fontSize,
    fontWeight: theme.typography.item.body.fontWeight,
    lineHeight: theme.typography.item.body.lineHeight,
  }

  const rawUrl = item.url?.trim() || ''
  const href = rawUrl
    ? rawUrl.startsWith('http://') || rawUrl.startsWith('https://')
      ? rawUrl
      : `https://${rawUrl}`
    : ''
  const cleanUrl = rawUrl.replace(/^https?:\/\/(www\.)?/, '')

  const iconUrl = getSocialIconUrl(item.icon)
  const iconElement = iconUrl ? (
    <img
      src={iconUrl}
      alt=""
      aria-hidden="true"
      className="shrink-0 object-contain select-none"
      style={{
        width: '1.15em',
        height: '1.15em',
        verticalAlign: '-0.15em',
        display: 'inline-block',
      }}
      onError={(e) => {
        ;(e.target as HTMLElement).style.display = 'none'
      }}
    />
  ) : null

  const linkContent = (
    <>
      {iconElement}
      {item.platform && (
        <span style={{ fontWeight: 600, color: theme.colors.primary }}>
          {item.platform}:
        </span>
      )}
      <span style={{ color: theme.colors.secondary }}>{cleanUrl}</span>
    </>
  )

  if (arrangement === 'stacked') {
    return (
      <div
        className="flex items-center gap-2"
        style={{ ...bodyStyle, marginBottom: '0.25rem' }}
      >
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: theme.colors.text }}
            className="inline-flex items-center gap-1.5 cursor-pointer hover:underline"
          >
            {linkContent}
          </a>
        ) : (
          <div className="inline-flex items-center gap-1.5">
            {linkContent}
          </div>
        )}
      </div>
    )
  }

  if (arrangement === 'grid') {
    return (
      <div
        className="flex items-center gap-1.5 truncate"
        style={{ ...bodyStyle }}
      >
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: theme.colors.text }}
            className="inline-flex items-center gap-1.5 truncate cursor-pointer hover:underline"
          >
            {iconElement}
            {item.platform && (
              <span
                style={{ fontWeight: 600, color: theme.colors.primary }}
                className="shrink-0"
              >
                {item.platform}:
              </span>
            )}
            <span
              style={{ color: theme.colors.secondary }}
              className="truncate"
            >
              {cleanUrl}
            </span>
          </a>
        ) : (
          <div className="inline-flex items-center gap-1.5 truncate">
            {iconElement}
            {item.platform && (
              <span
                style={{ fontWeight: 600, color: theme.colors.primary }}
                className="shrink-0"
              >
                {item.platform}:
              </span>
            )}
            <span
              style={{ color: theme.colors.secondary }}
              className="truncate"
            >
              {cleanUrl}
            </span>
          </div>
        )}
      </div>
    )
  }

  // Default: 'inline'
  return (
    <span
      className="inline-flex items-center gap-1.5"
      style={{ ...bodyStyle, marginRight: '1rem' }}
    >
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: theme.colors.text }}
          className="inline-flex items-center gap-1.5 cursor-pointer hover:underline"
        >
          {linkContent}
        </a>
      ) : (
        <span className="inline-flex items-center gap-1.5">
          {linkContent}
        </span>
      )}
    </span>
  )
}

export default SocialItemPreview
