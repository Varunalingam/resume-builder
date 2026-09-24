/**
 * Markdown and Rich Text utility functions for ATS resume builder.
 * Provides bidirectional conversion between Markdown and HTML,
 * safe sanitization, and parsing for preview and editor components.
 */

/**
 * Escapes unsafe HTML characters while preserving safe formatting tags.
 */
export function sanitizeHtml(html: string): string {
  // Disallow scripts, event handlers, iframes, and javascript: protocols
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\bon\w+\s*=/gi, 'data-blocked=')
    .replace(/javascript:/gi, 'blocked:')
}

/**
 * Converts inline markdown patterns to HTML.
 */
export function parseInlineMarkdown(text: string): string {
  let result = text

  // 1. Links: [text](url)
  result = result.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="underline text-blue-600 hover:text-blue-800">$1</a>',
  )

  // 2. Inline code: `code`
  result = result.replace(
    /`([^`]+)`/g,
    '<code class="rounded bg-gray-100 dark:bg-gray-800 px-1 py-0.5 text-xs font-mono">$1</code>',
  )

  // 3. Bold: **text** or __text__
  result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  result = result.replace(/__(.+?)__/g, '<strong>$1</strong>')

  // 4. Italics: *text* or _text_ (excluding inside words or already processed bold)
  result = result.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '<em>$1</em>')
  result = result.replace(/(?<!_)_([^_\n]+)_(?!_)/g, '<em>$1</em>')

  // 5. Underline: <u>text</u> or <ins>text</ins>
  result = result.replace(/<ins>([\s\S]*?)<\/ins>/gi, '<u>$1</u>')

  // 6. Subscript: <sub>text</sub> or ~text~
  result = result.replace(/(?<!~)~([^~\n]+)~(?!~)/g, '<sub>$1</sub>')

  // 7. Superscript: <sup>text</sup> or ^text^
  result = result.replace(/\^([^^\n]+)\^/g, '<sup>$1</sup>')

  return result
}

/**
 * Converts Markdown string to clean, safe HTML for preview or rich text editing.
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown || !markdown.trim()) {
    return ''
  }

  // Normalize line endings
  const normalized = markdown.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const lines = normalized.split('\n')

  const htmlParts: string[] = []
  let inList = false
  const listItems: string[] = []

  const flushList = () => {
    if (inList && listItems.length > 0) {
      htmlParts.push(
        `<ul class="markdown-list">${listItems.map((li) => `<li>${li}</li>`).join('')}</ul>`,
      )
      listItems.length = 0
      inList = false
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i]
    const trimmed = rawLine.trim()

    // Bullet line check: "- ", "* ", or "• "
    const bulletMatch = trimmed.match(/^([-*•])\s+(.+)$/)

    if (bulletMatch) {
      inList = true
      listItems.push(parseInlineMarkdown(bulletMatch[2]))
    } else {
      flushList()
      if (trimmed === '') {
        // Empty line separator
        htmlParts.push('<div class="empty-line"><br/></div>')
      } else {
        htmlParts.push(`<div class="markdown-paragraph">${parseInlineMarkdown(rawLine)}</div>`)
      }
    }
  }

  flushList()

  return sanitizeHtml(htmlParts.join(''))
}

/**
 * Converts HTML string (from contentEditable or pasted rich text) back into clean Markdown.
 */
export function htmlToMarkdown(html: string): string {
  if (!html || !html.trim()) {
    return ''
  }

  // Sanitize first
  let clean = sanitizeHtml(html)

  // Normalize Windows linebreaks
  clean = clean.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  // Decode basic entities before processing tags
  clean = clean
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')

  // Handle structural elements
  // 1. Process lists: <li>item</li> -> - item\n
  clean = clean.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_match, p1) => {
    return `- ${p1.trim()}\n`
  })

  // Remove list wrappers
  clean = clean.replace(/<\/?(?:ul|ol)[^>]*>/gi, '\n')

  // 2. Process paragraphs & block divs
  clean = clean.replace(/<br\s*\/?>/gi, '\n')
  clean = clean.replace(/<\/(?:p|div)>/gi, '\n')
  clean = clean.replace(/<(?:p|div)[^>]*>/gi, '')

  // 3. Process links: <a href="url">text</a> -> [text](url)
  clean = clean.replace(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')

  // 4. Repeatedly parse inline formatting from inside out
  let prev = ''
  while (prev !== clean) {
    prev = clean
    // Bold: <strong> or <b>
    clean = clean.replace(/<(?:strong|b)[^>]*>([\s\S]*?)<\/(?:strong|b)>/gi, (_match, p1) => {
      const trimmed = p1.trim()
      return trimmed ? `**${trimmed}**` : ''
    })

    // Italic: <em> or <i>
    clean = clean.replace(/<(?:em|i)[^>]*>([\s\S]*?)<\/(?:em|i)>/gi, (_match, p1) => {
      const trimmed = p1.trim()
      return trimmed ? `*${trimmed}*` : ''
    })

    // Underline: <u> or <ins> -> placeholder
    clean = clean.replace(/<(?:u|ins)[^>]*>([\s\S]*?)<\/(?:u|ins)>/gi, (_match, p1) => {
      const trimmed = p1.trim()
      return trimmed ? `__U_START__${trimmed}__U_END__` : ''
    })

    // Subscript: <sub> -> placeholder
    clean = clean.replace(/<sub[^>]*>([\s\S]*?)<\/sub>/gi, (_match, p1) => {
      const trimmed = p1.trim()
      return trimmed ? `__SUB_START__${trimmed}__SUB_END__` : ''
    })

    // Superscript: <sup> -> placeholder
    clean = clean.replace(/<sup[^>]*>([\s\S]*?)<\/sup>/gi, (_match, p1) => {
      const trimmed = p1.trim()
      return trimmed ? `__SUP_START__${trimmed}__SUP_END__` : ''
    })

    // Code: <code>
    clean = clean.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_match, p1) => {
      const trimmed = p1.trim()
      return trimmed ? `\`${trimmed}\`` : ''
    })
  }

  // Strip any remaining unwanted HTML tags
  clean = clean.replace(/<[^>]+>/g, '')

  // Restore allowed tag placeholders
  clean = clean
    .replace(/__U_START__/g, '<u>')
    .replace(/__U_END__/g, '</u>')
    .replace(/__SUB_START__/g, '<sub>')
    .replace(/__SUB_END__/g, '</sub>')
    .replace(/__SUP_START__/g, '<sup>')
    .replace(/__SUP_END__/g, '</sup>')

  // Decode < and >
  clean = clean.replace(/&lt;/g, '<').replace(/&gt;/g, '>')

  // Clean up excess newlines (3 or more -> 2)
  clean = clean.replace(/\n{3,}/g, '\n\n')

  return clean.trim()
}
