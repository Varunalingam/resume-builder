import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../../app/store.ts'
import {
  addSection,
  setSelectedSectionId,
} from '../../store/resume/resumeSlice.ts'
import { SectionItemTypes } from '../../types/resume.types.ts'
import ResumeSectionSidebar from '../features/editor/ResumeSectionSidebar.tsx'
import PersonalInfoEditor from '../features/editor/section-editor/PersonalInfoEditor.tsx'
import SectionEditor, {
  getDefaultItemType,
} from '../features/editor/SectionEditor.tsx'
import StandardSectionEditor from '../features/editor/section-editor/StandardSectionEditor.tsx'
import TagSectionEditor from '../features/editor/section-editor/TagSectionEditor.tsx'
import DescriptionSectionEditor from '../features/editor/section-editor/DescriptionSectionEditor.tsx'
import SocialSectionEditor from '../features/editor/section-editor/SocialSectionEditor.tsx'
import { useIsMobile } from '../../hooks/useIsMobile.ts'

const ResumeEditor = () => {
  const isMobile = useIsMobile()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false)

  const dispatch = useDispatch()
  const { resume, selectedSectionId } = useSelector(
    (state: RootState) => state.resume,
  )
  const sections = resume.sections
  const selectedSection = sections.find((s) => s.id === selectedSectionId)

  const handleAddNewSection = () => {
    const newId = `sec-${Date.now()}`
    dispatch(
      addSection({
        id: newId,
        title: 'New Section',
        type: 'text',
        itemType: SectionItemTypes.STANDARD,
      }),
    )
  }

  const handleSelectSection = (id: string) => {
    dispatch(setSelectedSectionId(id))
  }

  const renderSectionEditor = () => {
    if (!selectedSection) {
      return (
        <div className="mt-4 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500 dark:border-gray-700 dark:text-gray-400">
          <p className="mb-3 text-sm italic">
            Select a section from the sidebar to begin editing, or create a new
            one.
          </p>
          <button
            type="button"
            onClick={handleAddNewSection}
            className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-600 shadow-2xs transition-colors hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/70 dark:text-blue-400 dark:hover:bg-blue-900/50"
          >
            <img
              src="https://img.icons8.com/color/48/plus--v1.png"
              alt=""
              className="pointer-events-none h-4 max-h-[16px] min-h-[16px] w-4 max-w-[16px] min-w-[16px] shrink-0 object-contain select-none"
            />
            <span>Add New Section</span>
          </button>
        </div>
      )
    }

    if (selectedSection.items.length === 0) {
      return (
        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400">
          No items in this section yet. Choose an item type above and click{' '}
          <strong className="text-gray-700 dark:text-gray-200">
            + Add Item
          </strong>{' '}
          to add your first entry.
        </div>
      )
    }

    const itemType = getDefaultItemType(selectedSection)

    switch (itemType) {
      case SectionItemTypes.STANDARD:
        return <StandardSectionEditor section={selectedSection} />
      case SectionItemTypes.TAG:
        return <TagSectionEditor section={selectedSection} />
      case SectionItemTypes.DESCRIPTION:
        return <DescriptionSectionEditor section={selectedSection} />
      case SectionItemTypes.SOCIAL:
        return <SocialSectionEditor section={selectedSection} />
      default:
        return (
          <p className="mt-4 text-gray-500 italic dark:text-gray-400">
            Editor for this item type is not yet implemented.
          </p>
        )
    }
  }

  return (
    <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-start">
      <ResumeSectionSidebar
        selectedSectionId={selectedSectionId}
        onSelectSection={handleSelectSection}
        isCollapsed={isMobile ? false : isSidebarCollapsed}
        onToggleCollapse={
          isMobile ? undefined : () => setIsSidebarCollapsed((prev) => !prev)
        }
      />
      <div className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-colors duration-200 sm:p-6 dark:border-gray-800 dark:bg-gray-900">
        {selectedSectionId === 'personal-info' ? (
          <PersonalInfoEditor />
        ) : selectedSection ? (
          <>
            <SectionEditor section={selectedSection} />
            {renderSectionEditor()}
          </>
        ) : (
          renderSectionEditor()
        )}
      </div>
    </div>
  )
}

export default ResumeEditor
