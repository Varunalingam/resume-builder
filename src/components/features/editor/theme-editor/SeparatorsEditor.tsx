import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../../../../app/store.ts'
import { updateActiveThemeProperty } from '../../../../store/theme/themeSlice.ts'

const SeparatorsEditor: React.FC = () => {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSeparatorChange = (path: string, value: any) => {
    dispatch(updateActiveThemeProperty({ path: `separators.${path}`, value }))
  }

  const thicknessNum = parseFloat(activeTheme.separators.section.thickness) || 0
  const thicknessUnit =
    (activeTheme.separators.section.thickness || '').replace(/[0-9.]/g, '') ||
    'pt'

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-colors duration-200 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 dark:border-gray-800">
        <img
          src="https://img.icons8.com/color/48/line.png"
          alt="Separators"
          className="pointer-events-none h-5 max-h-[20px] min-h-[20px] w-5 max-w-[20px] min-w-[20px] shrink-0 object-contain select-none"
        />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Section Separators
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4 pt-1 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Visible
          </label>
          <div className="mt-2 flex items-center">
            <input
              type="checkbox"
              id="separator-visible"
              checked={activeTheme.separators.section.visible}
              onChange={(e) =>
                handleSeparatorChange('section.visible', e.target.checked)
              }
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
            />
            <label
              htmlFor="separator-visible"
              className="ml-2 text-sm text-gray-600 dark:text-gray-300"
            >
              Show Separator
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Style
          </label>
          <select
            value={activeTheme.separators.section.style}
            onChange={(e) =>
              handleSeparatorChange('section.style', e.target.value)
            }
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Thickness ({thicknessUnit})
          </label>
          <input
            type="number"
            value={thicknessNum}
            onChange={(e) => {
              const val = e.target.value
              handleSeparatorChange(
                'section.thickness',
                val !== '' ? `${val}${thicknessUnit}` : '',
              )
            }}
            min="0"
            max="20"
            step="0.5"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Color
          </label>
          <div className="mt-1 flex items-center gap-3">
            <input
              type="color"
              value={activeTheme.separators.section.color}
              onChange={(e) =>
                handleSeparatorChange('section.color', e.target.value)
              }
              className="h-9 w-12 cursor-pointer rounded-md border border-gray-300 bg-white p-0.5 shadow-xs focus:outline-none dark:border-gray-700 dark:bg-gray-800"
            />
            <span className="font-mono text-sm text-gray-700 dark:text-gray-200">
              {activeTheme.separators.section.color}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SeparatorsEditor
