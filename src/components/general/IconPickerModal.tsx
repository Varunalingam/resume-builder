import React, { useEffect, useId, useState } from 'react'
import { POPULAR_ICONS8_ICONS } from '../../lib/iconUtils.ts'

interface IconItem {
  name: string
  commonName: string
}

interface Icons8RawItem {
  name?: string
  commonName?: string
}

interface IconPickerModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectIcon: (iconName: string) => void
  currentIcon?: string
  sectionTitle?: string
  title?: string
  subtitle?: string
}

const IconPickerModal: React.FC<IconPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectIcon,
  currentIcon,
  sectionTitle,
  title,
  subtitle,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<IconItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchInputId = useId()

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('')
      setSearchResults([])
      setError(null)
      return
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const trimmed = searchTerm.trim()
    if (!trimmed) {
      setSearchResults([])
      setIsLoading(false)
      setError(null)
      return
    }

    const timer = setTimeout(async () => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetch(
          `https://search.icons8.com/api/iconsets/v5/search?term=${encodeURIComponent(
            trimmed,
          )}&amount=36&platform=color`,
        )
        if (!res.ok) {
          throw new Error('Failed to fetch icons from Icons8')
        }
        const data = await res.json()
        if (data && Array.isArray(data.icons)) {
          const mapped: IconItem[] = data.icons.map((item: Icons8RawItem) => ({
            name: item.name || item.commonName || 'Icon',
            commonName:
              item.commonName ||
              item.name?.toLowerCase().replace(/\s+/g, '-') ||
              'icon',
          }))
          setSearchResults(mapped)
        } else {
          setSearchResults([])
        }
      } catch {
        // Fallback to searching local popular icons
        const localMatches = POPULAR_ICONS8_ICONS.filter(
          (item) =>
            item.name.toLowerCase().includes(trimmed.toLowerCase()) ||
            item.commonName.toLowerCase().includes(trimmed.toLowerCase()),
        )
        setSearchResults(localMatches)
        setError('Using offline icon suggestions')
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm, isOpen])

  if (!isOpen) return null

  const displayIcons: IconItem[] =
    searchTerm.trim().length > 0 ? searchResults : POPULAR_ICONS8_ICONS

  const modalTitle =
    title || (sectionTitle ? 'Choose Section Icon' : 'Choose Icon')

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-2xl transition-all dark:border-gray-800 dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-800">
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
              {modalTitle}
            </h3>
            {sectionTitle ? (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                For section:{' '}
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                  {sectionTitle}
                </span>
              </p>
            ) : subtitle ? (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            &#x2715;
          </button>
        </div>

        <div className="mt-4">
          <label
            htmlFor={searchInputId}
            className="mb-1 block text-xs font-semibold text-gray-600 dark:text-gray-300"
          >
            Search Icons8
          </label>
          <div className="relative">
            <input
              id={searchInputId}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Icons8 (e.g. linkedin, github, twitter, web, code)..."
              className="w-full rounded-lg border border-gray-300 py-2 pr-10 pl-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              autoFocus
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute top-2.5 right-3 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                Clear
              </button>
            )}
          </div>
          {error && <p className="mt-1 text-xs text-amber-600">{error}</p>}
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {searchTerm.trim()
                ? `Search results (${displayIcons.length})`
                : 'Recommended Icons'}
            </span>
            <button
              type="button"
              onClick={() => {
                onSelectIcon('')
                onClose()
              }}
              className="text-xs text-blue-600 hover:underline dark:text-blue-400"
            >
              Clear / Reset Icon
            </button>
          </div>

          <div className="max-h-64 min-h-[160px] overflow-y-auto rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950">
            {isLoading ? (
              <div className="flex h-36 items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                Searching Icons8...
              </div>
            ) : displayIcons.length === 0 ? (
              <div className="flex h-36 flex-col items-center justify-center text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No icons found for &quot;{searchTerm}&quot;
                </p>
                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                  Try searching for keywords like linkedin, github, globe, or
                  email
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                {displayIcons.map((icon) => {
                  const isSelected = currentIcon === icon.commonName
                  return (
                    <button
                      key={icon.commonName}
                      type="button"
                      title={icon.name}
                      onClick={() => {
                        onSelectIcon(icon.commonName)
                        onClose()
                      }}
                      className={`flex flex-col items-center justify-center rounded-lg p-2.5 text-center transition-all ${
                        isSelected
                          ? 'border-2 border-blue-500 bg-blue-50 shadow-xs dark:border-blue-500 dark:bg-blue-950/80'
                          : 'border border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-xs dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-400 dark:hover:bg-blue-950/60'
                      }`}
                    >
                      <img
                        src={`https://img.icons8.com/color/48/${icon.commonName}.png`}
                        alt={icon.name}
                        className="pointer-events-none h-7 max-h-[28px] min-h-[28px] w-7 max-w-[28px] min-w-[28px] shrink-0 object-contain select-none"
                        onError={(e) => {
                          ;(e.target as HTMLElement).style.display = 'none'
                        }}
                      />
                      <span
                        className={`mt-1.5 line-clamp-1 w-full text-[10px] ${
                          isSelected
                            ? 'font-semibold text-blue-700 dark:text-blue-300'
                            : 'text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        {icon.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-800">
          <a
            href="https://icons8.com/icons/color"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400"
          >
            Powered by Icons8 Color Icons
          </a>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-1.5 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default IconPickerModal
