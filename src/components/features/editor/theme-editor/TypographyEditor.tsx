import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { TextStyle } from '../../../../types/theme.types.ts'
import { updateActiveThemeProperty } from '../../../../store/theme/themeSlice.ts'
import type { RootState } from '../../../../app/store.ts'

interface FontOption {
  label: string
  value: string
  category: 'Sans-Serif' | 'Serif' | 'Monospace'
}

const FONT_OPTIONS: FontOption[] = [
  // Sans-Serif
  {
    label: 'System UI / Default',
    value:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    category: 'Sans-Serif',
  },
  {
    label: 'Inter',
    value: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    category: 'Sans-Serif',
  },
  {
    label: 'Roboto',
    value: '"Roboto", Arial, sans-serif',
    category: 'Sans-Serif',
  },
  {
    label: 'Open Sans',
    value: '"Open Sans", "Helvetica Neue", sans-serif',
    category: 'Sans-Serif',
  },
  {
    label: 'Lato',
    value: '"Lato", "Helvetica Neue", Arial, sans-serif',
    category: 'Sans-Serif',
  },
  {
    label: 'Montserrat',
    value: '"Montserrat", sans-serif',
    category: 'Sans-Serif',
  },
  {
    label: 'Poppins',
    value: '"Poppins", sans-serif',
    category: 'Sans-Serif',
  },
  {
    label: 'Raleway',
    value: '"Raleway", sans-serif',
    category: 'Sans-Serif',
  },
  {
    label: 'Helvetica Neue / Arial',
    value: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    category: 'Sans-Serif',
  },
  {
    label: 'Segoe UI',
    value: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    category: 'Sans-Serif',
  },
  {
    label: 'Trebuchet MS',
    value: '"Trebuchet MS", "Lucida Sans Unicode", sans-serif',
    category: 'Sans-Serif',
  },

  // Serif
  {
    label: 'Merriweather',
    value: '"Merriweather", Georgia, serif',
    category: 'Serif',
  },
  {
    label: 'Playfair Display',
    value: '"Playfair Display", Georgia, serif',
    category: 'Serif',
  },
  {
    label: 'Lora',
    value: '"Lora", Georgia, serif',
    category: 'Serif',
  },
  {
    label: 'Georgia',
    value: 'Georgia, "Times New Roman", Times, serif',
    category: 'Serif',
  },
  {
    label: 'Garamond',
    value: 'Garamond, "Hoefler Text", "Times New Roman", serif',
    category: 'Serif',
  },
  {
    label: 'Times New Roman',
    value: '"Times New Roman", Times, serif',
    category: 'Serif',
  },
  {
    label: 'Cambria',
    value: 'Cambria, Georgia, serif',
    category: 'Serif',
  },
  {
    label: 'Baskerville',
    value:
      'Baskerville, "Baskerville Old Face", "Hoefler Text", Garamond, serif',
    category: 'Serif',
  },
  {
    label: 'Palatino',
    value: '"Palatino Linotype", "Book Antiqua", Palatino, serif',
    category: 'Serif',
  },
  {
    label: 'Didot',
    value: 'Didot, "Didot LT STD", "Hoefler Text", serif',
    category: 'Serif',
  },

  // Monospace
  {
    label: 'SF Mono / Menlo',
    value: '"SF Mono", Menlo, Monaco, Consolas, "Courier New", monospace',
    category: 'Monospace',
  },
  {
    label: 'Courier New',
    value: '"Courier New", Courier, monospace',
    category: 'Monospace',
  },
  {
    label: 'Consolas',
    value: 'Consolas, Monaco, "Andale Mono", monospace',
    category: 'Monospace',
  },
]

interface FontFamilyControlProps {
  label: string
  type: 'heading' | 'body'
  currentFont: string
  onChange: (type: 'heading' | 'body', value: string) => void
}

const FontFamilyControl: React.FC<FontFamilyControlProps> = ({
  label,
  type,
  currentFont,
  onChange,
}) => {
  const [isCustomMode, setIsCustomMode] = useState(false)

  // Find exact or closest matching preset
  const matchedPreset = FONT_OPTIONS.find(
    (opt) =>
      opt.value.toLowerCase() === currentFont.toLowerCase() ||
      opt.value.split(',')[0].trim().replace(/['"]/g, '').toLowerCase() ===
        currentFont.split(',')[0].trim().replace(/['"]/g, '').toLowerCase(),
  )

  const selectedValue = matchedPreset ? matchedPreset.value : currentFont

  const categories = ['Sans-Serif', 'Serif', 'Monospace'] as const

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setIsCustomMode(!isCustomMode)}
          className="text-[11px] font-medium text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {isCustomMode ? 'Choose from list' : 'Type custom font'}
        </button>
      </div>

      {isCustomMode ? (
        <input
          type="text"
          value={currentFont}
          onChange={(e) => onChange(type, e.target.value)}
          className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          placeholder="e.g. 'Poppins', sans-serif"
        />
      ) : (
        <select
          value={selectedValue}
          onChange={(e) => onChange(type, e.target.value)}
          className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        >
          {!matchedPreset && (
            <option value={currentFont}>{currentFont} (Current)</option>
          )}
          {categories.map((cat) => (
            <optgroup key={cat} label={cat}>
              {FONT_OPTIONS.filter((opt) => opt.category === cat).map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  style={{ fontFamily: opt.value }}
                >
                  {opt.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      )}

      {/* Live Font Preview Badge */}
      <div
        style={{ fontFamily: currentFont }}
        className="truncate rounded border border-gray-100 bg-gray-50 px-2.5 py-1 text-xs text-gray-700 select-none dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-300"
      >
        Preview: The quick brown fox jumps over the lazy dog (Aa Bb Gg 123)
      </div>
    </div>
  )
}

const TextStyleRow: React.FC<{
  label: string
  path: string
  style: TextStyle
}> = ({ label, path, style }) => {
  const dispatch = useDispatch()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleStyleChange = (property: keyof TextStyle, value: any) => {
    dispatch(updateActiveThemeProperty({ path: `${path}.${property}`, value }))
  }

  const fontSizeNum = parseFloat(style.fontSize) || ''
  const fontSizeUnit = (style.fontSize || '').replace(/[0-9.]/g, '') || 'pt'

  return (
    <div className="flex flex-col gap-2 rounded-md border border-gray-200 bg-gray-50/60 p-3 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-gray-800/60">
      <span className="w-36 shrink-0 text-sm font-medium text-gray-700 dark:text-gray-200">
        {label}
      </span>
      <div className="grid flex-1 grid-cols-2 gap-3">
        <div>
          <label className="mb-0.5 block text-xs text-gray-500 dark:text-gray-400">
            Font Size ({fontSizeUnit})
          </label>
          <input
            type="number"
            value={fontSizeNum}
            onChange={(e) => {
              const val = e.target.value
              handleStyleChange(
                'fontSize',
                val !== '' ? `${val}${fontSizeUnit}` : '',
              )
            }}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            min="6"
            max="72"
            step="1"
          />
        </div>
        <div>
          <label className="mb-0.5 block text-xs text-gray-500 dark:text-gray-400">
            Font Weight
          </label>
          <input
            type="number"
            value={style.fontWeight}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10)
              handleStyleChange('fontWeight', isNaN(val) ? 400 : val)
            }}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            min="100"
            max="900"
            step="100"
          />
        </div>
      </div>
    </div>
  )
}

const TypographyEditor: React.FC = () => {
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

  const handleFontFamilyChange = (type: 'heading' | 'body', value: string) => {
    dispatch(
      updateActiveThemeProperty({
        path: `typography.fontFamily.${type}`,
        value,
      }),
    )
  }

  return (
    <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-colors duration-200 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 dark:border-gray-800">
        <img
          src="https://img.icons8.com/color/48/abc.png"
          alt="Typography"
          className="pointer-events-none h-5 max-h-[20px] min-h-[20px] w-5 max-w-[20px] min-w-[20px] shrink-0 object-contain select-none"
        />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Typography
        </h3>
      </div>

      <div className="space-y-4">
        {/* Font Families Section with Dropdowns */}
        <div>
          <h4 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Font Families
          </h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FontFamilyControl
              label="Heading Font"
              type="heading"
              currentFont={activeTheme.typography.fontFamily.heading}
              onChange={handleFontFamilyChange}
            />
            <FontFamilyControl
              label="Body Font"
              type="body"
              currentFont={activeTheme.typography.fontFamily.body}
              onChange={handleFontFamilyChange}
            />
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Header
          </h4>
          <div className="space-y-2">
            <TextStyleRow
              label="Name"
              path="typography.header.name"
              style={activeTheme.typography.header.name}
            />
            <TextStyleRow
              label="Label"
              path="typography.header.label"
              style={activeTheme.typography.header.label}
            />
            <TextStyleRow
              label="Contact Info"
              path="typography.header.contact"
              style={activeTheme.typography.header.contact}
            />
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Section
          </h4>
          <div className="space-y-2">
            <TextStyleRow
              label="Section Title"
              path="typography.section.title"
              style={activeTheme.typography.section.title}
            />
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Items
          </h4>
          <div className="space-y-2">
            <TextStyleRow
              label="Item Header"
              path="typography.item.header"
              style={activeTheme.typography.item.header}
            />
            <TextStyleRow
              label="Item Subheader"
              path="typography.item.subheader"
              style={activeTheme.typography.item.subheader}
            />
            <TextStyleRow
              label="Item Body"
              path="typography.item.body"
              style={activeTheme.typography.item.body}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TypographyEditor
