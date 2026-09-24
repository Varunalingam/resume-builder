import { useDispatch } from 'react-redux'
import type { DescriptionEntry } from '../../../../types/resume.types'
import {
  removeSectionItem,
  reorderSectionItems,
  toggleSectionItemVisibility,
  updateSectionItem,
} from '../../../../store/resume/resumeSlice'
import MarkdownRichEditor from './MarkdownRichEditor.tsx'

interface DescriptionItemEditorProps {
  item: DescriptionEntry
  sectionId: string
  index?: number
  totalItems?: number
}

const DescriptionItemEditor = ({
  item,
  sectionId,
  index,
  totalItems,
}: DescriptionItemEditorProps) => {
  const dispatch = useDispatch()

  const handleItemChange = (
    field: keyof Omit<DescriptionEntry, 'id' | 'type'>,
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
    item.subHeader ||
    `Text Block ${typeof index === 'number' ? `#${index + 1}` : ''}`

  const isVisible = item.isVisible !== false
  const canMoveUp = typeof index === 'number' && index > 0
  const canMoveDown =
    typeof index === 'number' &&
    typeof totalItems === 'number' &&
    index < totalItems - 1

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
            <span>✕</span>
            <span>Remove</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor={`subheader-${item.id}`}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Sub-header{' '}
            <span className="font-normal text-gray-400 dark:text-gray-500">
              (Optional title or context)
            </span>
          </label>
          <input
            id={`subheader-${item.id}`}
            type="text"
            value={item.subHeader || ''}
            onChange={(e) => handleItemChange('subHeader', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            placeholder="e.g. Executive Summary, Philosophy, etc."
          />
        </div>

        <div>
          <MarkdownRichEditor
            id={`description-${item.id}`}
            value={item.description}
            onChange={(val) => handleItemChange('description', val)}
            label="Description Body"
            placeholder="Write your summary or narrative text..."
            rows={5}
          />
        </div>
      </div>
    </div>
  )
}

export default DescriptionItemEditor
