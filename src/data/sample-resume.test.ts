import { sampleResume } from './sample-resume'
import { SectionTypes } from '../types/resume.types'
import { describe, expect, it } from 'vitest'

describe('sampleResume', () => {
  it('should have personal info', () => {
    expect(sampleResume.personalInfo).toBeDefined()
    expect(sampleResume.personalInfo.name).toBe('Varunalingam V')
  })

  it('should have at least one section', () => {
    expect(sampleResume.sections.length).toBeGreaterThan(0)
  })

  it('should have a work experience section', () => {
    const workExperience = sampleResume.sections.find(
      (section) => section.type === SectionTypes.EXPERIENCE,
    )
    expect(workExperience).toBeDefined()
    expect(workExperience?.items.length).toBeGreaterThan(0)
  })

  it('should have an education section', () => {
    const education = sampleResume.sections.find(
      (section) => section.type === SectionTypes.EDUCATION,
    )
    expect(education).toBeDefined()
    expect(education?.items.length).toBeGreaterThan(0)
  })

  it('should have a skills section', () => {
    const skills = sampleResume.sections.find(
      (section) => section.type === SectionTypes.SKILLS,
    )
    expect(skills).toBeDefined()
    expect(skills?.items.length).toBeGreaterThan(0)
  })
})
