import { describe, expect, it } from 'vitest'
import {
  htmlToMarkdown,
  markdownToHtml,
  parseInlineMarkdown,
  sanitizeHtml,
} from './markdownUtils.ts'

describe('markdownUtils', () => {
  describe('parseInlineMarkdown', () => {
    it('converts bold text', () => {
      expect(parseInlineMarkdown('This is **bold** text')).toContain(
        '<strong>bold</strong>',
      )
      expect(parseInlineMarkdown('This is __bold__ text')).toContain(
        '<strong>bold</strong>',
      )
    })

    it('converts italic text', () => {
      expect(parseInlineMarkdown('This is *italic* text')).toContain(
        '<em>italic</em>',
      )
      expect(parseInlineMarkdown('This is _italic_ text')).toContain(
        '<em>italic</em>',
      )
    })

    it('converts underline text', () => {
      expect(parseInlineMarkdown('This is <u>underlined</u> text')).toContain(
        '<u>underlined</u>',
      )
      expect(
        parseInlineMarkdown('This is <ins>underlined</ins> text'),
      ).toContain('<u>underlined</u>')
    })

    it('converts subscript and superscript', () => {
      expect(parseInlineMarkdown('H<sub>2</sub>O')).toContain('<sub>2</sub>')
      expect(parseInlineMarkdown('H~2~O')).toContain('<sub>2</sub>')
      expect(parseInlineMarkdown('E=mc<sup>2</sup>')).toContain('<sup>2</sup>')
      expect(parseInlineMarkdown('E=mc^2^')).toContain('<sup>2</sup>')
    })

    it('converts links and code', () => {
      expect(parseInlineMarkdown('[Google](https://google.com)')).toContain(
        '<a href="https://google.com"',
      )
      expect(parseInlineMarkdown('use `npm install`')).toContain(
        'npm install</code>',
      )
    })
  })

  describe('markdownToHtml', () => {
    it('returns empty string for empty input', () => {
      expect(markdownToHtml('')).toBe('')
      expect(markdownToHtml('   ')).toBe('')
    })

    it('wraps paragraphs and preserves formatting', () => {
      const html = markdownToHtml('Paragraph 1\n\nParagraph 2 with **bold**')
      expect(html).toContain('Paragraph 1')
      expect(html).toContain('<strong>bold</strong>')
    })

    it('converts bullet lists properly', () => {
      const md = '- Item 1\n- Item 2 with *italics*\n- Item 3'
      const html = markdownToHtml(md)
      expect(html).toContain('<ul class="markdown-list">')
      expect(html).toContain('<li>Item 1</li>')
      expect(html).toContain('<li>Item 2 with <em>italics</em></li>')
      expect(html).toContain('<li>Item 3</li>')
    })

    it('handles unicode bullet points (•)', () => {
      const md = '• Accomplished milestone A\n• Accomplished milestone B'
      const html = markdownToHtml(md)
      expect(html).toContain('<ul class="markdown-list">')
      expect(html).toContain('<li>Accomplished milestone A</li>')
    })
  })

  describe('htmlToMarkdown', () => {
    it('returns empty string for empty input', () => {
      expect(htmlToMarkdown('')).toBe('')
      expect(htmlToMarkdown('   ')).toBe('')
    })

    it('converts bold and italic tags', () => {
      expect(htmlToMarkdown('Hello <strong>world</strong>!')).toBe(
        'Hello **world**!',
      )
      expect(htmlToMarkdown('Hello <b>world</b>!')).toBe('Hello **world**!')
      expect(htmlToMarkdown('Hello <em>world</em>!')).toBe('Hello *world*!')
      expect(htmlToMarkdown('Hello <i>world</i>!')).toBe('Hello *world*!')
    })

    it('converts underline, subscript, and superscript', () => {
      expect(htmlToMarkdown('<u>Important</u> info')).toBe(
        '<u>Important</u> info',
      )
      expect(htmlToMarkdown('H<sub>2</sub>O')).toBe('H<sub>2</sub>O')
      expect(htmlToMarkdown('E=mc<sup>2</sup>')).toBe('E=mc<sup>2</sup>')
    })

    it('converts lists to markdown bullets', () => {
      const html = '<ul><li>First item</li><li>Second item</li></ul>'
      const md = htmlToMarkdown(html)
      expect(md).toContain('- First item')
      expect(md).toContain('- Second item')
    })

    it('converts complex mixed content back to markdown', () => {
      const html =
        '<div>Developed scalable <b>microservices</b>.</div><ul><li>H<sub>2</sub>O</li><li>E=mc<sup>2</sup></li></ul>'
      const md = htmlToMarkdown(html)
      expect(md).toContain('**microservices**')
      expect(md).toContain('<sub>2</sub>')
      expect(md).toContain('<sup>2</sup>')
    })
  })

  describe('sanitizeHtml', () => {
    it('removes script tags and event handlers', () => {
      const dirty =
        '<script>alert("xss")</script><img src="x" onerror="alert(1)" />Safe'
      const cleaned = sanitizeHtml(dirty)
      expect(cleaned).not.toContain('<script>')
      expect(cleaned).not.toContain('onerror=')
      expect(cleaned).toContain('Safe')
    })
  })
})
