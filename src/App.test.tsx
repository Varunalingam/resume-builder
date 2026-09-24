import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import resumeReducer from './store/resume/resumeSlice.ts'
import themeReducer from './store/theme/themeSlice.ts'
import App from './App.tsx'

const createMockStore = () =>
  configureStore({
    reducer: {
      resume: resumeReducer,
      theme: themeReducer,
    },
  })

describe('<App />', () => {
  it('renders root layout containing editor, preview, and footer', () => {
    const store = createMockStore()
    const html = renderToStaticMarkup(
      <Provider store={store}>
        <App />
      </Provider>,
    )
    expect(html).toContain('Edit Resume')
    expect(html).toContain('Edit Theme')
    expect(html).toContain('Developed with')
    expect(html).toContain('Google Antigravity')
  })
})
