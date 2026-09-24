import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import MarkdownRichEditor from './MarkdownRichEditor.tsx'

describe('<MarkdownRichEditor />', () => {
  it('renders label, mode switch buttons, formatting toolbar, and textarea', () => {
    const html = renderToStaticMarkup(
      <MarkdownRichEditor
        id="test-editor"
        value="Initial **bold** text"
        onChange={() => {}}
        label="Test Description"
      />,
    )
    expect(html).toContain('Test Description')
    expect(html).toContain('Markdown')
    expect(html).toContain('Rich Text')
    expect(html).toContain('aria-label="Format bold"')
    expect(html).toContain('aria-label="Format italic"')
    expect(html).toContain('aria-label="Format underline"')
    expect(html).toContain('aria-label="Format subscript"')
    expect(html).toContain('aria-label="Format superscript"')
    expect(html).toContain('aria-label="Format bullet list"')
    expect(html).toContain('Initial **bold** text')
    expect(html).toContain('Markdown Mode')
  })

  it('renders syntax helper notes in markdown mode', () => {
    const html = renderToStaticMarkup(
      <MarkdownRichEditor
        id="test-editor-2"
        value="Simple text"
        onChange={() => {}}
      />,
    )
    expect(html).toContain('Syntax:')
    expect(html).toContain('**bold**')
    expect(html).toContain('*italic*')
  })
})
