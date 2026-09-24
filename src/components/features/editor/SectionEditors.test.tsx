import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import resumeReducer, {
  updatePersonalInfo,
} from '../../../store/resume/resumeSlice.ts'
import themeReducer from '../../../store/theme/themeSlice.ts'
import PersonalInfoEditor from './section-editor/PersonalInfoEditor.tsx'
import SectionEditor, { getDefaultItemType } from './SectionEditor.tsx'
import {
  type Section,
  SectionItemTypes,
  SectionTypes,
} from '../../../types/resume.types.ts'

const createMockStore = () =>
  configureStore({
    reducer: {
      resume: resumeReducer,
      theme: themeReducer,
    },
  })

describe('Resume Section Editors', () => {
  it('renders PersonalInfoEditor with contact fields and passport photo uploader', () => {
    const store = createMockStore()
    const html = renderToStaticMarkup(
      <Provider store={store}>
        <PersonalInfoEditor />
      </Provider>,
    )
    expect(html).toContain('Personal Information')
    expect(html).toContain('Full Name')
    expect(html).toContain('Email')
    expect(html).toContain('Phone')
    expect(html).toContain('Location')
    expect(html).toContain('Passport Size Photo')
    expect(html).toContain('Indian passport standard ratio (35 × 45 mm)')
    expect(html).toContain('Upload Photo')
  })

  it('renders photo preview, change photo, and remove buttons when photoUrl is present', () => {
    const store = createMockStore()
    store.dispatch(
      updatePersonalInfo({
        photoUrl: 'data:image/png;base64,samplephoto',
      }),
    )
    const html = renderToStaticMarkup(
      <Provider store={store}>
        <PersonalInfoEditor />
      </Provider>,
    )
    expect(html).toContain('Photo Uploaded')
    expect(html).toContain('Change Photo')
    expect(html).toContain('Remove')
    expect(html).toContain('src="data:image/png;base64,samplephoto"')
  })

  it('calculates getDefaultItemType correctly based on items or section category', () => {
    const skillsSec: Section = {
      id: 'sec-sk',
      title: 'Skills',
      type: SectionTypes.SKILLS,
      items: [],
    }
    expect(getDefaultItemType(skillsSec)).toBe(SectionItemTypes.TAG)

    const textSec: Section = {
      id: 'sec-tx',
      title: 'Summary',
      type: SectionTypes.TEXT,
      items: [],
    }
    expect(getDefaultItemType(textSec)).toBe(SectionItemTypes.DESCRIPTION)

    const standardSecWithItems: Section = {
      id: 'sec-std',
      title: 'Work',
      type: SectionTypes.EXPERIENCE,
      items: [
        {
          id: 'item-1',
          type: SectionItemTypes.STANDARD,
          header: 'Role',
          subHeader: 'Company',
          description: '',
        },
      ],
    }
    expect(getDefaultItemType(standardSecWithItems)).toBe(
      SectionItemTypes.STANDARD,
    )
  })

  it('renders SectionEditor header and title input', () => {
    const store = createMockStore()
    const sampleSection: Section = {
      id: 'sec-sample',
      title: 'Experience',
      type: SectionTypes.EXPERIENCE,
      items: [],
    }
    const html = renderToStaticMarkup(
      <Provider store={store}>
        <SectionEditor section={sampleSection} />
      </Provider>,
    )
    expect(html).toContain('Section Title')
    expect(html).toContain('Change section icon')
    expect(html).toContain('Section Item Type')
  })
})
