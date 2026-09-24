import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import themeReducer from '../../store/theme/themeSlice.ts'
import resumeReducer from '../../store/resume/resumeSlice.ts'
import ThemeEditor from './ThemeEditor.tsx'

const createMockStore = () =>
  configureStore({
    reducer: {
      theme: themeReducer,
      resume: resumeReducer,
    },
  })

describe('High-Level UI Component Hosts', () => {
  it('renders ThemeEditor with presets selector and action buttons', () => {
    const store = createMockStore()
    const html = renderToStaticMarkup(
      <Provider store={store}>
        <ThemeEditor />
      </Provider>,
    )
    expect(html).toContain('Theme Settings')
    expect(html).toContain('New Theme')
    expect(html).toContain('Reset')
  })
})
