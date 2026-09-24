import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import themeReducer from '../../store/theme/themeSlice.ts'
import resumeReducer from '../../store/resume/resumeSlice.ts'
import ResumeEditor from './ResumeEditor.tsx'

const createMockStore = () =>
  configureStore({
    reducer: {
      theme: themeReducer,
      resume: resumeReducer,
    },
  })

describe('High-Level UI Component Hosts', () => {
  it('renders ResumeEditor with sidebar and active section editor', () => {
    const store = createMockStore()
    const html = renderToStaticMarkup(
      <Provider store={store}>
        <ResumeEditor />
      </Provider>,
    )
    expect(html).toContain('Resume Sections')
    expect(html).toContain('Personal Information')
    expect(html).toContain('Full Name')
  })
})
