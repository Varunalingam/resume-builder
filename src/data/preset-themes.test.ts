import { describe, expect, it } from 'vitest'
import { presetThemes } from './preset-themes.ts'

describe('presetThemes', () => {
  it('contains at least 4 curated presets', () => {
    expect(presetThemes.length).toBeGreaterThanOrEqual(4)
  })

  it('ensures each preset has a unique id and non-empty name', () => {
    const ids = new Set<string>()
    for (const theme of presetThemes) {
      expect(theme.id).toBeTruthy()
      expect(theme.name).toBeTruthy()
      expect(ids.has(theme.id)).toBe(false)
      ids.add(theme.id)
    }
  })

  it('ensures each preset provides complete typography, spacing, and colors', () => {
    for (const theme of presetThemes) {
      expect(theme.typography.fontFamily.heading).toBeTruthy()
      expect(theme.typography.fontFamily.body).toBeTruthy()
      expect(theme.colors.text).toMatch(/^#[0-9a-fA-F]{6}$/)
      expect(theme.colors.background).toMatch(/^#[0-9a-fA-F]{6}$/)
      expect(theme.spacing.document.paddingX).toBeDefined()
      expect(theme.layout.columns.count).toBeGreaterThanOrEqual(1)
    }
  })
})
