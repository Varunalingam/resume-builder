import React, { useRef } from 'react'
import TypographyEditor from '../features/editor/theme-editor/TypographyEditor.tsx'
import ColorsEditor from '../features/editor/theme-editor/ColorsEditor.tsx'
import SpacingEditor from '../features/editor/theme-editor/SpacingEditor.tsx'
import LayoutEditor from '../features/editor/theme-editor/LayoutEditor.tsx'
import SeparatorsEditor from '../features/editor/theme-editor/SeparatorsEditor.tsx'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../../app/store.ts'
import {
  addTheme,
  deleteTheme,
  resetActiveTheme,
  setActiveTheme,
  updateActiveThemeName,
} from '../../store/theme/themeSlice.ts'

const ThemeEditor: React.FC = () => {
  const dispatch = useDispatch()
  const { themes, activeThemeId, presetThemes } = useSelector(
    (state: RootState) => state.theme,
  )

  const nameInputRef = useRef<HTMLInputElement>(null)

  const activeTheme =
    themes.find((t) => t.id === activeThemeId) || presetThemes[0]
  const isPreset = presetThemes.some((theme) => theme.id === activeThemeId)
  const customThemes = themes.filter(
    (t) => !presetThemes.some((p) => p.id === t.id),
  )

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setActiveTheme(e.target.value))
  }

  const handleAddTheme = () => {
    const customCount = customThemes.length + 1
    const newTheme = {
      ...JSON.parse(JSON.stringify(activeTheme)),
      id: `custom-${Date.now()}`,
      name: `Custom Theme ${customCount}`,
    }
    dispatch(addTheme(newTheme))
    setTimeout(() => {
      nameInputRef.current?.focus()
      nameInputRef.current?.select()
    }, 50)
  }

  const handleDeleteTheme = () => {
    if (isPreset) {
      alert('Cannot delete a preset theme.')
      return
    }
    if (window.confirm('Are you sure you want to delete this custom theme?')) {
      dispatch(deleteTheme(activeThemeId))
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-colors duration-200 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-4">
          {/* Header & Primary Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-4 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <img
                src="https://img.icons8.com/color/48/paint-palette.png"
                alt="Theme"
                className="pointer-events-none h-6 max-h-[24px] min-h-[24px] w-6 max-w-[24px] min-w-[24px] shrink-0 object-contain select-none"
              />
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  Theme Settings
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Select from 10 curated base themes or customize styling.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddTheme}
                className="flex items-center gap-1.5 rounded-md bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-blue-700 active:scale-95"
              >
                <span>+</span>
                <span>New Theme</span>
              </button>

              {!isPreset && (
                <button
                  type="button"
                  onClick={handleDeleteTheme}
                  className="rounded-md border border-red-200 bg-red-50 px-3.5 py-2 text-sm font-semibold text-red-600 shadow-xs transition-colors hover:bg-red-100 active:scale-95 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-400 dark:hover:bg-red-900/60"
                >
                  Delete
                </button>
              )}

              <button
                type="button"
                onClick={() => dispatch(resetActiveTheme())}
                title="Reset to default base theme"
                className="dark:hover:bg-gray-750 rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 shadow-xs transition-colors hover:bg-gray-50 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Form Controls: Active Theme Selector & Theme Name Input */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="theme-selector"
                className="mb-1 block text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400"
              >
                Active Theme ({themes.length} Available)
              </label>
              <select
                id="theme-selector"
                value={activeThemeId}
                onChange={handleThemeChange}
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              >
                <optgroup label="Preset Base Themes (10)">
                  {presetThemes.map((theme) => (
                    <option key={theme.id} value={theme.id}>
                      {theme.name}
                    </option>
                  ))}
                </optgroup>
                {customThemes.length > 0 && (
                  <optgroup label="Custom Themes">
                    {customThemes.map((theme) => (
                      <option key={theme.id} value={theme.id}>
                        {theme.name}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label
                  htmlFor="theme-name-input"
                  className="block text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400"
                >
                  Theme Name
                </label>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    isPreset
                      ? 'border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      : 'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}
                >
                  {isPreset ? 'Base Preset' : 'Custom'}
                </span>
              </div>
              <input
                ref={nameInputRef}
                id="theme-name-input"
                type="text"
                value={activeTheme?.name || ''}
                onChange={(e) =>
                  dispatch(updateActiveThemeName(e.target.value))
                }
                placeholder="Theme Name"
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <LayoutEditor />
        <ColorsEditor />
        <TypographyEditor />
        <SpacingEditor />
        <SeparatorsEditor />
      </div>
    </div>
  )
}

export default ThemeEditor
