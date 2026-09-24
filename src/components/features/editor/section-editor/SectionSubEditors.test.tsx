import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import resumeReducer from '../../../../store/resume/resumeSlice.ts'
import themeReducer from '../../../../store/theme/themeSlice.ts'
import StandardSectionEditor from './StandardSectionEditor.tsx'
import TagSectionEditor from './TagSectionEditor.tsx'
import DescriptionSectionEditor from './DescriptionSectionEditor.tsx'
import SocialSectionEditor from './SocialSectionEditor.tsx'
import type { Section } from '../../../../types/resume.types.ts'

const createMockStore = () =>
  configureStore({
    reducer: {
      resume: resumeReducer,
      theme: themeReducer,
    },
  })

describe('Section Sub-Editors (Item Lists)', () => {
  it('renders StandardSectionEditor with standard item inputs, hide button, and arrow buttons', () => {
    const store = createMockStore()
    const section: Section = {
      id: 'sec-exp',
      title: 'Work Experience',
      type: 'experience',
      items: [
        {
          id: 'item-1',
          type: 'standard',
          header: 'Staff Engineer',
          subHeader: 'Google',
          location: 'Mountain View, CA',
          dateRange: { startDate: 'Jan 2021', endDate: 'Present' },
          description: 'Working on Antigravity',
        },
      ],
    }
    const html = renderToStaticMarkup(
      <Provider store={store}>
        <StandardSectionEditor section={section} />
      </Provider>,
    )
    expect(html).toContain('Staff Engineer')
    expect(html).toContain('Google')
    expect(html).toContain('Location')
    expect(html).toContain('Choose Dates')
    expect(html).toContain('Start Date')
    expect(html).toContain('End Date')
    expect(html).toContain('Mountain View, CA')
    expect(html).toContain('Present')
    expect(html).toContain('Hide')
    expect(html).toContain('aria-label="Move item up"')
    expect(html).toContain('aria-label="Move item down"')
  })

  it('renders Hidden badge when item is hidden (isVisible: false)', () => {
    const store = createMockStore()
    const section: Section = {
      id: 'sec-exp',
      title: 'Work Experience',
      type: 'experience',
      items: [
        {
          id: 'item-1',
          type: 'standard',
          header: 'Staff Engineer',
          subHeader: 'Google',
          description: 'Working on Antigravity',
          isVisible: false,
        },
      ],
    }
    const html = renderToStaticMarkup(
      <Provider store={store}>
        <StandardSectionEditor section={section} />
      </Provider>,
    )
    expect(html).toContain('Hidden')
    expect(html).toContain('Show')
  })

  it('renders TagSectionEditor with tag pills, add tag field, and arrow reorder buttons', () => {
    const store = createMockStore()
    const section: Section = {
      id: 'sec-skills',
      title: 'Skills',
      type: 'skills',
      items: [
        {
          id: 'item-1',
          type: 'tag',
          header: 'Languages',
          tags: ['TypeScript', 'JavaScript'],
        },
        {
          id: 'item-2',
          type: 'tag',
          header: 'Frameworks',
          tags: ['React', 'Redux'],
        },
      ],
    }
    const html = renderToStaticMarkup(
      <Provider store={store}>
        <TagSectionEditor section={section} />
      </Provider>,
    )
    expect(html).toContain('Languages')
    expect(html).toContain('TypeScript')
    expect(html).toContain('Frameworks')
    expect(html).toContain('React')
    expect(html).toContain('Add Tag')
    expect(html).toContain('Hide')
    expect(html).toContain('aria-label="Move item up"')
    expect(html).toContain('aria-label="Move item down"')
  })

  it('renders DescriptionSectionEditor with text area, hide button, and arrow buttons', () => {
    const store = createMockStore()
    const section: Section = {
      id: 'sec-desc',
      title: 'Bio',
      type: 'text',
      items: [
        {
          id: 'item-3',
          type: 'description',
          description: 'A passionate developer.',
        },
      ],
    }
    const html = renderToStaticMarkup(
      <Provider store={store}>
        <DescriptionSectionEditor section={section} />
      </Provider>,
    )
    expect(html).toContain('A passionate developer.')
    expect(html).toContain('Hide')
    expect(html).toContain('aria-label="Move item up"')
    expect(html).toContain('aria-label="Move item down"')
  })

  it('renders SocialSectionEditor with platform and url fields, hide button, and arrow buttons', () => {
    const store = createMockStore()
    const section: Section = {
      id: 'sec-social',
      title: 'Social',
      type: 'text',
      items: [
        {
          id: 'item-4',
          type: 'social',
          platform: 'LinkedIn',
          url: 'linkedin.com/in/user',
        },
      ],
    }
    const html = renderToStaticMarkup(
      <Provider store={store}>
        <SocialSectionEditor section={section} />
      </Provider>,
    )
    expect(html).toContain('LinkedIn')
    expect(html).toContain('linkedin.com/in/user')
    expect(html).toContain('Hide')
    expect(html).toContain('aria-label="Move item up"')
    expect(html).toContain('aria-label="Move item down"')
  })
})
