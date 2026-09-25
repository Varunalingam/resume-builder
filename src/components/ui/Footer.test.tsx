import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import Footer from './Footer.tsx'

describe('<Footer />', () => {
  it('renders developed with love branding', () => {
    const html = renderToStaticMarkup(<Footer />)
    expect(html).toContain('Developed with')
    expect(html).toContain('VSSVe')
    expect(html).toContain('/vssve-logo.svg')
    expect(html).toContain(`src="${import.meta.env.BASE_URL}vssve-logo.svg"`)
  })

  it('renders Google Antigravity and Gemini engine attribution', () => {
    const html = renderToStaticMarkup(<Footer />)
    expect(html).toContain('Google Antigravity')
    expect(html).toContain('Gemini 3.8 Flash')
    expect(html).toContain('Gemini 3.8')
    expect(html).toContain('/antigravity-icon-dark.png')
    expect(html).toContain('/antigravity-icon-white.png')
    expect(html).toContain(
      `src="${import.meta.env.BASE_URL}antigravity-icon-dark.png"`,
    )
    expect(html).toContain(
      `src="${import.meta.env.BASE_URL}antigravity-icon-white.png"`,
    )
  })
})
