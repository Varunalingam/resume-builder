import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import ResizableSplitter from './ResizeableSplitter.tsx'

describe('<ResizableSplitter />', () => {
  it('renders children with split handle in horizontal mode', () => {
    const html = renderToStaticMarkup(
      <ResizableSplitter direction="horizontal" initialSplit={40}>
        <div id="pane-left">Left Pane</div>
        <div id="pane-right">Right Pane</div>
      </ResizableSplitter>,
    )
    expect(html).toContain('Left Pane')
    expect(html).toContain('Right Pane')
    expect(html).toContain('role="separator"')
  })

  it('renders in vertical mode', () => {
    const html = renderToStaticMarkup(
      <ResizableSplitter direction="vertical" initialSplit={50}>
        <div id="pane-top">Top Pane</div>
        <div id="pane-bottom">Bottom Pane</div>
      </ResizableSplitter>,
    )
    expect(html).toContain('Top Pane')
    expect(html).toContain('Bottom Pane')
    expect(html).toContain('aria-orientation="horizontal"')
  })
})
