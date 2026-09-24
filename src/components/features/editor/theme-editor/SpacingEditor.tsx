import React from 'react'
import { updateActiveThemeProperty } from '../../../../store/theme/themeSlice.ts'
import type { RootState } from '../../../../app/store.ts'
import { useDispatch, useSelector } from 'react-redux'

const SpacingEditor: React.FC = () => {
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

  const handleSpacingChange = (path: string, value: string) => {
    dispatch(updateActiveThemeProperty({ path: `spacing.${path}`, value }))
  }

  const { document: docSpacing, section, item, line } = activeTheme.spacing

  const paddingXNum = parseFloat(docSpacing?.paddingX ?? '') || 0
  const paddingXUnit =
    (docSpacing?.paddingX || '').replace(/[0-9.]/g, '') || 'pt'

  const paddingYNum = parseFloat(docSpacing?.paddingY ?? '') || 0
  const paddingYUnit =
    (docSpacing?.paddingY || '').replace(/[0-9.]/g, '') || 'pt'

  const sectionGapNum = parseFloat(section?.gap ?? '') || 0
  const sectionGapUnit = (section?.gap || '').replace(/[0-9.]/g, '') || 'pt'

  const itemGapNum = parseFloat(item?.gap ?? '') || 0
  const itemGapUnit = (item?.gap || '').replace(/[0-9.]/g, '') || 'pt'

  const lineParagraphNum = parseFloat(line?.paragraph ?? '') || 0
  const lineParagraphUnit =
    (line?.paragraph || '').replace(/[0-9.]/g, '') || 'rem'

  return (
    <div className="space-y-5 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-colors duration-200 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 dark:border-gray-800">
        <img
          src="https://img.icons8.com/color/48/ruler.png"
          alt="Spacing"
          className="pointer-events-none h-5 max-h-[20px] min-h-[20px] w-5 max-w-[20px] min-w-[20px] shrink-0 object-contain select-none"
        />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Spacing
        </h3>
      </div>

      <div className="space-y-4">
        {/* Document Margins */}
        <div>
          <h4 className="mb-2 text-xs font-bold tracking-wider text-gray-500 uppercase dark:text-gray-400">
            Document Margins / Page Padding
          </h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="spacing-padding-x"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Horizontal Padding ({paddingXUnit})
              </label>
              <input
                id="spacing-padding-x"
                type="number"
                value={paddingXNum}
                onChange={(e) => {
                  const val = e.target.value
                  handleSpacingChange(
                    'document.paddingX',
                    val !== '' ? `${val}${paddingXUnit}` : '',
                  )
                }}
                min="0"
                max="200"
                step="1"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />
              <span className="mt-1 block text-xs text-gray-400 dark:text-gray-500">
                Left and right page margin
              </span>
            </div>

            <div>
              <label
                htmlFor="spacing-padding-y"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Vertical Padding ({paddingYUnit})
              </label>
              <input
                id="spacing-padding-y"
                type="number"
                value={paddingYNum}
                onChange={(e) => {
                  const val = e.target.value
                  handleSpacingChange(
                    'document.paddingY',
                    val !== '' ? `${val}${paddingYUnit}` : '',
                  )
                }}
                min="0"
                max="200"
                step="1"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />
              <span className="mt-1 block text-xs text-gray-400 dark:text-gray-500">
                Top and bottom page margin
              </span>
            </div>
          </div>
        </div>

        {/* Content Flow Spacing */}
        <div>
          <h4 className="mb-2 text-xs font-bold tracking-wider text-gray-500 uppercase dark:text-gray-400">
            Content & Section Spacing
          </h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label
                htmlFor="spacing-section-gap"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Section Gap ({sectionGapUnit})
              </label>
              <input
                id="spacing-section-gap"
                type="number"
                value={sectionGapNum}
                onChange={(e) => {
                  const val = e.target.value
                  handleSpacingChange(
                    'section.gap',
                    val !== '' ? `${val}${sectionGapUnit}` : '',
                  )
                }}
                min="0"
                max="100"
                step="1"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />
              <span className="mt-1 block text-xs text-gray-400 dark:text-gray-500">
                Space between resume sections
              </span>
            </div>

            <div>
              <label
                htmlFor="spacing-item-gap"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Item Gap ({itemGapUnit})
              </label>
              <input
                id="spacing-item-gap"
                type="number"
                value={itemGapNum}
                onChange={(e) => {
                  const val = e.target.value
                  handleSpacingChange(
                    'item.gap',
                    val !== '' ? `${val}${itemGapUnit}` : '',
                  )
                }}
                min="0"
                max="100"
                step="1"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />
              <span className="mt-1 block text-xs text-gray-400 dark:text-gray-500">
                Space between entries in a section
              </span>
            </div>

            <div>
              <label
                htmlFor="spacing-paragraph-gap"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Paragraph Spacing ({lineParagraphUnit})
              </label>
              <input
                id="spacing-paragraph-gap"
                type="number"
                value={lineParagraphNum}
                onChange={(e) => {
                  const val = e.target.value
                  handleSpacingChange(
                    'line.paragraph',
                    val !== '' ? `${val}${lineParagraphUnit}` : '',
                  )
                }}
                min="0"
                max="5"
                step="0.05"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />
              <span className="mt-1 block text-xs text-gray-400 dark:text-gray-500">
                Space between description lines
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpacingEditor
