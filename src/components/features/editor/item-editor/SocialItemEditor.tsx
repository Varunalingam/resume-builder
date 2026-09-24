import { useState } from 'react'
import { useDispatch } from 'react-redux'
import type { SocialEntry } from '../../../../types/resume.types.ts'
import {
  removeSectionItem,
  reorderSectionItems,
  toggleSectionItemVisibility,
  updateSectionItem,
} from '../../../../store/resume/resumeSlice.ts'
import {
  getSocialDefaultIcon,
  getSocialIconUrl,
} from '../../../../lib/iconUtils.ts'
import IconPickerModal from '../../../general/IconPickerModal.tsx'

interface SocialItemEditorProps {
  item: SocialEntry
  sectionId: string
  index?: number
  totalItems?: number
}

const SocialItemEditor = ({
  item,
  sectionId,
  index,
  totalItems,
}: SocialItemEditorProps) => {
  const dispatch = useDispatch()
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false)

  const handleItemChange = (
    field: keyof Omit<SocialEntry, 'id' | 'type'>,
    value: string,
  ) => {
    dispatch(
      updateSectionItem({
        sectionId,
        itemId: item.id,
        updates: { [field]: value },
      }),
    )
  }

  const handleToggleVisibility = () => {
    dispatch(toggleSectionItemVisibility({ sectionId, itemId: item.id }))
  }

  const handleMoveUp = () => {
    if (typeof index === 'number' && index > 0) {
      dispatch(
        reorderSectionItems({
          sectionId,
          startIndex: index,
          endIndex: index - 1,
        }),
      )
    }
  }

  const handleMoveDown = () => {
    if (
      typeof index === 'number' &&
      typeof totalItems === 'number' &&
      index < totalItems - 1
    ) {
      dispatch(
        reorderSectionItems({
          sectionId,
          startIndex: index,
          endIndex: index + 1,
        }),
      )
    }
  }

  const handleRemoveItem = () => {
    dispatch(removeSectionItem({ sectionId, itemId: item.id }))
  }

  const titlePreview =
    item.platform || `Link ${typeof index === 'number' ? `#${index + 1}` : ''}`

  const isVisible = item.isVisible !== false
  const canMoveUp = typeof index === 'number' && index > 0
  const canMoveDown =
    typeof index === 'number' &&
    typeof totalItems === 'number' &&
    index < totalItems - 1

  const suggestedIcon = getSocialDefaultIcon(item.platform || item.url)
  const currentIconUrl = getSocialIconUrl(item.icon)

  return (
    <div
      className={`mb-4 rounded-lg border bg-white p-5 shadow-xs transition-all hover:shadow-sm dark:bg-gray-900 ${
        !isVisible
          ? 'border-dashed border-amber-300 opacity-80 dark:border-amber-800'
          : 'border-gray-200 dark:border-gray-800'
      }`}
    >
      <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
        <div className="flex min-w-0 items-center gap-2 pr-2">
          {currentIconUrl && (
            <img
              src={currentIconUrl}
              alt=""
              className="h-4 w-4 shrink-0 object-contain"
              onError={(e) => {
                ;(e.target as HTMLElement).style.display = 'none'
              }}
            />
          )}
          <span className="truncate text-xs font-bold tracking-wider text-gray-500 uppercase dark:text-gray-400">
            {titlePreview}
          </span>
          {!isVisible && (
            <span className="inline-flex shrink-0 items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              Hidden
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {/* Arrow Reorder Controls */}
          <div className="flex items-center rounded-md border border-gray-200 bg-gray-50 p-0.5 shadow-2xs dark:border-gray-700 dark:bg-gray-800">
            <button
              type="button"
              onClick={handleMoveUp}
              disabled={!canMoveUp}
              title="Move item up"
              aria-label="Move item up"
              className="inline-flex h-6 w-6 items-center justify-center rounded text-gray-600 transition-colors hover:bg-white hover:text-blue-600 disabled:pointer-events-none disabled:opacity-30 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400"
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div className="h-3.5 w-[1px] bg-gray-200 dark:bg-gray-700" />
            <button
              type="button"
              onClick={handleMoveDown}
              disabled={!canMoveDown}
              title="Move item down"
              aria-label="Move item down"
              className="inline-flex h-6 w-6 items-center justify-center rounded text-gray-600 transition-colors hover:bg-white hover:text-blue-600 disabled:pointer-events-none disabled:opacity-30 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400"
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <button
            type="button"
            onClick={handleToggleVisibility}
            title={isVisible ? 'Hide item from resume' : 'Show item on resume'}
            className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium shadow-2xs transition-colors ${
              isVisible
                ? 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                : 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300 dark:hover:bg-amber-900/60'
            }`}
          >
            <img
              src={
                isVisible
                  ? 'https://img.icons8.com/color/48/invisible.png'
                  : 'https://img.icons8.com/color/48/visible.png'
              }
              alt=""
              className="pointer-events-none h-3.5 w-3.5 object-contain select-none"
            />
            <span>{isVisible ? 'Hide' : 'Show'}</span>
          </button>
          <button
            type="button"
            onClick={handleRemoveItem}
            className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 shadow-2xs transition-colors hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-400 dark:hover:bg-red-900/60"
          >
            <span>&#x2715;</span>
            <span>Remove</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor={`platform-${item.id}`}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Platform / Label
          </label>
          <input
            id={`platform-${item.id}`}
            type="text"
            value={item.platform}
            onChange={(e) => handleItemChange('platform', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            placeholder="e.g. LinkedIn, GitHub, Portfolio"
          />
        </div>

        <div>
          <label
            htmlFor={`url-${item.id}`}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            URL / Link
          </label>
          <input
            id={`url-${item.id}`}
            type="text"
            value={item.url}
            onChange={(e) => handleItemChange('url', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            placeholder="e.g. https://linkedin.com/in/username"
          />
        </div>
      </div>

      {/* Optional Icon Selector */}
      <div className="mt-3.5 rounded-md border border-gray-100 bg-gray-50/70 p-3 dark:border-gray-800 dark:bg-gray-800/40">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-2xs dark:border-gray-700 dark:bg-gray-800">
              {currentIconUrl ? (
                <img
                  src={currentIconUrl}
                  alt={item.platform || 'Social icon'}
                  className="h-6 w-6 object-contain"
                  onError={(e) => {
                    ;(e.target as HTMLElement).style.display = 'none'
                  }}
                />
              ) : (
                <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500">
                  None
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                  Optional Icon:
                </span>
                {item.icon ? (
                  <span className="rounded-sm border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[11px] font-semibold text-blue-700 dark:border-blue-800/60 dark:bg-blue-950/80 dark:text-blue-300">
                    {item.icon}
                  </span>
                ) : (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    No icon selected (text only)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Displays beside the link in resume preview and print
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!item.icon && suggestedIcon && (
              <button
                type="button"
                onClick={() => handleItemChange('icon', suggestedIcon)}
                className="inline-flex items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50/80 px-2.5 py-1 text-xs font-medium text-blue-700 shadow-2xs transition-colors hover:border-blue-300 hover:bg-blue-100 hover:text-blue-800 dark:border-blue-800 dark:bg-blue-950/70 dark:text-blue-300 dark:hover:border-blue-500 dark:hover:bg-blue-900/60 dark:hover:text-blue-200"
              >
                <img
                  src={getSocialIconUrl(suggestedIcon)}
                  alt=""
                  className="h-3.5 w-3.5 object-contain"
                />
                <span>Use suggested ({suggestedIcon})</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsIconPickerOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-2xs transition-colors hover:border-blue-400 hover:bg-blue-50/60 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-blue-500 dark:hover:bg-blue-950/60 dark:hover:text-blue-300"
            >
              <span>{item.icon ? 'Change Icon' : 'Choose Icon'}</span>
            </button>

            {item.icon && (
              <button
                type="button"
                onClick={() => handleItemChange('icon', '')}
                className="inline-flex items-center rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-red-600 shadow-2xs transition-colors hover:bg-red-50 dark:border-gray-700 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-950/40"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      <IconPickerModal
        isOpen={isIconPickerOpen}
        onClose={() => setIsIconPickerOpen(false)}
        onSelectIcon={(iconName) => handleItemChange('icon', iconName)}
        currentIcon={item.icon}
        title="Choose Social Icon"
        subtitle={`Select an icon for ${item.platform || 'this link'}`}
      />
    </div>
  )
}

export default SocialItemEditor
