import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import resumeReducer, {
  updatePersonalInfo,
} from '../../store/resume/resumeSlice.ts'
import themeReducer, {
  updateActiveThemeProperty,
} from '../../store/theme/themeSlice.ts'
import ResumePreview from './ResumePreview.tsx'

const createMockStore = () =>
  configureStore({
    reducer: {
      resume: resumeReducer,
      theme: themeReducer,
    },
  })

describe('<ResumePreview />', () => {
  it('renders toolbar with page controls, zoom, and print button', () => {
    const store = createMockStore()
    const html = renderToStaticMarkup(
      <Provider store={store}>
        <ResumePreview />
      </Provider>,
    )
    expect(html).toContain('Print')
    expect(html).toContain('A4')
    expect(html).toContain('Letter')
    expect(html).toContain('Fit Page')
    expect(html).toContain('Varunalingam V')
  })

  it('renders the candidate header and isolated preview canvas', () => {
    const store = createMockStore()
    const html = renderToStaticMarkup(
      <Provider store={store}>
        <ResumePreview />
      </Provider>,
    )
    expect(html).toContain('id="resume-preview"')
    expect(html).toContain('varunalingam.v@gmail.com')
  })

  it('renders clickable email, phone, and social links with optional icons', () => {
    const store = createMockStore()
    const html = renderToStaticMarkup(
      <Provider store={store}>
        <ResumePreview />
      </Provider>,
    )
    // mailto and tel links
    expect(html).toContain('href="mailto:varunalingam.v@gmail.com"')
    expect(html).toContain('href="tel:+917358669054"')
    // social links from sample resume
    expect(html).toContain('href="https://www.linkedin.com/in/Varunalingam/"')
    expect(html).toContain('href="https://github.com/Varunalingam"')
    expect(html).toContain('src="https://img.icons8.com/color/48/linkedin.png"')
    expect(html).toContain('src="https://img.icons8.com/color/48/github.png"')
  })

  it('applies reduced top margin in resume preview instead of full raw paddingY', () => {
    const store = createMockStore()
    const html = renderToStaticMarkup(
      <Provider store={store}>
        <ResumePreview />
      </Provider>,
    )
    // padding-top should be reduced to 19px (approx 60% of 24pt/32px) and not 64px / 48pt
    expect(html).toContain('padding-top:19px')
    expect(html).not.toContain('padding-top:48pt')
    expect(html).not.toContain('padding-top:64px')
  })

  it('wraps sections in resume-section-wrapper for margin-aware page breaks', () => {
    const store = createMockStore()
    const html = renderToStaticMarkup(
      <Provider store={store}>
        <ResumePreview />
      </Provider>,
    )
    expect(html).toContain('class="resume-section-wrapper"')
    expect(html).toContain('data-section-id=')
  })

  it('renders new page top margin indicator with printable start boundary', () => {
    const store = createMockStore()
    const html = renderToStaticMarkup(
      <Provider store={store}>
        <ResumePreview />
      </Provider>,
    )
    // When multiple pages exist, the indicator shows the new page top margin and printable start
    expect(html).toContain('Top Margin')
    expect(html).toContain('Printable Start')
    expect(html).toContain('Bottom Margin')
    expect(html).toContain('Printable Limit')
  })

  it('renders the passport photo alongside personal info according to layout', () => {
    const store = createMockStore()
    store.dispatch(
      updatePersonalInfo({
        photoUrl: 'data:image/png;base64,mockpassportphoto',
      }),
    )
    store.dispatch(
      updateActiveThemeProperty({
        path: 'layout.header.alignment',
        value: 'center-right',
      }),
    )
    const html = renderToStaticMarkup(
      <Provider store={store}>
        <ResumePreview />
      </Provider>,
    )
    expect(html).toContain('src="data:image/png;base64,mockpassportphoto"')
    expect(html).toContain('alt="Varunalingam V"')
    expect(html).toContain('justify-center')
  })

  it('renders left-right and right-left personal info header layouts', () => {
    const store = createMockStore()
    store.dispatch(
      updatePersonalInfo({
        photoUrl: 'data:image/png;base64,mockpassportphoto',
      }),
    )
    store.dispatch(
      updateActiveThemeProperty({
        path: 'layout.header.alignment',
        value: 'left-right',
      }),
    )
    const htmlLeftRight = renderToStaticMarkup(
      <Provider store={store}>
        <ResumePreview />
      </Provider>,
    )
    expect(htmlLeftRight).toContain('justify-between')
    expect(htmlLeftRight).toContain('text-left')

    store.dispatch(
      updateActiveThemeProperty({
        path: 'layout.header.alignment',
        value: 'right-left',
      }),
    )
    const htmlRightLeft = renderToStaticMarkup(
      <Provider store={store}>
        <ResumePreview />
      </Provider>,
    )
    expect(htmlRightLeft).toContain('justify-between')
    expect(htmlRightLeft).toContain('text-right')
  })
})
