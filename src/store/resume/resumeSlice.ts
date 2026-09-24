import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { sampleResume } from '../../data/sample-resume'
import {
  type PersonalInfo,
  type Resume,
  type Section,
  type SectionItem,
  type SectionItemType,
  type SectionType,
  SectionItemTypes,
  SectionTypes,
} from '../../types/resume.types.ts'

interface ResumeState {
  resume: Resume
  selectedSectionId: string | null
}

const initialState: ResumeState = {
  resume: sampleResume,
  selectedSectionId: 'personal-info',
}

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    updateResume(state, action: PayloadAction<Resume>) {
      state.resume = action.payload
    },
    resetResume(state) {
      state.resume = sampleResume
      state.selectedSectionId = 'personal-info'
    },
    setSelectedSectionId(state, action: PayloadAction<string | null>) {
      state.selectedSectionId = action.payload
    },
    updatePersonalInfo(state, action: PayloadAction<Partial<PersonalInfo>>) {
      state.resume.personalInfo = {
        ...state.resume.personalInfo,
        ...action.payload,
      }
    },
    addSection(
      state,
      action: PayloadAction<
        | {
            id?: string
            title?: string
            type?: SectionType
            itemType?: SectionItemType
            icon?: string
          }
        | undefined
      >,
    ) {
      const payload = action.payload || {}
      const id = payload.id || `sec-${Date.now()}`
      const title = payload.title || 'New Section'
      const type = payload.type || SectionTypes.TEXT
      const itemType = payload.itemType || SectionItemTypes.STANDARD
      const newSection: Section = {
        id,
        title,
        type,
        itemType,
        items: [],
        isVisible: true,
        icon: payload.icon,
      }
      state.resume.sections.push(newSection)
      state.selectedSectionId = id
    },
    updateSectionTitle(
      state,
      action: PayloadAction<{ sectionId: string; title: string }>,
    ) {
      const { sectionId, title } = action.payload
      const section = state.resume.sections.find((s) => s.id === sectionId)
      if (section) {
        section.title = title
      }
    },
    updateSectionIcon(
      state,
      action: PayloadAction<{ sectionId: string; icon: string }>,
    ) {
      const { sectionId, icon } = action.payload
      const section = state.resume.sections.find((s) => s.id === sectionId)
      if (section) {
        section.icon = icon
      }
    },
    updateSectionItemType(
      state,
      action: PayloadAction<{ sectionId: string; itemType: SectionItemType }>,
    ) {
      const { sectionId, itemType } = action.payload
      const section = state.resume.sections.find((s) => s.id === sectionId)
      if (section && section.items.length === 0) {
        section.itemType = itemType
      }
    },
    removeSection(state, action: PayloadAction<string>) {
      state.resume.sections = state.resume.sections.filter(
        (s) => s.id !== action.payload,
      )
      if (state.selectedSectionId === action.payload) {
        state.selectedSectionId = 'personal-info'
      }
    },
    toggleSectionVisibility(state, action: PayloadAction<string>) {
      const section = state.resume.sections.find((s) => s.id === action.payload)
      if (section) {
        section.isVisible = !section.isVisible
      }
    },
    toggleSectionItemVisibility(
      state,
      action: PayloadAction<{ sectionId: string; itemId: string }>,
    ) {
      const { sectionId, itemId } = action.payload
      const section = state.resume.sections.find((s) => s.id === sectionId)
      if (section) {
        const item = section.items.find((i) => i.id === itemId)
        if (item) {
          item.isVisible = item.isVisible === false ? true : false
        }
      }
    },
    updateSectionItem(
      state,
      action: PayloadAction<{
        sectionId: string
        itemId: string
        updates: Partial<SectionItem>
      }>,
    ) {
      const { sectionId, itemId, updates } = action.payload
      const section = state.resume.sections.find((s) => s.id === sectionId)
      if (section) {
        const item = section.items.find((i) => i.id === itemId)
        if (item) {
          Object.assign(item, updates)
        }
      }
    },
    addSectionItem(
      state,
      action: PayloadAction<{ sectionId: string; item: SectionItem }>,
    ) {
      const { sectionId, item } = action.payload
      const section = state.resume.sections.find((s) => s.id === sectionId)
      if (section) {
        section.items.push(item)
        if (!section.itemType) {
          section.itemType = item.type
        }
      }
    },
    removeSectionItem(
      state,
      action: PayloadAction<{ sectionId: string; itemId: string }>,
    ) {
      const { sectionId, itemId } = action.payload
      const section = state.resume.sections.find((s) => s.id === sectionId)
      if (section) {
        section.items = section.items.filter((i) => i.id !== itemId)
      }
    },
    reorderSections(
      state,
      action: PayloadAction<{ startIndex: number; endIndex: number }>,
    ) {
      const { startIndex, endIndex } = action.payload
      const [removed] = state.resume.sections.splice(startIndex, 1)
      state.resume.sections.splice(endIndex, 0, removed)
    },
    reorderSectionItems(
      state,
      action: PayloadAction<{
        sectionId: string
        startIndex: number
        endIndex: number
      }>,
    ) {
      const { sectionId, startIndex, endIndex } = action.payload
      const section = state.resume.sections.find((s) => s.id === sectionId)
      if (section) {
        const [removed] = section.items.splice(startIndex, 1)
        section.items.splice(endIndex, 0, removed)
      }
    },
  },
})

export const {
  updateResume,
  resetResume,
  setSelectedSectionId,
  updatePersonalInfo,
  addSection,
  updateSectionTitle,
  updateSectionIcon,
  updateSectionItemType,
  removeSection,
  toggleSectionVisibility,
  toggleSectionItemVisibility,
  updateSectionItem,
  addSectionItem,
  removeSectionItem,
  reorderSections,
  reorderSectionItems,
} = resumeSlice.actions

export default resumeSlice.reducer
