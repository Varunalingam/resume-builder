import { describe, expect, it } from 'vitest'
import reducer, {
  addSection,
  addSectionItem,
  removeSectionItem,
  reorderSectionItems,
  reorderSections,
  resetResume,
  setSelectedSectionId,
  toggleSectionItemVisibility,
  toggleSectionVisibility,
  updatePersonalInfo,
  updateResume,
  updateSectionItem,
  updateSectionItemType,
} from './resumeSlice'
import { sampleResume } from '../../data/sample-resume'
import {
  type StandardEntry,
  SectionItemTypes,
} from '../../types/resume.types.ts'

const initialState = {
  resume: sampleResume,
  selectedSectionId: 'personal-info',
}

describe('resumeSlice', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState)
  })

  it('should handle updateResume', () => {
    const newResume = {
      ...sampleResume,
      personalInfo: { ...sampleResume.personalInfo, name: 'Jane Doe' },
    }
    const nextState = reducer(initialState, updateResume(newResume))
    expect(nextState.resume.personalInfo.name).toBe('Jane Doe')
  })

  it('should handle resetResume', () => {
    const modifiedState = {
      resume: {
        ...sampleResume,
        personalInfo: { ...sampleResume.personalInfo, name: 'Jane Doe' },
      },
      selectedSectionId: 'sec-test',
    }
    const nextState = reducer(modifiedState, resetResume())
    expect(nextState.resume).toEqual(sampleResume)
    expect(nextState.selectedSectionId).toBe('personal-info')
  })

  it('should handle setSelectedSectionId', () => {
    const nextState = reducer(initialState, setSelectedSectionId('sec-work'))
    expect(nextState.selectedSectionId).toBe('sec-work')
  })

  it('should handle toggleSectionVisibility', () => {
    const sectionId = initialState.resume.sections[0].id
    const initialVisibility = initialState.resume.sections[0].isVisible
    const nextState = reducer(initialState, toggleSectionVisibility(sectionId))
    expect(nextState.resume.sections[0].isVisible).toBe(!initialVisibility)

    const revertedState = reducer(nextState, toggleSectionVisibility(sectionId))
    expect(revertedState.resume.sections[0].isVisible).toBe(initialVisibility)
  })

  it('should handle toggleSectionItemVisibility', () => {
    const sectionId = initialState.resume.sections[0].id
    const itemId = initialState.resume.sections[0].items[0].id
    const nextState = reducer(
      initialState,
      toggleSectionItemVisibility({ sectionId, itemId }),
    )
    expect(nextState.resume.sections[0].items[0].isVisible).toBe(false)

    const revertedState = reducer(
      nextState,
      toggleSectionItemVisibility({ sectionId, itemId }),
    )
    expect(revertedState.resume.sections[0].items[0].isVisible).toBe(true)
  })

  it('should handle updatePersonalInfo', () => {
    const nextState = reducer(
      initialState,
      updatePersonalInfo({ name: 'John Smith' }),
    )
    expect(nextState.resume.personalInfo.name).toBe('John Smith')
  })

  it('should handle updateSectionItem', () => {
    const sectionId = sampleResume.sections[1].id
    const itemId = sampleResume.sections[1].items[0].id
    const nextState = reducer(
      initialState,
      updateSectionItem({
        sectionId,
        itemId,
        updates: { header: 'New Header' } as Partial<StandardEntry>,
      }),
    )
    const updatedItem = nextState.resume.sections[1].items[0] as StandardEntry
    expect(updatedItem.header).toBe('New Header')
  })

  it('should handle addSectionItem', () => {
    const sectionId = sampleResume.sections[0].id
    const newItem: StandardEntry = {
      id: 'new-item',
      type: SectionItemTypes.STANDARD,
      header: 'New Role',
      subHeader: 'New Company',
      description: 'New content',
    }
    const nextState = reducer(
      initialState,
      addSectionItem({ sectionId, item: newItem }),
    )
    expect(nextState.resume.sections[0].items.length).toBe(
      initialState.resume.sections[0].items.length + 1,
    )
    expect(nextState.resume.sections[0].items.at(-1)?.id).toBe('new-item')
  })

  it('should handle updateSectionItemType when section has no items', () => {
    const stateWithEmptySection = reducer(
      initialState,
      addSection({
        id: 'sec-empty',
        title: 'Empty Section',
        itemType: SectionItemTypes.STANDARD,
      }),
    )

    const nextState = reducer(
      stateWithEmptySection,
      updateSectionItemType({
        sectionId: 'sec-empty',
        itemType: SectionItemTypes.TAG,
      }),
    )
    const targetSection = nextState.resume.sections.find(
      (s) => s.id === 'sec-empty',
    )
    expect(targetSection?.itemType).toBe(SectionItemTypes.TAG)
  })

  it('should not update section itemType if items already exist in the section', () => {
    const sectionWithItems = initialState.resume.sections[0]
    expect(sectionWithItems.items.length).toBeGreaterThan(0)

    const differentType =
      sectionWithItems.itemType === SectionItemTypes.SOCIAL
        ? SectionItemTypes.STANDARD
        : SectionItemTypes.SOCIAL

    const nextState = reducer(
      initialState,
      updateSectionItemType({
        sectionId: sectionWithItems.id,
        itemType: differentType,
      }),
    )
    const targetSection = nextState.resume.sections.find(
      (s) => s.id === sectionWithItems.id,
    )
    expect(targetSection?.itemType).not.toBe(differentType)
  })

  it('should handle removeSectionItem', () => {
    const sectionId = sampleResume.sections[0].id
    const itemId = sampleResume.sections[0].items[0].id
    const nextState = reducer(
      initialState,
      removeSectionItem({ sectionId, itemId }),
    )
    expect(nextState.resume.sections[0].items.length).toBe(
      initialState.resume.sections[0].items.length - 1,
    )
  })

  it('should handle reorderSections', () => {
    const originalSections = initialState.resume.sections
    const nextState = reducer(
      initialState,
      reorderSections({ startIndex: 0, endIndex: 1 }),
    )
    expect(nextState.resume.sections[0].id).toBe(originalSections[1].id)
    expect(nextState.resume.sections[1].id).toBe(originalSections[0].id)
  })

  it('should handle reorderSectionItems', () => {
    const sectionId = initialState.resume.sections[0].id
    const originalItems = initialState.resume.sections[0].items
    const nextState = reducer(
      initialState,
      reorderSectionItems({ sectionId, startIndex: 0, endIndex: 1 }),
    )
    expect(nextState.resume.sections[0].items[0].id).toBe(originalItems[1].id)
    expect(nextState.resume.sections[0].items[1].id).toBe(originalItems[0].id)
  })
})
