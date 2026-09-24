import { describe, it, expect } from 'vitest'
import { store } from './store'
import {
  toggleSectionItemVisibility,
  updatePersonalInfo,
} from '../store/resume/resumeSlice'
import { addTheme, setActiveTheme } from '../store/theme/themeSlice'
import { sampleResume } from '../data/sample-resume'
import { defaultTheme } from '../data/default-theme'

describe('Redux Store', () => {
  it('should have the correct initial state', () => {
    const state = store.getState()
    // Check the rehydrated state from redux-persist, which might not be the exact initial state
    // if there's persisted data. For a clean test, we'd mock storage, but here we check basics.
    expect(state.resume.resume.personalInfo.name).toBe(
      sampleResume.personalInfo.name,
    )
    expect(state.theme.themes[0].id).toBe('default')
    expect(state.theme.activeThemeId).toBe('default')
  })

  it('should handle resume actions correctly', () => {
    const newName = 'Jane Doe'
    store.dispatch(updatePersonalInfo({ name: newName }))
    const state = store.getState()
    expect(state.resume.resume.personalInfo.name).toBe(newName)
  })

  it('should handle item hideability via toggleSectionItemVisibility', () => {
    const state = store.getState()
    const firstSection = state.resume.resume.sections[0]
    const firstItem = firstSection.items[0]
    expect(firstItem).toBeDefined()

    // Initially undefined or true
    const initiallyVisible = firstItem.isVisible !== false
    expect(initiallyVisible).toBe(true)

    // Hide item
    store.dispatch(
      toggleSectionItemVisibility({
        sectionId: firstSection.id,
        itemId: firstItem.id,
      }),
    )
    let updatedState = store.getState()
    let updatedItem = updatedState.resume.resume.sections[0].items[0]
    expect(updatedItem.isVisible).toBe(false)

    // Unhide / show item again
    store.dispatch(
      toggleSectionItemVisibility({
        sectionId: firstSection.id,
        itemId: firstItem.id,
      }),
    )
    updatedState = store.getState()
    updatedItem = updatedState.resume.resume.sections[0].items[0]
    expect(updatedItem.isVisible).toBe(true)
  })

  it('should handle theme actions correctly', () => {
    // Add a new theme
    const newTheme = { ...defaultTheme, id: 'custom-test', name: 'Custom Test' }
    store.dispatch(addTheme(newTheme))
    let state = store.getState()
    expect(state.theme.themes.find((t) => t.id === 'custom-test')).toBeDefined()

    // Set the new theme as active
    store.dispatch(setActiveTheme('custom-test'))
    state = store.getState()
    expect(state.theme.activeThemeId).toBe('custom-test')
  })
})
