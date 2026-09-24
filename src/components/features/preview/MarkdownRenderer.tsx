import React from 'react'
import { markdownToHtml } from '../../../lib/markdownUtils.ts'

interface MarkdownRendererProps {
  content?: string
  style?: React.CSSProperties
  className?: string
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  style,
  className,
}) => {
  if (!content) return null

  const html = markdownToHtml(content)

  return (
    <div
      className={`markdown-preview ${className || ''}`}
      style={style}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export default MarkdownRenderer
