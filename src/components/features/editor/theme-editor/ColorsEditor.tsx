import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { ColorsConfig } from '../../../../types/theme.types.ts'
import { updateActiveThemeProperty } from '../../../../store/theme/themeSlice.ts'
import type { RootState } from '../../../../app/store.ts'

const ColorsEditor: React.FC = () => {
  const dispatch = useDispatch()
  const activeTheme = useSelector((state: RootState) =>
    state.theme.themes.find((theme) => theme.id === state.theme.activeThemeId),
  )

  if (!activeTheme) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-gray-500 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
        No active theme selected.
      </div>
    )
  }

  const handleColorChange = (path: keyof ColorsConfig, value: string) => {
    dispatch(updateActiveThemeProperty({ path: `colors.${path}`, value }))
  }

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-colors duration-200 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 dark:border-gray-800">
        <img
          src="https://img.icons8.com/color/48/paint-palette.png"
          alt="Colors"
          className="pointer-events-none h-5 max-h-[20px] min-h-[20px] w-5 max-w-[20px] min-w-[20px] shrink-0 object-contain select-none"
        />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Colors
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2 md:grid-cols-3">
        {Object.entries(activeTheme.colors).map(([key, value]) => (
          <div
            key={key}
            className="flex items-center justify-between gap-3 rounded-md border border-gray-200 bg-gray-50/60 p-3 dark:border-gray-800 dark:bg-gray-800/60"
          >
            <div className="min-w-0">
              <label className="block text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                {key}
              </label>
              <span className="block truncate font-mono text-sm text-gray-700 dark:text-gray-200">
                {value}
              </span>
            </div>
            <input
              type="color"
              value={value}
              onChange={(e) =>
                handleColorChange(key as keyof ColorsConfig, e.target.value)
              }
              className="h-9 w-12 shrink-0 cursor-pointer rounded-md border border-gray-300 bg-white p-0.5 shadow-xs focus:outline-none dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ColorsEditor
