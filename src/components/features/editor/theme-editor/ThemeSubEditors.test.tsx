import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import themeReducer from '../../../../store/theme/themeSlice.ts'
import resumeReducer from '../../../../store/resume/resumeSlice.ts'
import ColorsEditor from './ColorsEditor.tsx'
import SpacingEditor from './SpacingEditor.tsx'
import SeparatorsEditor from './SeparatorsEditor.tsx'
import LayoutEditor from './LayoutEditor.tsx'
import TypographyEditor from './TypographyEditor.tsx'

const createMockStore = () =>
  configureStore({
    reducer: {
      theme: themeReducer,
      resume: resumeReducer,
    },
  })

describe('Theme Sub-Editors', () => {
  it('renders ColorsEditor with palette keys and icons', () => {
    const store = createMockStore()
    const html = renderToStaticMarkup(
      <Provider store={store}>
        <ColorsEditor />
      </Provider>,
    )
    expect(html).toContain('Colors')
    expect(html).toContain('primary')
    expect(html).toContain('background')
    expect(html).toContain('text')
  })

  it('renders SpacingEditor with document, section, and item fields', () => {
    const store = createMockStore()
    const html = renderToStaticMarkup(
      <Provider store={store}>
        <SpacingEditor />
      </Provider>,
    )
    expect(html).toContain('Spacing')
    expect(html).toContain('Document Margins')
    expect(html).toContain('Section Gap')
    expect(html).toContain('Item Gap')
  })

  it('renders SeparatorsEditor with visible toggle and thickness', () => {
    const store = createMockStore()
    const html = renderToStaticMarkup(
      <Provider store={store}>
        <SeparatorsEditor />
      </Provider>,
    )
    expect(html).toContain('Section Separators')
    expect(html).toContain('Visible')
    expect(html).toContain('Style')
    expect(html).toContain('Thickness')
  })

  it('renders LayoutEditor with 6 personal info layout options, column configurations, and item arrangements', () => {
    const store = createMockStore()
    const html = renderToStaticMarkup(
      <Provider store={store}>
        <LayoutEditor />
      </Provider>,
    )
    expect(html).toContain('Layout &amp; Arrangements')
    expect(html).toContain('Personal Info &amp; Header Layout')
    expect(html).toContain('Left')
    expect(html).toContain('Left-Right')
    expect(html).toContain('Center Left')
    expect(html).toContain('Center Right')
    expect(html).toContain('Right-Left')
    expect(html).toContain('Right')
    expect(html).toContain('Columns')
    expect(html).toContain('Standard Items')
    expect(html).toContain('Tags &amp; Skills')
    expect(html).toContain('Description Items')
    expect(html).toContain('Social Links')
  })

  it('renders TypographyEditor with heading and body font selections', () => {
    const store = createMockStore()
    const html = renderToStaticMarkup(
      <Provider store={store}>
        <TypographyEditor />
      </Provider>,
    )
    expect(html).toContain('Typography')
    expect(html).toContain('Heading Font')
    expect(html).toContain('Body Font')
  })
})
