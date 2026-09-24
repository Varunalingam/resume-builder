import { describe, expect, it } from 'vitest'
import { defaultTheme } from './default-theme'
import type { ThemeConfig } from '../types/theme.types'

describe('defaultTheme', () => {
  it('should conform to the ThemeConfig interface', () => {
    const theme: ThemeConfig = defaultTheme
    expect(theme).toBeDefined()
  })

  it('should have the correct typography settings', () => {
    expect(defaultTheme.typography.fontFamily.heading).toBe(
      'Calibri, sans-serif',
    )
    expect(defaultTheme.typography.header.name.fontSize).toBe('28pt')
  })

  it('should have the correct spacing settings', () => {
    expect(defaultTheme.spacing.document.paddingX).toBe('48pt')
    expect(defaultTheme.spacing.section.gap).toBe('16pt')
  })

  it('should have the correct color settings', () => {
    expect(defaultTheme.colors.background).toBe('#FFFFFF')
    expect(defaultTheme.colors.text).toBe('#000000')
  })

  it('should have the correct layout settings', () => {
    expect(defaultTheme.layout.columns.count).toBe(1)
  })

  it('should have the correct separator settings', () => {
    expect(defaultTheme.separators.section.visible).toBe(true)
    expect(defaultTheme.separators.section.style).toBe('solid')
  })
})
