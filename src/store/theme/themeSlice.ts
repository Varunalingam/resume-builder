import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { ThemeConfig } from '../../types/theme.types.ts'
import { presetThemes } from '../../data/preset-themes.ts'
import { set } from '../../lib/utils.ts'

interface ThemeState {
  themes: (ThemeConfig & { id: string; name: string })[]
  activeThemeId: string
  presetThemes: (ThemeConfig & { id: string; name: string })[]
}

const initialState: ThemeState = {
  themes: [...presetThemes],
  activeThemeId: presetThemes[0].id,
  presetThemes: [...presetThemes],
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setActiveTheme(state, action: PayloadAction<string>) {
      state.activeThemeId = action.payload
    },
    updateActiveThemeName(state, action: PayloadAction<string>) {
      const theme = state.themes.find((t) => t.id === state.activeThemeId)
      if (theme) {
        theme.name = action.payload
      }
    },
    updateActiveThemeProperty(
      state,
      action: PayloadAction<{ path: string; value: unknown }>,
    ) {
      const theme = state.themes.find((t) => t.id === state.activeThemeId)
      if (theme) {
        set(theme, action.payload.path, action.payload.value)
      }
    },
    addTheme(
      state,
      action: PayloadAction<ThemeConfig & { id: string; name: string }>,
    ) {
      state.themes.push(action.payload)
      state.activeThemeId = action.payload.id
    },
    deleteTheme(state, action: PayloadAction<string>) {
      if (state.presetThemes.some((theme) => theme.id === action.payload)) {
        return
      }
      state.themes = state.themes.filter((theme) => theme.id !== action.payload)
      if (state.activeThemeId === action.payload) {
        state.activeThemeId = state.themes[0]?.id || ''
      }
    },
    resetActiveTheme(state) {
      const originalPreset = state.presetThemes.find(
        (t) => t.id === state.activeThemeId,
      )
      if (originalPreset) {
        const index = state.themes.findIndex(
          (t) => t.id === state.activeThemeId,
        )
        if (index !== -1) {
          state.themes[index] = { ...originalPreset }
        }
      }
    },
    resetTheme(state) {
      const customThemes = state.themes.filter(
        (theme) => !state.presetThemes.some((preset) => preset.id === theme.id),
      )
      state.themes = [...state.presetThemes, ...customThemes]
      state.activeThemeId = state.presetThemes[0].id
    },
  },
})

export const {
  setActiveTheme,
  updateActiveThemeName,
  updateActiveThemeProperty,
  addTheme,
  deleteTheme,
  resetActiveTheme,
  resetTheme,
} = themeSlice.actions

export default themeSlice.reducer
