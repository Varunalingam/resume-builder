import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../../../app/store'
import {
  addSection,
  removeSection,
  reorderSections,
  toggleSectionVisibility,
  updateSectionIcon,
} from '../../../store/resume/resumeSlice'
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { getSectionIconUrl } from '../../../lib/iconUtils'
import IconPickerModal from '../../general/IconPickerModal.tsx'

interface SortableItemProps {
  id: string
  children: React.ReactNode
  onSelect: () => void
}

const SortableItem = ({ id, children, onSelect }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        // Don't trigger select if clicking on action buttons
        if ((e.target as HTMLElement).closest('button')) {
          return
        }
        onSelect()
      }}
    >
      {children}
    </div>
  )
}

interface ResumeSectionSidebarProps {
  selectedSectionId?: string | null
  onSelectSection: (id: string) => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

const ResumeSectionSidebar = ({
  selectedSectionId,
  onSelectSection,
  isCollapsed = false,
  onToggleCollapse,
}: ResumeSectionSidebarProps) => {
  const sections = useSelector(
    (state: RootState) => state.resume.resume.sections,
  )
  const dispatch = useDispatch()
  const [editingIconSectionId, setEditingIconSectionId] = useState<
    string | null
  >(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id)
      const newIndex = sections.findIndex((s) => s.id === over.id)
      dispatch(reorderSections({ startIndex: oldIndex, endIndex: newIndex }))
    }
  }

  const handleAddNewSection = () => {
    const newId = `sec-${Date.now()}`
    dispatch(
      addSection({
        id: newId,
        title: 'New Section',
        type: 'text',
      }),
    )
    onSelectSection(newId)
  }

  const activeEditingSection = sections.find(
    (s) => s.id === editingIconSectionId,
  )

  return (
    <>
      <aside
        className={`shrink-0 overflow-hidden rounded-lg border border-gray-300 bg-gray-200 shadow-sm transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900 ${
          isCollapsed
            ? 'w-16 self-center p-2 md:self-auto'
            : 'w-full p-3 sm:p-4 md:w-72'
        }`}
      >
        <div
          className={`mb-3 flex items-center transition-all duration-300 ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}
        >
          {!isCollapsed && (
            <h4 className="text-base font-bold whitespace-nowrap text-gray-800 dark:text-gray-100">
              Resume Sections
            </h4>
          )}

          <div className="flex shrink-0 items-center gap-1.5">
            {onToggleCollapse && (
              <button
                type="button"
                title={
                  isCollapsed
                    ? 'Expand Resume Sections (Pie Menu)'
                    : 'Collapse Resume Sections (Pie Menu)'
                }
                onClick={onToggleCollapse}
                className={`hidden items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-all hover:scale-105 hover:bg-gray-100 active:scale-95 md:flex dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 ${
                  isCollapsed ? 'p-2' : 'p-1.5'
                }`}
              >
                <img
                  src="https://img.icons8.com/color/48/pie-chart.png"
                  alt="Pie Menu"
                  className={`${
                    isCollapsed
                      ? 'h-6 max-h-[24px] min-h-[24px] w-6 max-w-[24px] min-w-[24px]'
                      : 'h-5 max-h-[20px] min-h-[20px] w-5 max-w-[20px] min-w-[20px]'
                  } pointer-events-none shrink-0 object-contain transition-all duration-300 select-none`}
                />
              </button>
            )}
          </div>
        </div>

        <div
          onClick={() => onSelectSection('personal-info')}
          title={isCollapsed ? 'Personal Information' : undefined}
          className={`flex cursor-pointer items-center rounded border transition-all duration-300 select-none ${
            selectedSectionId === 'personal-info'
              ? isCollapsed
                ? 'border-blue-500 bg-blue-100 shadow-sm ring-2 ring-blue-400 dark:border-blue-400 dark:bg-blue-600 dark:ring-2 dark:ring-blue-400'
                : 'border-blue-400 bg-blue-50 shadow-sm ring-1 ring-blue-400 dark:border-blue-500 dark:bg-blue-600 dark:ring-1 dark:ring-blue-400'
              : isCollapsed
                ? 'border-transparent bg-white hover:border-gray-300 hover:bg-gray-50 dark:border-transparent dark:bg-gray-800 dark:hover:border-gray-700 dark:hover:bg-gray-700'
                : 'border-transparent bg-white hover:bg-gray-50 dark:border-transparent dark:bg-gray-800 dark:hover:bg-gray-700'
          } ${
            isCollapsed
              ? 'mx-auto mb-2 h-11 w-11 justify-center p-1.5'
              : 'mb-3 w-full justify-between p-2.5'
          }`}
        >
          <img
            src="https://img.icons8.com/color/48/user.png"
            alt="Personal Info"
            className={`${
              isCollapsed
                ? 'h-6 max-h-[24px] min-h-[24px] w-6 max-w-[24px] min-w-[24px]'
                : 'h-5 max-h-[20px] min-h-[20px] w-5 max-w-[20px] min-w-[20px]'
            } pointer-events-none shrink-0 object-contain transition-all duration-300 select-none`}
          />
          {!isCollapsed && (
            <span
              className={`ml-2 flex-1 truncate text-sm transition-colors ${
                selectedSectionId === 'personal-info'
                  ? 'font-semibold text-blue-950 dark:text-white'
                  : 'font-medium text-gray-700 dark:text-gray-200'
              }`}
            >
              Personal Information
            </span>
          )}
        </div>

        <hr className="my-2.5 w-full border-gray-300 transition-all duration-300 dark:border-gray-800" />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sections.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-2">
              {sections.map((section) => {
                const isSelected = selectedSectionId === section.id
                const sectionIconUrl = getSectionIconUrl(section)
                return (
                  <SortableItem
                    key={section.id}
                    id={section.id}
                    onSelect={() => onSelectSection(section.id)}
                  >
                    <div
                      title={
                        isCollapsed
                          ? `${section.title}${section.isVisible ? '' : ' (Hidden)'}`
                          : undefined
                      }
                      className={`relative flex cursor-pointer items-center rounded border transition-all duration-300 ${
                        isSelected
                          ? isCollapsed
                            ? 'border-blue-500 bg-blue-100 shadow-sm ring-2 ring-blue-400 dark:border-blue-400 dark:bg-blue-600 dark:ring-2 dark:ring-blue-400'
                            : 'border-blue-400 bg-blue-50 shadow-sm ring-1 ring-blue-400 dark:border-blue-500 dark:bg-blue-600 dark:ring-1 dark:ring-blue-400'
                          : isCollapsed
                            ? 'border-transparent bg-white hover:border-gray-300 hover:bg-gray-50 dark:border-transparent dark:bg-gray-800 dark:hover:border-gray-700 dark:hover:bg-gray-700'
                            : 'border-transparent bg-white hover:bg-gray-50 dark:border-transparent dark:bg-gray-800 dark:hover:bg-gray-700'
                      } ${!section.isVisible ? 'opacity-40' : 'opacity-100'} ${
                        isCollapsed
                          ? 'mx-auto h-11 w-11 justify-center p-1.5'
                          : 'w-full justify-between p-2.5'
                      }`}
                    >
                      {isCollapsed ? (
                        <>
                          <img
                            src={sectionIconUrl}
                            alt={section.title}
                            className="pointer-events-none h-6 max-h-[24px] min-h-[24px] w-6 max-w-[24px] min-w-[24px] shrink-0 object-contain transition-all duration-300 select-none"
                          />
                          {!section.isVisible && (
                            <span className="absolute right-1 bottom-1 h-2 w-2 rounded-full bg-red-400 ring-1 ring-white" />
                          )}
                        </>
                      ) : (
                        <>
                          <div className="flex min-w-0 flex-1 items-center gap-2 pr-2">
                            <button
                              type="button"
                              title="Change section icon (Icons8)"
                              onClick={(e) => {
                                e.stopPropagation()
                                setEditingIconSectionId(section.id)
                              }}
                              className={`group/icon flex shrink-0 items-center justify-center rounded p-1 transition-colors ${
                                isSelected
                                  ? 'hover:bg-blue-100 dark:hover:bg-blue-500'
                                  : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                              }`}
                            >
                              <img
                                src={sectionIconUrl}
                                alt={section.title}
                                className="pointer-events-none h-5 max-h-[20px] min-h-[20px] w-5 max-w-[20px] min-w-[20px] shrink-0 object-contain transition-transform select-none group-hover/icon:scale-110"
                              />
                            </button>
                            <span
                              className={`truncate text-sm transition-colors ${
                                isSelected
                                  ? 'font-semibold text-blue-950 dark:text-white'
                                  : 'font-medium text-gray-700 dark:text-gray-200'
                              }`}
                            >
                              {section.title}
                            </span>
                          </div>

                          <div className="flex shrink-0 items-center gap-1">
                            <button
                              type="button"
                              title={
                                section.isVisible
                                  ? 'Hide Section'
                                  : 'Show Section'
                              }
                              onClick={(e) => {
                                e.stopPropagation()
                                dispatch(toggleSectionVisibility(section.id))
                              }}
                              className={`rounded p-1 transition-colors ${
                                isSelected
                                  ? 'hover:bg-blue-100 dark:hover:bg-blue-500'
                                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}
                            >
                              <img
                                src={
                                  section.isVisible
                                    ? 'https://img.icons8.com/color/48/invisible.png'
                                    : 'https://img.icons8.com/color/48/visible.png'
                                }
                                alt={section.isVisible ? 'Hide' : 'Show'}
                                className="pointer-events-none h-5 max-h-[20px] min-h-[20px] w-5 max-w-[20px] min-w-[20px] shrink-0 object-contain select-none"
                              />
                            </button>
                            <button
                              type="button"
                              title="Delete Section"
                              onClick={(e) => {
                                e.stopPropagation()
                                dispatch(removeSection(section.id))
                              }}
                              className={`rounded p-1 transition-colors ${
                                isSelected
                                  ? 'hover:bg-red-100 dark:hover:bg-red-500/30'
                                  : 'hover:bg-red-50 dark:hover:bg-red-950/40'
                              }`}
                            >
                              <img
                                src="https://img.icons8.com/color/48/trash.png"
                                alt="Delete"
                                className="pointer-events-none h-5 max-h-[20px] min-h-[20px] w-5 max-w-[20px] min-w-[20px] shrink-0 object-contain select-none"
                              />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </SortableItem>
                )
              })}
            </div>
          </SortableContext>
        </DndContext>

        {isCollapsed ? (
          <button
            type="button"
            title="Add New Section"
            onClick={handleAddNewSection}
            className="group mx-auto mt-3 flex h-11 w-11 items-center justify-center rounded-lg border border-dashed border-gray-400 bg-white p-1.5 shadow-2xs transition-all hover:border-blue-500 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <img
              src="https://img.icons8.com/color/48/plus--v1.png"
              alt="Add Section"
              className="pointer-events-none h-6 max-h-[24px] min-h-[24px] w-6 max-w-[24px] min-w-[24px] shrink-0 object-contain transition-transform select-none group-hover:scale-110"
            />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleAddNewSection}
            className="group mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-400 bg-white/70 px-3 py-2.5 text-xs font-semibold text-gray-700 shadow-2xs transition-all hover:border-blue-500 hover:bg-white hover:text-blue-600 dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:bg-gray-800 dark:hover:text-blue-400"
          >
            <img
              src="https://img.icons8.com/color/48/plus--v1.png"
              alt="Add"
              className="pointer-events-none h-4 max-h-[16px] min-h-[16px] w-4 max-w-[16px] min-w-[16px] shrink-0 object-contain transition-transform select-none group-hover:scale-110"
            />
            <span>Add New Section</span>
          </button>
        )}
      </aside>

      <IconPickerModal
        isOpen={editingIconSectionId !== null}
        onClose={() => setEditingIconSectionId(null)}
        currentIcon={activeEditingSection?.icon}
        sectionTitle={activeEditingSection?.title}
        onSelectIcon={(iconName) => {
          if (editingIconSectionId) {
            dispatch(
              updateSectionIcon({
                sectionId: editingIconSectionId,
                icon: iconName,
              }),
            )
          }
        }}
      />
    </>
  )
}

export default ResumeSectionSidebar
