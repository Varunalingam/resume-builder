import React, { useEffect, useId, useState } from 'react'

export interface DatePickerModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (dateRange: { startDate: string; endDate: string }) => void
  startDate?: string
  endDate?: string
  itemTitle?: string
}

const MONTHS = [
  { short: 'Jan', full: 'January' },
  { short: 'Feb', full: 'February' },
  { short: 'Mar', full: 'March' },
  { short: 'Apr', full: 'April' },
  { short: 'May', full: 'May' },
  { short: 'Jun', full: 'June' },
  { short: 'Jul', full: 'July' },
  { short: 'Aug', full: 'August' },
  { short: 'Sep', full: 'September' },
  { short: 'Oct', full: 'October' },
  { short: 'Nov', full: 'November' },
  { short: 'Dec', full: 'December' },
]

function normalizeMonth(monthStr: string): string {
  const clean = monthStr.trim().toLowerCase()
  const found = MONTHS.find(
    (m) =>
      m.short.toLowerCase() === clean ||
      m.full.toLowerCase() === clean ||
      m.full.toLowerCase().startsWith(clean),
  )
  return found ? found.short : ''
}

function parseDate(dateStr?: string): {
  month: string
  year: string
  isPresent: boolean
  raw: string
} {
  if (!dateStr || !dateStr.trim()) {
    return { month: '', year: '', isPresent: false, raw: '' }
  }

  const trimmed = dateStr.trim()
  if (
    trimmed.toLowerCase() === 'present' ||
    trimmed.toLowerCase() === 'current'
  ) {
    return { month: '', year: '', isPresent: true, raw: 'Present' }
  }

  // Check format: "Jan 2021", "January 2021", "Jan, 2021"
  const monthYearMatch = trimmed.match(/^([A-Za-z]+)[,\s]+(\d{4})$/)
  if (monthYearMatch) {
    const norm = normalizeMonth(monthYearMatch[1])
    return {
      month: norm,
      year: monthYearMatch[2],
      isPresent: false,
      raw: trimmed,
    }
  }

  // Check format: "2021" (Year only)
  const yearOnlyMatch = trimmed.match(/^(\d{4})$/)
  if (yearOnlyMatch) {
    return { month: '', year: yearOnlyMatch[1], isPresent: false, raw: trimmed }
  }

  // Check format: "05/2021" or "05-2021"
  const numericMatch = trimmed.match(/^(\d{1,2})[/.-](\d{4})$/)
  if (numericMatch) {
    const monthNum = parseInt(numericMatch[1], 10)
    if (monthNum >= 1 && monthNum <= 12) {
      return {
        month: MONTHS[monthNum - 1].short,
        year: numericMatch[2],
        isPresent: false,
        raw: trimmed,
      }
    }
  }

  return { month: '', year: '', isPresent: false, raw: trimmed }
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  startDate = '',
  endDate = '',
  itemTitle,
}) => {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 70 }, (_, i) =>
    String(currentYear + 5 - i),
  )

  const initialStart = parseDate(startDate)
  const initialEnd = parseDate(endDate)

  const hasUnparsedStart =
    startDate.trim() !== '' && !initialStart.year && !initialStart.month
  const hasUnparsedEnd =
    endDate.trim() !== '' &&
    !initialEnd.isPresent &&
    !initialEnd.year &&
    !initialEnd.month

  const [startMonth, setStartMonth] = useState(() => initialStart.month)
  const [startYear, setStartYear] = useState(() => initialStart.year)
  const [endMonth, setEndMonth] = useState(() => initialEnd.month)
  const [endYear, setEndYear] = useState(() => initialEnd.year)
  const [isPresent, setIsPresent] = useState(() => initialEnd.isPresent)
  const [isCustomMode, setIsCustomMode] = useState(
    () => hasUnparsedStart || hasUnparsedEnd,
  )
  const [customStart, setCustomStart] = useState(() => startDate)
  const [customEnd, setCustomEnd] = useState(() => endDate)

  const startMonthId = useId()
  const startYearId = useId()
  const endMonthId = useId()
  const endYearId = useId()
  const presentCheckboxId = useId()
  const customStartId = useId()
  const customEndId = useId()

  useEffect(() => {
    if (!isOpen) return

    const parsedStart = parseDate(startDate)
    const parsedEnd = parseDate(endDate)

    setStartMonth(parsedStart.month)
    setStartYear(parsedStart.year)
    setEndMonth(parsedEnd.month)
    setEndYear(parsedEnd.year)
    setIsPresent(parsedEnd.isPresent)

    setCustomStart(startDate)
    setCustomEnd(endDate)

    const unparsedStart =
      startDate.trim() !== '' && !parsedStart.year && !parsedStart.month
    const unparsedEnd =
      endDate.trim() !== '' &&
      !parsedEnd.isPresent &&
      !parsedEnd.year &&
      !parsedEnd.month

    setIsCustomMode(unparsedStart || unparsedEnd)
  }, [isOpen, startDate, endDate])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const getComputedStartDate = () => {
    if (isCustomMode) return customStart.trim()
    if (startMonth && startYear) return `${startMonth} ${startYear}`
    if (startYear) return startYear
    return startMonth
  }

  const getComputedEndDate = () => {
    if (isPresent) return 'Present'
    if (isCustomMode) return customEnd.trim()
    if (endMonth && endYear) return `${endMonth} ${endYear}`
    if (endYear) return endYear
    return endMonth
  }

  const computedStart = getComputedStartDate()
  const computedEnd = getComputedEndDate()

  const handleApply = () => {
    onSave({
      startDate: computedStart,
      endDate: computedEnd,
    })
    onClose()
  }

  const handleClear = () => {
    setStartMonth('')
    setStartYear('')
    setEndMonth('')
    setEndYear('')
    setIsPresent(false)
    setCustomStart('')
    setCustomEnd('')
  }

  const handlePresentToggle = (checked: boolean) => {
    setIsPresent(checked)
    if (checked) {
      setCustomEnd('Present')
    } else {
      if (customEnd.toLowerCase() === 'present') {
        setCustomEnd('')
      }
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="date-picker-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-2xl transition-all dark:border-gray-800 dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <img
              src="https://img.icons8.com/color/48/calendar.png"
              alt="Calendar"
              className="pointer-events-none h-6 max-h-[24px] min-h-[24px] w-6 max-w-[24px] min-w-[24px] shrink-0 object-contain select-none"
            />
            <div>
              <h3
                id="date-picker-title"
                className="text-lg font-bold text-gray-800 dark:text-gray-100"
              >
                Date Range Picker
              </h3>
              {itemTitle && (
                <p className="line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
                  For:{' '}
                  <span className="font-semibold text-gray-700 dark:text-gray-200">
                    {itemTitle}
                  </span>
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        {/* Live Preview Box */}
        <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50/60 p-3.5 dark:border-blue-900/50 dark:bg-blue-950/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-blue-700 uppercase dark:text-blue-300">
              Formatted Date Preview
            </span>
            {isPresent && (
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Ongoing
              </span>
            )}
          </div>
          <div className="mt-1 text-base font-semibold text-gray-900 dark:text-gray-100">
            {computedStart || computedEnd ? (
              <span>
                {computedStart || '(No start date)'} —{' '}
                {computedEnd || '(No end date)'}
              </span>
            ) : (
              <span className="text-gray-400 italic dark:text-gray-500">
                No dates selected
              </span>
            )}
          </div>
        </div>

        {/* Mode Toggle: Month/Year Dropdowns vs Custom Text */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
            Input Mode
          </span>
          <button
            type="button"
            onClick={() => setIsCustomMode(!isCustomMode)}
            className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            {isCustomMode
              ? 'Use Month / Year Selectors'
              : 'Switch to Free Text Mode'}
          </button>
        </div>

        {/* Form Body */}
        <div className="mt-3 space-y-4">
          {!isCustomMode ? (
            <>
              {/* Start Date Controls */}
              <div className="rounded-lg border border-gray-100 bg-gray-50/60 p-3 dark:border-gray-800 dark:bg-gray-800/40">
                <label className="mb-2 block text-xs font-bold tracking-wider text-gray-600 uppercase dark:text-gray-300">
                  Start Date
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor={startMonthId}
                      className="mb-1 block text-xs text-gray-500 dark:text-gray-400"
                    >
                      Month
                    </label>
                    <select
                      id={startMonthId}
                      value={startMonth}
                      onChange={(e) => setStartMonth(e.target.value)}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                    >
                      <option value="">Month (Optional)</option>
                      {MONTHS.map((m) => (
                        <option key={m.short} value={m.short}>
                          {m.short} ({m.full})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor={startYearId}
                      className="mb-1 block text-xs text-gray-500 dark:text-gray-400"
                    >
                      Year
                    </label>
                    <select
                      id={startYearId}
                      value={startYear}
                      onChange={(e) => setStartYear(e.target.value)}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                    >
                      <option value="">Year</option>
                      {years.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* End Date Controls */}
              <div className="rounded-lg border border-gray-100 bg-gray-50/60 p-3 dark:border-gray-800 dark:bg-gray-800/40">
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-xs font-bold tracking-wider text-gray-600 uppercase dark:text-gray-300">
                    End Date
                  </label>
                  {/* Present Checkbox */}
                  <label
                    htmlFor={presentCheckboxId}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/60"
                  >
                    <input
                      id={presentCheckboxId}
                      type="checkbox"
                      checked={isPresent}
                      onChange={(e) => handlePresentToggle(e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-800"
                    />
                    <span>Present</span>
                  </label>
                </div>

                {isPresent ? (
                  <div className="flex items-center gap-2 rounded-md border border-dashed border-emerald-300 bg-emerald-50/50 px-3 py-2.5 text-xs text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                    <span className="font-semibold">
                      Ongoing role / education:
                    </span>
                    <span>End date is locked to &quot;Present&quot;</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor={endMonthId}
                        className="mb-1 block text-xs text-gray-500 dark:text-gray-400"
                      >
                        Month
                      </label>
                      <select
                        id={endMonthId}
                        value={endMonth}
                        onChange={(e) => setEndMonth(e.target.value)}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                      >
                        <option value="">Month (Optional)</option>
                        {MONTHS.map((m) => (
                          <option key={m.short} value={m.short}>
                            {m.short} ({m.full})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor={endYearId}
                        className="mb-1 block text-xs text-gray-500 dark:text-gray-400"
                      >
                        Year
                      </label>
                      <select
                        id={endYearId}
                        value={endYear}
                        onChange={(e) => setEndYear(e.target.value)}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                      >
                        <option value="">Year</option>
                        {years.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Custom Text Input Mode */
            <div className="space-y-3">
              <div>
                <label
                  htmlFor={customStartId}
                  className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300"
                >
                  Custom Start Date
                </label>
                <input
                  id={customStartId}
                  type="text"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  placeholder="e.g. Fall 2020 or 01/2020"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label
                    htmlFor={customEndId}
                    className="block text-xs font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Custom End Date
                  </label>
                  <label
                    htmlFor={presentCheckboxId}
                    className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400"
                  >
                    <input
                      id={presentCheckboxId}
                      type="checkbox"
                      checked={isPresent}
                      onChange={(e) => handlePresentToggle(e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-800"
                    />
                    <span>Present</span>
                  </label>
                </div>
                <input
                  id={customEndId}
                  type="text"
                  disabled={isPresent}
                  value={isPresent ? 'Present' : customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  placeholder="e.g. Summer 2022 or Present"
                  className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 ${
                    isPresent ? 'cursor-not-allowed opacity-60' : ''
                  }`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-800">
          <button
            type="button"
            onClick={handleClear}
            className="text-xs font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Clear Dates
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-95"
            >
              Apply Dates
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DatePickerModal
