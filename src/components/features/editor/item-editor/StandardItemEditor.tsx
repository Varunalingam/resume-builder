import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import type { StandardEntry } from '../../../../types/resume.types'
import {
  removeSectionItem,
  reorderSectionItems,
  toggleSectionItemVisibility,
  updateSectionItem,
} from '../../../../store/resume/resumeSlice'
import DatePickerModal from '../../../general/DatePickerModal.tsx'
import MarkdownRichEditor from './MarkdownRichEditor.tsx'

interface StandardItemEditorProps {
  item: StandardEntry
  sectionId: string
  index?: number
  totalItems?: number
}

const COMMON_LOCATIONS = [
  'Remote',
  'Hybrid',
  'San Francisco, CA',
  'New York, NY',
  'Seattle, WA',
  'Austin, TX',
  'Boston, MA',
  'Chicago, IL',
  'Los Angeles, CA',
  'San Jose, CA',
  'San Diego, CA',
  'Denver, CO',
  'Atlanta, GA',
  'Washington, DC',
  'Dallas, TX',
  'London, United Kingdom',
  'Toronto, ON, Canada',
  'Vancouver, BC, Canada',
  'Berlin, Germany',
  'Amsterdam, Netherlands',
  'Dublin, Ireland',
  'Paris, France',
  'Zurich, Switzerland',
  'Singapore',
  'Sydney, Australia',
  'Tokyo, Japan',
  'Bangalore, India',
  'Hyderabad, India',
]

const StandardItemEditor = ({
  item,
  sectionId,
  index,
  totalItems,
}: StandardItemEditorProps) => {
  const dispatch = useDispatch()
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)
  const locationWrapperRef = useRef<HTMLDivElement>(null)

  const handleItemChange = (
    field: keyof Omit<StandardEntry, 'id' | 'type' | 'dateRange'>,
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

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    dispatch(
      updateSectionItem({
        sectionId,
        itemId: item.id,
        updates: {
          dateRange: {
            startDate: item.dateRange?.startDate || '',
            endDate: item.dateRange?.endDate || '',
            [field]: value,
          },
        },
      }),
    )
  }

  const handleDateRangeSave = (dateRange: {
    startDate: string
    endDate: string
  }) => {
    dispatch(
      updateSectionItem({
        sectionId,
        itemId: item.id,
        updates: {
          dateRange: {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          },
        },
      }),
    )
  }

  const handleRemoveItem = () => {
    dispatch(removeSectionItem({ sectionId, itemId: item.id }))
  }

  // Close location dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        locationWrapperRef.current &&
        !locationWrapperRef.current.contains(e.target as Node)
      ) {
        setShowLocationSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredLocations = COMMON_LOCATIONS.filter((loc) =>
    loc.toLowerCase().includes((item.location || '').toLowerCase().trim()),
  )

  const titlePreview =
    item.header && item.subHeader
      ? `${item.header} — ${item.subHeader}`
      : item.header ||
        item.subHeader ||
        `Entry ${typeof index === 'number' ? `#${index + 1}` : ''}`

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
      {/* Top Header Preview & Actions */}
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
        {/* Line 1: Header / Title and Sub-header in one line */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor={`header-${item.id}`}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Header / Title{' '}
              <span className="text-gray-400 dark:text-gray-500">
                (e.g. Job Title, Degree)
              </span>
            </label>
            <input
              id={`header-${item.id}`}
              type="text"
              value={item.header}
              onChange={(e) => handleItemChange('header', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              placeholder="e.g. Senior Software Engineer"
            />
          </div>
          <div>
            <label
              htmlFor={`subheader-${item.id}`}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Sub-header{' '}
              <span className="text-gray-400 dark:text-gray-500">
                (e.g. Company, Institution)
              </span>
            </label>
            <input
              id={`subheader-${item.id}`}
              type="text"
              value={item.subHeader}
              onChange={(e) => handleItemChange('subHeader', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              placeholder="e.g. Google, Stanford University"
            />
          </div>
        </div>

        {/* Line 2: Searchable Location in one line */}
        <div ref={locationWrapperRef} className="relative">
          <label
            htmlFor={`location-${item.id}`}
            className="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            <span>Location</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              Search or type city, state, or Remote
            </span>
          </label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <img
                src="https://img.icons8.com/color/48/marker.png"
                alt=""
                className="h-4 w-4 shrink-0 object-contain"
              />
            </div>
            <input
              id={`location-${item.id}`}
              type="text"
              list={`location-datalist-${item.id}`}
              value={item.location || ''}
              onFocus={() => setShowLocationSuggestions(true)}
              onChange={(e) => {
                handleItemChange('location', e.target.value)
                setShowLocationSuggestions(true)
              }}
              className="block w-full rounded-md border border-gray-300 bg-white py-2 pr-9 pl-9 text-sm shadow-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              placeholder="Search or enter location (e.g. San Francisco, CA or Remote)..."
              autoComplete="off"
            />
            {item.location && (
              <button
                type="button"
                onClick={() => {
                  handleItemChange('location', '')
                  setShowLocationSuggestions(false)
                }}
                className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title="Clear location"
              >
                ✕
              </button>
            )}

            {/* Native browser datalist for autocomplete */}
            <datalist id={`location-datalist-${item.id}`}>
              {COMMON_LOCATIONS.map((loc) => (
                <option key={loc} value={loc} />
              ))}
            </datalist>

            {/* Custom interactive suggestion dropdown */}
            {showLocationSuggestions && filteredLocations.length > 0 && (
              <div className="absolute z-30 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <div className="px-3 py-1 text-[11px] font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500">
                  Suggested Locations
                </div>
                {filteredLocations.slice(0, 8).map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault()
                      handleItemChange('location', loc)
                      setShowLocationSuggestions(false)
                    }}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                  >
                    <span className="text-gray-400 dark:text-gray-500">📍</span>
                    <span>{loc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Line 3: Dates in one line with Choose Dates button */}
        <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-2 md:grid-cols-[1fr_1fr_auto]">
          <div>
            <label
              htmlFor={`startDate-${item.id}`}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Start Date
            </label>
            <input
              id={`startDate-${item.id}`}
              type="text"
              value={item.dateRange?.startDate || ''}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              placeholder="e.g. Jan 2021"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor={`endDate-${item.id}`}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                End Date
              </label>
              {item.dateRange?.endDate?.trim().toLowerCase() === 'present' && (
                <span className="rounded-sm border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Present
                </span>
              )}
            </div>
            <input
              id={`endDate-${item.id}`}
              type="text"
              value={item.dateRange?.endDate || ''}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              placeholder="e.g. Present"
            />
          </div>

          <div className="sm:col-span-2 md:col-span-1">
            <button
              type="button"
              onClick={() => setIsDatePickerOpen(true)}
              className="flex h-[38px] w-full items-center justify-center gap-1.5 rounded-md border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs font-semibold text-blue-700 shadow-2xs transition-all hover:bg-blue-100 active:scale-95 dark:border-blue-900/60 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-blue-900/60"
              title="Choose Dates"
            >
              <img
                src="https://img.icons8.com/color/48/calendar.png"
                alt=""
                className="pointer-events-none h-4 max-h-[16px] min-h-[16px] w-4 max-w-[16px] min-w-[16px] shrink-0 object-contain select-none"
              />
              <span>Choose Dates</span>
            </button>
          </div>
        </div>

        {/* Line 4: Description & Achievements (Markdown & Rich Text Editable) */}
        <div>
          <MarkdownRichEditor
            id={`description-${item.id}`}
            value={item.description}
            onChange={(val) => handleItemChange('description', val)}
            label="Description & Achievements"
            placeholder="Key accomplishments, responsibilities, or notes..."
            rows={4}
          />
        </div>
      </div>

      <DatePickerModal
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onSave={handleDateRangeSave}
        startDate={item.dateRange?.startDate || ''}
        endDate={item.dateRange?.endDate || ''}
        itemTitle={titlePreview}
      />
    </div>
  )
}

export default StandardItemEditor
