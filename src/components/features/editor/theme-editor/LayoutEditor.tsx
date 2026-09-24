import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateActiveThemeProperty } from '../../../../store/theme/themeSlice.ts'
import type { RootState } from '../../../../app/store.ts'
import type { PersonalInfoLayout } from '../../../../types/theme.types.ts'

const PERSONAL_INFO_LAYOUT_OPTIONS: {
  id: PersonalInfoLayout
  label: string
  description: string
  wireframe: React.ReactNode
}[] = [
  {
    id: 'left',
    label: 'Left',
    description: 'Photo on left, info left-aligned',
    wireframe: (
      <div className="flex h-10 w-full items-center justify-start gap-1.5 rounded border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800">
        <div className="h-7 w-5 shrink-0 rounded-xs bg-blue-500/70" />
        <div className="flex flex-col gap-1">
          <div className="h-1.5 w-8 rounded-full bg-gray-400 dark:bg-gray-500" />
          <div className="h-1 w-12 rounded-full bg-gray-300 dark:bg-gray-600" />
        </div>
      </div>
    ),
  },
  {
    id: 'left-right',
    label: 'Left-Right',
    description: 'Info on left, photo on right',
    wireframe: (
      <div className="flex h-10 w-full items-center justify-between gap-1.5 rounded border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-col gap-1">
          <div className="h-1.5 w-8 rounded-full bg-gray-400 dark:bg-gray-500" />
          <div className="h-1 w-12 rounded-full bg-gray-300 dark:bg-gray-600" />
        </div>
        <div className="h-7 w-5 shrink-0 rounded-xs bg-blue-500/70" />
      </div>
    ),
  },
  {
    id: 'center-left',
    label: 'Center Left',
    description: 'Centered block, photo on left',
    wireframe: (
      <div className="flex h-10 w-full items-center justify-center gap-1.5 rounded border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800">
        <div className="h-7 w-5 shrink-0 rounded-xs bg-blue-500/70" />
        <div className="flex flex-col gap-1">
          <div className="h-1.5 w-8 rounded-full bg-gray-400 dark:bg-gray-500" />
          <div className="h-1 w-12 rounded-full bg-gray-300 dark:bg-gray-600" />
        </div>
      </div>
    ),
  },
  {
    id: 'center-right',
    label: 'Center Right',
    description: 'Centered block, photo on right',
    wireframe: (
      <div className="flex h-10 w-full items-center justify-center gap-1.5 rounded border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-col items-end gap-1">
          <div className="h-1.5 w-8 rounded-full bg-gray-400 dark:bg-gray-500" />
          <div className="h-1 w-12 rounded-full bg-gray-300 dark:bg-gray-600" />
        </div>
        <div className="h-7 w-5 shrink-0 rounded-xs bg-blue-500/70" />
      </div>
    ),
  },
  {
    id: 'right-left',
    label: 'Right-Left',
    description: 'Photo on left, info on right',
    wireframe: (
      <div className="flex h-10 w-full items-center justify-between gap-1.5 rounded border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800">
        <div className="h-7 w-5 shrink-0 rounded-xs bg-blue-500/70" />
        <div className="flex flex-col items-end gap-1">
          <div className="h-1.5 w-8 rounded-full bg-gray-400 dark:bg-gray-500" />
          <div className="h-1 w-12 rounded-full bg-gray-300 dark:bg-gray-600" />
        </div>
      </div>
    ),
  },
  {
    id: 'right',
    label: 'Right',
    description: 'Photo on right, info right-aligned',
    wireframe: (
      <div className="flex h-10 w-full items-center justify-end gap-1.5 rounded border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-col items-end gap-1">
          <div className="h-1.5 w-8 rounded-full bg-gray-400 dark:bg-gray-500" />
          <div className="h-1 w-12 rounded-full bg-gray-300 dark:bg-gray-600" />
        </div>
        <div className="h-7 w-5 shrink-0 rounded-xs bg-blue-500/70" />
      </div>
    ),
  },
]

const LayoutEditor: React.FC = () => {
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
  const handleLayoutChange = (path: string, value: any) => {
    dispatch(updateActiveThemeProperty({ path: `layout.${path}`, value }))
  }

  const currentHeaderAlignment: PersonalInfoLayout =
    activeTheme.layout.header.alignment === 'center'
      ? 'center-left'
      : (activeTheme.layout.header.alignment as PersonalInfoLayout) ||
        'center-left'

  const itemLayout = activeTheme.layout.items ?? {
    standard: 'split',
    tag: 'pills',
    description: 'standard',
    social: 'inline',
  }

  const columnGapNum = parseFloat(activeTheme.layout.columns.gap) || 0
  const columnGapUnit =
    (activeTheme.layout.columns.gap || '').replace(/[0-9.]/g, '') || 'pt'

  return (
    <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-colors duration-200 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 dark:border-gray-800">
        <img
          src="https://img.icons8.com/color/48/grid.png"
          alt="Layout"
          className="pointer-events-none h-5 max-h-[20px] min-h-[20px] w-5 max-w-[20px] min-w-[20px] shrink-0 object-contain select-none"
        />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Layout & Arrangements
        </h3>
      </div>

      {/* Personal Info & Header Layout */}
      <div>
        <div className="mb-3">
          <h4 className="text-xs font-bold tracking-wider text-gray-500 uppercase dark:text-gray-400">
            Personal Info & Header Layout
          </h4>
          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
            Choose from 6 layouts for aligning your name, contact details, and
            passport photo
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {PERSONAL_INFO_LAYOUT_OPTIONS.map((opt) => {
            const isSelected = currentHeaderAlignment === opt.id
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleLayoutChange('header.alignment', opt.id)}
                className={`flex flex-col items-center rounded-lg border p-2.5 text-left transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/70 shadow-xs ring-2 ring-blue-500/20 dark:border-blue-400 dark:bg-blue-950/40'
                    : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'
                }`}
              >
                <div className="w-full">{opt.wireframe}</div>
                <div className="mt-2 text-center">
                  <div
                    className={`text-xs font-semibold ${
                      isSelected
                        ? 'text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {opt.label}
                  </div>
                  <div className="mt-0.5 line-clamp-1 text-[10px] text-gray-500 dark:text-gray-400">
                    {opt.description}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Document Level Columns */}
      <div className="border-t border-gray-200 pt-5 dark:border-gray-800">
        <h4 className="mb-3 text-xs font-bold tracking-wider text-gray-500 uppercase dark:text-gray-400">
          Document Columns
        </h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Columns Count
            </label>
            <input
              type="number"
              value={activeTheme.layout.columns.count}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10)
                handleLayoutChange('columns.count', isNaN(val) ? 1 : val)
              }}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              min="1"
              max="2"
              step="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Column Gap ({columnGapUnit})
            </label>
            <input
              type="number"
              value={columnGapNum}
              onChange={(e) => {
                const val = e.target.value
                handleLayoutChange(
                  'columns.gap',
                  val !== '' ? `${val}${columnGapUnit}` : '',
                )
              }}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              min="0"
              max="100"
              step="1"
            />
          </div>
        </div>
      </div>

      {/* Item Previews Arrangement */}
      <div className="border-t border-gray-200 pt-5 dark:border-gray-800">
        <h4 className="mb-3 text-xs font-bold tracking-wider text-gray-500 uppercase dark:text-gray-400">
          Section Item Arrangements
        </h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/60">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Standard Items (Experience, Education)
            </label>
            <p className="mb-2 text-xs text-gray-400 dark:text-gray-500">
              Arrangement of role, company, dates, and location
            </p>
            <select
              value={itemLayout.standard}
              onChange={(e) =>
                handleLayoutChange('items.standard', e.target.value)
              }
              className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="split">
                Split (Role/Company Left, Date/Location Right)
              </option>
              <option value="stacked">Stacked (Vertical Hierarchy)</option>
              <option value="compact">Compact (Inline Headers & Dates)</option>
            </select>
          </div>

          <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/60">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tags & Skills
            </label>
            <p className="mb-2 text-xs text-gray-400 dark:text-gray-500">
              Visual presentation for tag and skill entries
            </p>
            <select
              value={itemLayout.tag}
              onChange={(e) => handleLayoutChange('items.tag', e.target.value)}
              className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="pills">Pills (Framed badges)</option>
              <option value="comma">
                Comma-separated text (React, TypeScript)
              </option>
              <option value="bullets">
                Bullet-separated (React • TypeScript)
              </option>
              <option value="grid">Grid (2-column layout)</option>
            </select>
          </div>

          <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/60">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description Items (Summary)
            </label>
            <p className="mb-2 text-xs text-gray-400 dark:text-gray-500">
              Paragraph and narrative block layout
            </p>
            <select
              value={itemLayout.description}
              onChange={(e) =>
                handleLayoutChange('items.description', e.target.value)
              }
              className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="standard">Standard Paragraph</option>
              <option value="bordered">
                Bordered Accent (Left accent rule)
              </option>
              <option value="compact">Compact Indent</option>
            </select>
          </div>

          <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/60">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Social Links
            </label>
            <p className="mb-2 text-xs text-gray-400 dark:text-gray-500">
              Orientation of web, GitHub, and portfolio links
            </p>
            <select
              value={itemLayout.social}
              onChange={(e) =>
                handleLayoutChange('items.social', e.target.value)
              }
              className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="inline">Inline (Horizontal wrap)</option>
              <option value="grid">Grid (2-column links)</option>
              <option value="stacked">Stacked (Vertical list)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LayoutEditor
