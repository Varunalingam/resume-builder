import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import resumeReducer from '../../store/resume/resumeSlice.ts'
import themeReducer from '../../store/theme/themeSlice.ts'
import Editor from './Editor.tsx'

const createMockStore = () =>
  configureStore({
    reducer: {
      resume: resumeReducer,
      theme: themeReducer,
    },
  })

describe('<Editor />', () => {
  it('renders sticky navigation bar with Edit Resume and Edit Theme tabs', () => {
    const store = createMockStore()
    const html = renderToStaticMarkup(
      <Provider store={store}>
        <Editor />
      </Provider>,
    )
    expect(html).toContain('Edit Resume')
    expect(html).toContain('Edit Theme')
    expect(html).toContain('Switch to Dark Mode')
  })
})
