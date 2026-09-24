import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  addSectionItem,
  updateSectionIcon,
  updateSectionItemType,
  updateSectionTitle,
} from '../../../store/resume/resumeSlice.ts'
import {
  type Section,
  type SectionItem,
  type SectionItemType,
  SectionItemTypes,
  SectionTypes,
} from '../../../types/resume.types.ts'
import { getSectionIconUrl } from '../../../lib/iconUtils.ts'
import IconPickerModal from '../../general/IconPickerModal.tsx'

interface SectionEditorProps {
  section: Section
}

const getItemTypeOptions = () => [
  {
    value: SectionItemTypes.STANDARD,
    label: 'Standard (Role, Company, Dates)',
  },
  { value: SectionItemTypes.TAG, label: 'Tags / Skills' },
  { value: SectionItemTypes.DESCRIPTION, label: 'Description / Summary' },
  { value: SectionItemTypes.SOCIAL, label: 'Social / Links' },
]

export const getDefaultItemType = (section: Section): SectionItemType => {
  if (section.items && section.items.length > 0) {
    return section.items[0].type
  }
  if (section.itemType) {
    return section.itemType
  }
  if (section.type === SectionTypes.SKILLS) {
    return SectionItemTypes.TAG
  }
  if (section.type === SectionTypes.TEXT) {
    return SectionItemTypes.DESCRIPTION
  }
  return SectionItemTypes.STANDARD
}

const SectionEditor: React.FC<SectionEditorProps> = ({ section }) => {
  const dispatch = useDispatch()
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false)

  const currentItemType = getDefaultItemType(section)
  const hasItems = section.items.length > 0

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      updateSectionTitle({ sectionId: section.id, title: e.target.value }),
    )
  }

  const handleItemTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (hasItems) return
    const newType = e.target.value as SectionItemType
    dispatch(
      updateSectionItemType({
        sectionId: section.id,
        itemType: newType,
      }),
    )
  }

  const handleAddItem = () => {
    let newItem: SectionItem
    switch (currentItemType) {
      case SectionItemTypes.STANDARD:
        newItem = {
          id: `item-${Date.now()}`,
          type: SectionItemTypes.STANDARD,
          header: '',
          subHeader: '',
          dateRange: { startDate: '', endDate: '' },
          location: '',
          description: '',
        }
        break
      case SectionItemTypes.TAG:
        newItem = {
          id: `item-${Date.now()}`,
          type: SectionItemTypes.TAG,
          header: '',
          tags: [],
        }
        break
      case SectionItemTypes.DESCRIPTION:
        newItem = {
          id: `item-${Date.now()}`,
          type: SectionItemTypes.DESCRIPTION,
          subHeader: '',
          description: '',
        }
        break
      case SectionItemTypes.SOCIAL:
        newItem = {
          id: `item-${Date.now()}`,
          type: SectionItemTypes.SOCIAL,
          platform: '',
          url: '',
        }
        break
      default:
        return
    }
    dispatch(addSectionItem({ sectionId: section.id, item: newItem }))
  }

  const iconUrl = getSectionIconUrl(section)

  return (
    <div className="mb-6 space-y-4 border-b border-gray-200 pb-5 dark:border-gray-800">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsIconPickerOpen(true)}
          title="Change section icon (Icons8)"
          className="group relative flex shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-2 transition-all hover:border-blue-300 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500 dark:hover:bg-blue-950/40"
        >
          <img
            src={iconUrl}
            alt={section.title}
            className="pointer-events-none h-8 max-h-[32px] min-h-[32px] w-8 max-w-[32px] min-w-[32px] shrink-0 object-contain select-none"
          />
          <span className="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow-xs">
            ✎
          </span>
        </button>
        <div className="flex-1">
          <input
            type="text"
            value={section.title}
            onChange={handleTitleChange}
            placeholder="Section Title"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-lg font-semibold text-gray-800 shadow-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full sm:max-w-xs">
          <div className="mb-1 flex items-center justify-between">
            <label
              htmlFor={`item-type-select-${section.id}`}
              className="block text-xs font-semibold tracking-wider text-gray-600 uppercase dark:text-gray-300"
            >
              Section Item Type
            </label>
            {hasItems && (
              <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 text-[11px] font-medium text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                🔒 Locked
              </span>
            )}
          </div>
          <select
            id={`item-type-select-${section.id}`}
            value={currentItemType}
            onChange={handleItemTypeChange}
            disabled={hasItems}
            title={
              hasItems
                ? 'Item type cannot be changed once items are added. Remove all items to change.'
                : 'Choose item type for this section'
            }
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-xs transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:block disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 disabled:dark:border-gray-800 disabled:dark:text-gray-500"
          >
            {getItemTypeOptions().map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {hasItems && (
            <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">
              Remove all items to change this section's item type.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddItem}
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-xs transition-colors hover:bg-blue-700"
        >
          <span>+</span>
          <span>Add Item</span>
        </button>
      </div>

      <IconPickerModal
        isOpen={isIconPickerOpen}
        onClose={() => setIsIconPickerOpen(false)}
        currentIcon={section.icon}
        sectionTitle={section.title}
        onSelectIcon={(iconName) => {
          dispatch(
            updateSectionIcon({
              sectionId: section.id,
              icon: iconName,
            }),
          )
        }}
      />
    </div>
  )
}

export default SectionEditor
