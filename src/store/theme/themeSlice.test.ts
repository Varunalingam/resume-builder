import { describe, expect, it } from 'vitest'
import reducer, {
  addTheme,
  deleteTheme,
  resetActiveTheme,
  resetTheme,
  setActiveTheme,
  updateActiveThemeName,
  updateActiveThemeProperty,
} from './themeSlice'
import { presetThemes } from '../../data/preset-themes'
import { defaultTheme } from '../../data/default-theme'

const initialState = {
  themes: [...presetThemes],
  activeThemeId: presetThemes[0].id,
  presetThemes: [...presetThemes],
}

describe('themeSlice', () => {
  it('should return the initial state with 10 preset base themes', () => {
    const state = reducer(undefined, { type: '' })
    expect(state.presetThemes.length).toBe(10)
    expect(state.themes.length).toBe(10)
    expect(state.activeThemeId).toBe(presetThemes[0].id)
  })

  it('should handle setActiveTheme', () => {
    const nextState = reducer(initialState, setActiveTheme('classic-executive'))
    expect(nextState.activeThemeId).toBe('classic-executive')
  })

  it('should handle updateActiveThemeName', () => {
    const nextState = reducer(
      initialState,
      updateActiveThemeName('My Custom Modern Theme'),
    )
    expect(nextState.themes[0].name).toBe('My Custom Modern Theme')
  })

  it('should handle updateActiveThemeProperty', () => {
    const path = 'colors.background'
    const value = '#000000'
    const nextState = reducer(
      initialState,
      updateActiveThemeProperty({ path, value }),
    )
    expect(nextState.themes[0].colors.background).toBe(value)
  })

  it('should handle updating nested layout item arrangements', () => {
    const path = 'layout.items.standard'
    const value = 'stacked'
    const nextState = reducer(
      initialState,
      updateActiveThemeProperty({ path, value }),
    )
    expect(nextState.themes[0].layout.items?.standard).toBe('stacked')
  })

  it('should handle addTheme without popup', () => {
    const newTheme = { ...defaultTheme, id: 'custom', name: 'Custom Theme 1' }
    const nextState = reducer(initialState, addTheme(newTheme))
    expect(nextState.themes.length).toBe(11)
    expect(nextState.themes[10].id).toBe('custom')
    expect(nextState.activeThemeId).toBe('custom')
  })

  it('should handle deleteTheme for a custom theme', () => {
    const customTheme = {
      ...defaultTheme,
      id: 'custom',
      name: 'Custom Theme 1',
    }
    const stateWithCustomTheme = {
      ...initialState,
      themes: [...initialState.themes, customTheme],
      activeThemeId: 'custom',
    }
    const nextState = reducer(stateWithCustomTheme, deleteTheme('custom'))
    expect(nextState.themes.length).toBe(10)
    expect(nextState.activeThemeId).toBe(presetThemes[0].id)
  })

  it('should not delete a preset theme', () => {
    const nextState = reducer(initialState, deleteTheme('default'))
    expect(nextState.themes.length).toBe(10)
    expect(nextState.themes[0].id).toBe('default')
  })

  it('should handle resetActiveTheme and default to the base theme', () => {
    const modifiedState = {
      ...initialState,
      themes: [
        {
          ...initialState.themes[0],
          colors: { ...initialState.themes[0].colors, background: '#111111' },
        },
        ...initialState.themes.slice(1),
      ],
      activeThemeId: 'default',
    }
    const nextState = reducer(modifiedState, resetActiveTheme())
    expect(nextState.activeThemeId).toBe(presetThemes[0].id)
    expect(nextState.themes[0].colors.background).toBe(
      presetThemes[0].colors.background,
    )
  })

  it('should handle resetTheme', () => {
    const customTheme = { ...defaultTheme, id: 'custom', name: 'Custom' }
    const modifiedState = {
      ...initialState,
      themes: [...initialState.themes, customTheme],
      activeThemeId: 'custom',
    }
    const nextState = reducer(modifiedState, resetTheme())
    expect(nextState.themes.length).toBe(11) // Custom theme is preserved
    expect(nextState.activeThemeId).toBe(presetThemes[0].id)
  })
})
